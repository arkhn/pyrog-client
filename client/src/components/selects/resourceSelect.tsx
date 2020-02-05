import * as React from 'react';
import { MenuItem, Intent, Position } from '@blueprintjs/core';
import {
  ItemPredicate,
  ItemListPredicate,
  ItemRenderer
} from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import TSelect from './TSelect';

interface Resource {
  id: string;
  label: string;
  primaryKeyOwner: string;
  primaryKeyTable: string;
  primaryKeyColumn: string;
  definition: {
    id: string;
    type: string;
  };
}

interface SelectProps {
  disabled?: boolean;
  icon?: IconName;
  inputItem: Resource;
  intent?: Intent;
  items: Resource[];
  loading?: boolean;
  onChange: any;
}

export default class ResourceSelect extends React.Component<SelectProps, any> {
  private renderItem: ItemRenderer<Resource> = (
    resource: Resource,
    { handleClick, modifiers, query }
  ) => {
    return (
      <MenuItem
        key={resource.id}
        onClick={handleClick}
        text={resource.definition.type}
        label={resource.label}
      />
    );
  };

  private filterByName: ItemPredicate<Resource> = (
    query,
    resource: Resource
  ) => {
    return (
      `${resource.definition.type.toLowerCase()}`.indexOf(
        query.toLowerCase()
      ) >= 0
    );
  };

  private sortItems: ItemListPredicate<Resource> = (
    query,
    resources: Resource[]
  ) => {
    resources.sort((r1, r2) => {
      const name1 = r1.definition.type.toLowerCase();
      const name2 = r2.definition.type.toLowerCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    });
    return resources;
  };

  private displayItem = function(resource: Resource): string {
    return resource.definition ? resource.definition.type : 'None';
  };

  public render() {
    const {
      disabled,
      icon,
      inputItem,
      intent,
      items,
      loading,
      onChange
    } = this.props;

    return (
      <TSelect<Resource>
        disabled={!!disabled}
        displayItem={this.displayItem}
        filterItems={this.filterByName}
        sortItems={this.sortItems}
        loading={loading}
        icon={icon}
        inputItem={inputItem}
        intent={intent}
        items={items}
        onChange={onChange}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.RIGHT_BOTTOM,
          usePortal: true
        }}
        renderItem={this.renderItem}
      />
    );
  }
}
