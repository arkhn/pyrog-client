import { ISimpleAction, DagConf, BatchResponse } from 'types';

const initialState: BatchResponse = {
  data: {},
  error: null
};

const recurringBatchList = (
  state = initialState,
  action: ISimpleAction
): any => {
  switch (action.type) {
    case 'LIST_RECURRING_BATCH_SUCCESS': {
      return {
        data: action.payload
          ? JSON.parse(action.payload.value).reduce(
              (acc: Record<string, DagConf>, dag: DagConf) => ({
                ...acc,
                [dag.dag_id]: { ...dag }
              }),
              {}
            )
          : [],
        error: null
      };
    }
    case 'LIST_RECURRING_BATCH_FAILED': {
      return {
        ...state,
        error: action.payload
      };
    }
    default:
      return state;
  }
};

export default recurringBatchList;
