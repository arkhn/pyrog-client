import {
  Table,
  Column,
  Cell,
  TableLoadingOption,
  RowHeaderCell,
  SelectionModes,
  IRegion
} from '@blueprintjs/table';
import React from 'react';
import axios from 'axios';

import './style.scss';
import { Icon } from '@blueprintjs/core';
import { useSelector } from 'react-redux';
import { IReduxStore, ISelectedSource } from 'types';
import { PAGAI_URL, RIVER_URL } from '../../../constants';
import FhirPreview from './FhirPreview';
import StringSelect from 'components/selects/stringSelect';

interface Props {
  source: ISelectedSource;
}

const TableViewer = ({ source }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);

  const [table, setTable] = React.useState(resource?.primaryKeyTable);
  const [compatiblePreview, setCompatiblePreview] = React.useState(false);

  const [loadingTable, setLoadingTable] = React.useState(false);
  const [fields, setFields] = React.useState([] as string[]);
  const [rows, setRows] = React.useState<any[]>([]);

  const [previewData, setPreviewData] = React.useState<any>(undefined);
  const [loadingPreview, setLoadingPreview] = React.useState(false);

  const tables = Object.keys(source.credential.schema);

  const fetchPreview = React.useCallback(
    async selectedRows => {
      setLoadingPreview(true);
      setPreviewData(undefined);
      try {
        const res = await axios.post(
          `${RIVER_URL}/preview`,
          {
            resource_id: resource.id,
            primary_key_values: [
              rows[selectedRows][fields.indexOf(resource.primaryKeyColumn)]
            ]
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setPreviewData(res.data);
      } catch (err) {
        toaster.show({
          message: err.response ? err.response.data : err.message,
          intent: 'danger',
          icon: 'warning-sign',
          timeout: 6000
        });
      }
      setLoadingPreview(false);
    },
    [fields, rows, resource, toaster]
  );

  const onSelection = (regions: IRegion[]) => {
    if (!compatiblePreview) return;
    if (regions.length === 0) return;

    const [{ rows: selectedRows }] = regions;
    if (!selectedRows) return;

    const [rowIndex] = selectedRows;
    fetchPreview(rowIndex);
  };

  const renderRowHeader = (index: number) => (
    <RowHeaderCell
      className="previewButton"
      nameRenderer={() => <Icon icon="flame" />}
    />
  );

  React.useEffect(() => {
    setCompatiblePreview(resource && table === resource?.primaryKeyTable);
  }, [table, resource]);
  React.useEffect(() => {
    setTable(resource?.primaryKeyTable);
  }, [resource]);

  React.useEffect(() => {
    if (resource && table) {
      setLoadingTable(true);
      axios
        .get(`${PAGAI_URL}/explore/${resource.id}/${table}`)
        .then((res: any) => {
          setLoadingTable(false);
          setRows(res.data.rows);
          setFields(res.data.fields);
        })
        .catch((err: any) => {
          setLoadingTable(false);
          toaster.show({
            message: err.response ? err.response.data : err.message,
            intent: 'danger',
            icon: 'properties',
            timeout: 10000
          });
        });
    }
  }, [resource, source.credential.owner, table, toaster]);

  return (
    <div id="tableViewer">
      <StringSelect
        icon={'th'}
        inputItem={table}
        items={tables}
        maxItems={100}
        onChange={(t: string) => {
          setTable(t);
        }}
      />
      <Table
        numRows={rows.length}
        enableColumnReordering={false}
        enableRowResizing={false}
        rowHeaderCellRenderer={compatiblePreview ? renderRowHeader : undefined}
        enableMultipleSelection={false}
        onSelection={onSelection}
        selectionModes={SelectionModes.ROWS_ONLY}
        loadingOptions={
          loadingTable
            ? [
                TableLoadingOption.CELLS,
                TableLoadingOption.COLUMN_HEADERS,
                TableLoadingOption.ROW_HEADERS
              ]
            : []
        }
      >
        {fields.map((field: string, index: number) => (
          <Column
            key={index}
            name={field}
            cellRenderer={(i: number) => <Cell>{rows[i][index]}</Cell>}
          />
        ))}
      </Table>
      <FhirPreview previewData={previewData} loading={loadingPreview} />
    </div>
  );
};

export default TableViewer;
