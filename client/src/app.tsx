import React from 'react';
import axios from 'axios';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { PersistGate } from 'redux-persist/integration/react';
import { createLogger } from 'redux-logger';

import { HttpLink, InMemoryCache, ApolloClient } from 'apollo-client-preset';
import { ApolloLink, fromPromise } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { ApolloProvider } from 'react-apollo';

import './style.scss';
import Routes from './routes';
import {
  HTTP_BACKEND_URL,
  ACCESS_TOKEN_STORAGE_KEY,
  ID_TOKEN_STORAGE_KEY,
  TOKEN_URL
} from './constants';
import { refreshToken, removeTokens } from 'oauth/tokenManager';
import { ISimpleAction } from 'types';
import { logout as logoutAction } from 'services/user/actions';

// Reducers

// Data fetching reducers
import fhirReducer from './services/fhir';
import exploredTableReducer from './services/exploredTable/reducer';
import batchListReducer from './services/batchList/reducer';
import recurringBatchListReducer from './services/recurringBatchList/reducer';
import scriptListReducer from './services/scripts/reducer';
import recommendedColumns from './services/recommendedColumns/reducer';
import selectedNodeReducer from './services/selectedNode/reducer';
import resourceAttributesReducer from 'services/resourceAttributes/reducer';
import userReducer from './services/user/reducer';

// View reducers
import mimic from './components/mimic/reducer';
import { Button } from '@material-ui/core';
import { Icon } from '@blueprintjs/core';

// REDUX

// Middlewares
const middlewares = [
  function thunkMiddleware({ dispatch, getState }: any) {
    return function(next: any) {
      return function(action: any) {
        return typeof action === 'function'
          ? action(dispatch, getState)
          : next(action);
      };
    };
  }
];
if (process.env.NODE_ENV === 'development') {
  // Log redux dispatch only in development
  middlewares.push(createLogger({}));
}

// Data reducer (also called canonical state)
const dataReducer = combineReducers({
  recommendedColumns
});

// View reducer
const viewReducer = combineReducers({
  mimic
});

const mainReducer = combineReducers({
  data: dataReducer,
  exploredTable: exploredTableReducer,
  fhir: fhirReducer,
  batchList: batchListReducer,
  recurringBatchList: recurringBatchListReducer,
  scriptList: scriptListReducer,
  selectedNode: selectedNodeReducer,
  resourceAttributes: resourceAttributesReducer,
  views: viewReducer,
  user: userReducer
});

// Store
const persistConfig = {
  key: 'root',
  storage
};
const persistedReducer = persistReducer(persistConfig, mainReducer);

const finalCreateStore = applyMiddleware(...middlewares)(createStore);
const store = finalCreateStore(persistedReducer);

const persistor = persistStore(store);

const redirectToLogin = () => {
  removeTokens();
  store.dispatch(logoutAction() as ISimpleAction);
};

// AXIOS

// Set axios interceptor
axios.interceptors.request.use(config => {
  if (
    !config.auth && !(
      config.headers.Authorization &&
      config.headers.Authorization.startsWith('Bearer')
    )
  ) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Add an interceptor to refresh access token when needed
axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.url.startsWith(TOKEN_URL)
    ) {
      redirectToLogin();
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const success = await refreshToken();
      if (!success) {
        redirectToLogin();
        return Promise.reject(error);
      }
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

// APOLLO

// HttpLink
const httpLink = new HttpLink({
  uri: HTTP_BACKEND_URL,
  fetch: fetch
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const idToken = localStorage.getItem(ID_TOKEN_STORAGE_KEY);
  operation.setContext({
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      IdToken: idToken ? idToken : ''
    }
  });

  return forward(operation);
});

const httpLinkAuth = middlewareLink.concat(httpLink);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const tokenExpiredLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.statusCode === 401) {
        redirectToLogin();
      }
    }
  }
});

const afterwareLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.statusCode === 401) {
        return fromPromise(refreshToken()).flatMap(
          // retry the request, returning the new observable
          () => {
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                Authorization: `Bearer ${localStorage.getItem(
                  ACCESS_TOKEN_STORAGE_KEY
                )}`
              }
            });
            return forward(operation);
          }
        );
      }
    }
  }
});

// Aggregate all links
const links = [];
if (process.env.NODE_ENV === 'development') {
  links.push(errorLink);
}
links.push(tokenExpiredLink);
links.push(afterwareLink);
links.push(httpLinkAuth);

// Client
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link: ApolloLink.from(links)
});

// add action to all snackbars
const notistackRef = React.createRef<SnackbarProvider>();
const onClickDismiss = (key: SnackbarKey) => () => {
  notistackRef.current!.closeSnackbar(key);
};
const App = (): React.ReactElement => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          ref={notistackRef}
          action={key => (
            <Button onClick={onClickDismiss(key)}>
              <Icon icon="cross" />
            </Button>
          )}
        >
          <Routes />
        </SnackbarProvider>
      </PersistGate>
    </ApolloProvider>
  </Provider>
);

export default App;
