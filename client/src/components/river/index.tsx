import axios from 'axios';
import { Button, Tag } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import listBatch from '../../services/batchList/actions';
import getBatchList from '../../services/batchList/selectors';
import listRecurringBatch from '../../services/recurringBatchList/actions';
import getRecurringBatchList from '../../services/recurringBatchList/selectors';
import StringSelect from '../selects/stringSelect';
import { useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import { v4 as uuid } from 'uuid';

import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';

import SourceSelect from 'components/selects/sourceSelect';
import ResourceMultiSelect from 'components/selects/resourceMultiSelect';

import { Resource } from 'types';
import {
  AIRFLOW_URL,
  AIRFLOW_USER,
  AIRFLOW_PASSWORD,
  AIRFLOW_RIVER_DAG_CONFIG,
  RIVER_URL
} from '../../constants';
import { UPDATE_FREQUENCIES } from 'components/river/constants';

import './style.scss';

interface Source {
  id: string;
  name: string;
  template: {
    name: string;
  };
  credential: {
    id: string;
  };
  resources: Resource[];
}

// GRAPHQL
const qSourcesAndResources = loader(
  'src/graphql/queries/sourcesAndResources.graphql'
);

const UPDATE_FREQUENCY_CHOICES = Object.keys(UPDATE_FREQUENCIES);

const FhirRiverView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { data: batchList, error: batchListError } = useSelector(getBatchList);
  const {
    data: recurringBatchList,
    error: recurringBatchListError
  } = useSelector(getRecurringBatchList);

  const [selectedSource, setSelectedSource] = useState({} as Source);
  const [selectedResources, setSelectedResources] = useState([] as Resource[]);
  const [selectedFrequency, setSelectedFrequency] = useState(
    UPDATE_FREQUENCY_CHOICES[0]
  );
  const [running, setRunning] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedRecurringBatch, setSelectedRecurringBatch] = useState('');

  const { data } = useQuery(qSourcesAndResources, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    dispatch(listBatch());
    dispatch(listRecurringBatch());
  }, [dispatch]);

  useEffect(() => {
    if (batchListError) {
      enqueueSnackbar(
        `Problem while listing current batches: ${batchListError}`,
        {
          variant: 'error'
        }
      );
    }
  }, [batchListError, enqueueSnackbar]);

  const sources = data ? data.sources : [];
  const resources =
    sources.length > 0
      ? sources
          .map((source: any) => source.resources)
          .reduce(
            (acc: Resource[], resources: Resource[]) => [...acc, ...resources],
            []
          )
      : [];
  const credentials = selectedSource.id ? selectedSource.credential : undefined;
  const credentialsMissing = !!selectedSource.id && !credentials;

  const isItemSelected = (list: any[], item: any): boolean => {
    return list.includes(item);
  };

  const handleSourceSelect = (source: Source): void => {
    setSelectedSource(source);
  };
  const handleResourceSelect = (resource: Resource): void => {
    if (!isItemSelected(selectedResources, resource)) {
      setSelectedResources([...selectedResources, resource]);
    } else {
      selectedResources.splice(selectedResources.indexOf(resource), 1);
      setSelectedResources([...selectedResources]);
    }
  };
  const handleSelectAll = (): void => {
    if (selectedResources.length === selectedSource.resources.length) {
      setSelectedResources([]);
    } else {
      setSelectedResources([...selectedSource.resources]);
    }
  };

  const handleTagRemove = (_value: string, index: number): void => {
    selectedResources.splice(index, 1);
    setSelectedResources([...selectedResources]);
  };

  const createOneTimeBatch = async (): Promise<void> => {
    try {
      await axios.post(
        `${RIVER_URL}/api/batch/`,
        {
          resources: selectedResources.map(r => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            resource_id: r.id,
            // eslint-disable-next-line @typescript-eslint/camelcase
            resource_type: r.definition.type
          }))
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      dispatch(listBatch());

      enqueueSnackbar(`Batch was successfully created`, {
        variant: 'success'
      });
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      enqueueSnackbar(`Error while creating batch ${errMessage}`, {
        variant: 'error'
      });
    }
  };

  const createRecurringBatch = async (): Promise<void> => {
    try {
      // Provide river with mapping
      const mappingId = `recurring_mapping_${uuid()}`;
      await axios.post(
        `${RIVER_URL}/api/mapping/`,
        {
          mapping_id: mappingId,
          resource_ids: selectedResources.map(r => r.id)
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      // Create Ariflow DAG
      const airflowVariableResp = await axios.get(
        `${AIRFLOW_URL}/variables/${AIRFLOW_RIVER_DAG_CONFIG}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          auth: { username: AIRFLOW_USER!, password: AIRFLOW_PASSWORD! }
        }
      );
      const airflowVariable = JSON.parse(airflowVariableResp.data['value']);
      const newAirflowVariable = [
        ...airflowVariable,
        {
          dag_id: uuid(),
          mapping_id: mappingId,
          source_name: selectedSource.name,
          resources: selectedResources.map(r => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            resource_id: r.id,
            // eslint-disable-next-line @typescript-eslint/camelcase
            resource_type: r.definition.type
          })),
          schedule_interval: UPDATE_FREQUENCIES[selectedFrequency]
        }
      ];
      await axios.post(
        `${AIRFLOW_URL}/variables`,
        {
          key: AIRFLOW_RIVER_DAG_CONFIG,
          value: JSON.stringify(newAirflowVariable)
        },
        {
          headers: { 'Content-Type': 'application/json' },
          auth: { username: AIRFLOW_USER!, password: AIRFLOW_PASSWORD! }
        }
      );
      enqueueSnackbar(`Batch was successfully created`, {
        variant: 'success'
      });
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      enqueueSnackbar(`Error while creating batch ${errMessage}`, {
        variant: 'error'
      });
    }
  };

  const handleClickCreateBatch = async (): Promise<void> => {
    setRunning(true);
    const runOnce = selectedFrequency === 'run once';
    if (runOnce) createOneTimeBatch();
    else createRecurringBatch();
    setRunning(false);
  };

  const handleClickCancelBatch = async (): Promise<void> => {
    if (!selectedBatch) return;
    try {
      await axios.delete(`${RIVER_URL}/api/batch/${selectedBatch}/`);
      setSelectedBatch('');
      dispatch(listBatch());
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      enqueueSnackbar(`Problem while deleting a batch: ${errMessage}`, {
        variant: 'error'
      });
    }
  };

  const handleClickCancelRecurringBatch = async (): Promise<void> => {
    if (!selectedBatch) return;
    try {
      await axios.delete(`${RIVER_URL}/api/batch/${selectedBatch}/`);
      setSelectedBatch('');
      dispatch(listBatch());
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      enqueueSnackbar(`Problem while deleting a batch: ${errMessage}`, {
        variant: 'error'
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div id="main-div">
        <h1>Select source</h1>
        <p>
          Choose the source you want to process with the ETL. Note that you need
          to provide the credentials for the source database before.
        </p>
        <SourceSelect
          items={sources}
          onChange={handleSourceSelect}
          inputItem={selectedSource}
        />
        {credentialsMissing && (
          <b className="creds-alert">
            No credentials provided for this source.
          </b>
        )}
        <h1>Select resources</h1>
        <p>
          Choose all the resources you want to process with the ETL. Note that
          you need to select a source before
        </p>
        <ResourceMultiSelect
          resources={selectedSource.resources || []}
          selectedResources={selectedResources}
          onResourceSelect={handleResourceSelect}
          onSelectAll={handleSelectAll}
          onRemoveTag={handleTagRemove}
        />
        <h1>Select an update frequency</h1>
        <p>
          Select the frequency at which you want the batch to be re-run in order
          to update your fhir warehouse. Choose "run once" if you don't want any
          automatic update.
        </p>
        <StringSelect
          items={UPDATE_FREQUENCY_CHOICES}
          inputItem={selectedFrequency}
          doSort={false}
          onChange={(freq: string): void => setSelectedFrequency(freq)}
        />
        <div className="align-right">
          <Button
            intent="primary"
            large
            disabled={!selectedSource.id || credentialsMissing}
            loading={running}
            className="button-submit"
            onClick={handleClickCreateBatch}
          >
            Make the river flow
          </Button>
        </div>
        <h1>Cancel a batch</h1>
        <StringSelect
          items={
            batchList
              ? Object.keys(batchList).map(
                  (batchId: string) => batchList[batchId].timestamp
                )
              : []
          }
          inputItem={
            !!selectedBatch && !batchListError
              ? batchList[selectedBatch].timestamp
              : 'Select a batch to cancel'
          }
          onChange={(item: string): void => {
            const batchId = Object.keys(batchList).find(
              batchId => batchList[batchId].timestamp === item
            );
            if (batchId) setSelectedBatch(batchId);
          }}
        />
        {selectedBatch ? (
          <div>
            <h2>The selected batch contains the following resources</h2>
            <ul>
              {!!selectedBatch &&
                batchList[selectedBatch].resources.map(resource => {
                  return (
                    <li key={resource.resource_id}>
                      <Tag>
                        {
                          resources.find(
                            (r: Resource) => r.id === resource.resource_id
                          ).definition.type
                        }
                      </Tag>
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : null}
        <div className="align-right">
          <Button
            intent="danger"
            large
            disabled={!selectedBatch || !!batchList.error}
            className="button-submit"
            onClick={handleClickCancelBatch}
          >
            Cancel
          </Button>
        </div>
        <h1>Cancel a recurring batch</h1>
        <StringSelect
          items={
            recurringBatchList
              ? Object.keys(recurringBatchList).map(
                  (dagId: string) => recurringBatchList[dagId].source_name
                )
              : []
          }
          inputItem={
            !!selectedRecurringBatch && !recurringBatchListError
              ? recurringBatchList[selectedRecurringBatch].source_name
              : 'Select a batch to cancel'
          }
          onChange={(item: string): void => {
            const batchId = Object.keys(recurringBatchList).find(
              batchId => recurringBatchList[batchId].dag_id === item
            );
            if (batchId) setSelectedRecurringBatch(batchId);
          }}
        />
        <div className="align-right">
          <Button
            intent="danger"
            large
            disabled={!selectedBatch || !!batchList.error}
            className="button-submit"
            onClick={handleClickCancelRecurringBatch}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FhirRiverView;
