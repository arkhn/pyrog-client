import * as React from 'react';
import { Intent, IPopoverProps, MenuItem } from '@blueprintjs/core';

import { ItemListPredicate, ItemRenderer } from '@blueprintjs/select';
import { IconName } from '@blueprintjs/icons';

import TSelect from './TSelect';

interface ISelectProps {
  disabled?: boolean;
  displayItem?: (item: string) => string;
  icon?: IconName;
  inputItem: string;
  intent?: Intent;
  items: string[];
  doSort?: boolean;
  maxItems?: number;
  loading?: boolean;
  filterable?: boolean;
  onChange: any;
  popoverProps?: IPopoverProps;
}

export default class StringSelect extends React.Component<ISelectProps, any> {
  private renderItem: ItemRenderer<string> = (item, { handleClick }) => {
    const { displayItem } = this.props;
    return (
      <MenuItem
        key={item}
        onClick={handleClick}
        text={(displayItem || this.displayItem)(item)}
      />
    );
  };

  private filterList: ItemListPredicate<string> = (query, items) => {
    const stringSet = new Set(
      items.filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
    );
    items
      .filter(item => item.toLowerCase().indexOf(query.toLowerCase()) >= 0)
      .forEach(e => stringSet.add(e));
    return [...stringSet].slice(0, this.props.maxItems || 100);
  };

  private sortItems = (resources: string[]): string[] =>
    resources.sort((s1: string, s2: string): number => s1.localeCompare(s2));

  private displayItem = (item: string): string => item || 'None';

  public render() {
    const {
      disabled,
      displayItem,
      icon,
      inputItem,
      intent,
      loading,
      onChange,
      filterable,
      popoverProps
    } = this.props;

    const doSort = (this.props.doSort === undefined || this.props.doSort === true);
    const items = this.props.items ? (
      doSort ? this.sortItems(this.props.items) : this.props.items
    ) : []

    return (
      <TSelect<string>
        disabled={!!disabled}
        displayItem={displayItem || this.displayItem}
        filterList={this.filterList}
        filterable={filterable}
        loading={loading}
        icon={icon}
        inputItem={inputItem}
        intent={intent}
        items={items}
        onChange={onChange}
        renderItem={this.renderItem}
        popoverProps={popoverProps}
      />
    );
  }
}
