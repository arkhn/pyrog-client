import React from 'react';
import { Menu, MenuItem, ContextMenu, Tooltip } from '@blueprintjs/core';
import { Attribute } from '@arkhn/fhir.ts';

import AddExtensionSelect from 'components/selects/addExtensionSelect';
import { ApolloProvider, useApolloClient } from 'react-apollo';

interface NodeLabelProps {
  attribute: Attribute;
  addNodeCallback: any;
  addExtensionCallback: any;
  deleteNodeCallback: any;
}

export const NodeLabel = ({
  attribute: {
    types,
    definition,
    id,
    isArray,
    isItem,
    isSlice,
    slices,
    extensions
  },
  addNodeCallback,
  addExtensionCallback,
  deleteNodeCallback
}: NodeLabelProps): React.ReactElement => {
  const client = useApolloClient();
  const renderAddItem = () => (
    <MenuItem icon={'add'} onClick={addNodeCallback} text={'Ajouter un item'} />
  );

  const renderAddExtension = () => (
    <AddExtensionSelect
      loading={false}
      disabled={false}
      items={extensions}
      onChange={addExtensionCallback}
    />
  );

  const renderRemoveItem = () => (
    <MenuItem
      icon={'delete'}
      onClick={deleteNodeCallback}
      text={"Supprimer l'item"}
    />
  );

  const showContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const hasAllowedExtensions =
      !isArray && !!extensions && extensions.length > 0;

    const menu = (
      <ApolloProvider client={client}>
        <Menu>
          {isArray && slices.length === 0 && renderAddItem()}
          {isItem && !isSlice && renderRemoveItem()}
          {hasAllowedExtensions && renderAddExtension()}
        </Menu>
      </ApolloProvider>
    );

    if (
      (isArray && slices.length === 0) ||
      (isItem && !isSlice) ||
      hasAllowedExtensions
    ) {
      ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
    }
  };

  const label = (
    <div className={'node-label'} onContextMenu={showContextMenu}>
      <div>{id}</div>
      <div className={'node-type'}>{types.join(' | ')}</div>
    </div>
  );

  if (!definition.definition) return label;
  return (
    <Tooltip boundary={'viewport'} content={definition.definition}>
      {label}
    </Tooltip>
  );
};
