import axios from 'axios';

import { IAction, IThunkAction } from 'types';
import {
  AIRFLOW_PASSWORD,
  AIRFLOW_RIVER_DAG_CONFIG,
  AIRFLOW_URL,
  AIRFLOW_USER
} from '../../constants';

export const listRecurringBatch = (): IThunkAction => {
  return async (dispatch): Promise<IAction> => {
    try {
      const { data } = await axios.get(
        `${AIRFLOW_URL}/variables/${AIRFLOW_RIVER_DAG_CONFIG}`,
        {
          auth: { username: AIRFLOW_USER!, password: AIRFLOW_PASSWORD! }
        }
      );
      dispatch({
        type: 'LIST_RECURRING_BATCH_SUCCESS',
        payload: data
      });
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      dispatch({
        type: 'LIST_RECURRING_BATCH_FAILED',
        payload: errMessage
      });
    }
  };
};

export default listRecurringBatch;
