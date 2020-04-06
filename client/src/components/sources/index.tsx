import { Alert, Button, Intent, Spinner } from '@blueprintjs/core';
import * as QueryString from 'query-string';
import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';
import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';

import { changeSelectedSource } from 'services/selectedNode/actions';
import { HTTP_BACKEND_URL } from '../../constants';
import { onError } from 'services/apollo';
import { IReduxStore, ISelectedSource } from 'types';

import { SourceCard } from './sourceCard';
import './style.scss';

// GRAPHQL
const qSources = loader('src/graphql/queries/sources.graphql');
const mDeleteSource = loader('src/graphql/mutations/deleteSource.graphql');

const SourcesView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { history } = useReactRouter();

  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [sourceToDelete, setSourceToDelete] = React.useState(
    undefined as ISelectedSource | undefined
  );
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const { data: dataSources, loading: loadingSources } = useQuery(qSources, {
    fetchPolicy: 'cache-and-network'
  });

  const removeSourceFromCache = (
    cache: any,
    { data: { deleteSource } }: any
  ): void => updateCachedSource(cache, deleteSource, true);

  const updateCachedSource = (
    cache: any,
    source: ISelectedSource,
    toDelete?: boolean
  ): void => {
    try {
      const { sources } = cache.readQuery({
        query: qSources
      });
      const newSources = sources.reduce(
        (acc: ISelectedSource[], val: ISelectedSource) => {
          if (val.id === source.id) {
            if (!toDelete) acc.push(source);
          } else acc.push(val);
          return acc;
        },
        []
      );
      cache.writeQuery({
        query: qSources,
        data: { sources: newSources }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [deleteSource, { loading: deletingSource }] = useMutation(
    mDeleteSource,
    { update: removeSourceFromCache, onError: onError(toaster) }
  );

  const onSelectSource = async (source: ISelectedSource) => {
    try {
      const response = await fetch(
        `${HTTP_BACKEND_URL}/schemas/${source.template.name}_${source.name}.json`
      );
      const body = await response.json();
      if (response.status !== 200) {
        throw new Error(body.error);
      }
      dispatch(changeSelectedSource(source, body));
    } catch (err) {
      console.log(`error fetching source schema: ${err}`);
      dispatch(changeSelectedSource(source, undefined));
    }
    history.push({
      pathname: '/mapping',
      search: QueryString.stringify({
        sourceId: source.id
      })
    });
  };

  const onDeleteButton = (
    source: ISelectedSource,
    e: React.MouseEvent
  ): void => {
    e.stopPropagation();
    setSourceToDelete(source);
    setIsAlertOpen(true);
  };

  return (
    <div>
      <Navbar />
      <div id="main-container-softwares">
        <Button
          icon="add"
          intent="primary"
          large={true}
          onClick={() => {
            history.push('/newSource');
          }}
        >
          Ajouter une source / un logiciel
        </Button>
        <div id="software-cards">
          {loadingSources ? (
            <Spinner />
          ) : (
            dataSources.sources.map((source: ISelectedSource) => (
              <SourceCard
                key={source.id}
                source={source}
                onSelect={onSelectSource}
                onDelete={onDeleteButton}
                onUpdate={updateCachedSource}
                deleting={deletingSource && sourceToDelete?.id === source.id}
              />
            ))
          )}
        </div>
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Confirm"
          icon="trash"
          intent={Intent.DANGER}
          isOpen={isAlertOpen}
          canOutsideClickCancel={true}
          onConfirm={async () => {
            await deleteSource({
              variables: {
                sourceId: sourceToDelete ? sourceToDelete.id : ''
              }
            });
          }}
          onClose={() => {
            setIsAlertOpen(false);
            setSourceToDelete(undefined);
          }}
        >
          <p className="delete-warning">
            Etes-vous sûr de vouloir supprimer la source
            <b> {sourceToDelete ? sourceToDelete.name : ''}</b> ?<br />
            Cette action n'est pas réversible.
          </p>
        </Alert>
      </div>
    </div>
  );
};

export default SourcesView;
