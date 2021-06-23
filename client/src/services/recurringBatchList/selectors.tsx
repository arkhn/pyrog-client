import { IReduxStore } from 'types';

const getRecurringBatchList = (state: IReduxStore) => state.recurringBatchList;

export default getRecurringBatchList;
