import React from 'react';
import Styles from 'modules/sidebar/sidebar.styles.less';
import { CloseIcon } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/stores/app-status';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { CheckboxGroup, RadioBarGroup } from 'modules/common/selection';

const categoryItems = [
  {
    label: 'All',
    value: 'All',
    selected: true
  },
  {
    label: 'Crypto',
    value: 'Crypto'
  },
  {
    label: 'Economics',
    value: 'Economics'
  },
  {
    label: 'Entertainment',
    value: 'Entertainment'
  },
  {
    label: 'Medical',
    value: 'Medical'
  },
  {
    label: 'Sports',
    value: 'Sports'
  },
  {
    label: 'Other',
    value: 'Other'
  },
];

const sortByItems = [
  {
    label: 'Total Volume',
    value: 'Total Volume',
    selected: true
  },
  {
    label: '24hr volume',
    value: '24hr volume'
  },
  {
    label: 'liquidity',
    value: 'liquidity'
  },
  {
    label: 'ending soon',
    value: 'ending soon'
  },
];

const marketStatusItems = [
  {
    label: 'Open',
    value: 'Open',
    selected: true
  },
  {
    label: 'In Settlement',
    value: 'In Settlement'
  },
  {
    label: 'Finalised',
    value: 'Finalised'
  },
];

const currencyItems = [
  {
    label: 'All',
    value: 'All',
    selected: true
  },
  {
    label: 'ETH',
    value: 'ETH'
  },
  {
    label: 'USDC',
    value: 'USDC'
  },
];

export const Sidebar = () => {
  const {
    actions: { setFilterSidebar },
  } = useAppStatusStore();
  return (
    <div className={Styles.Sidebar}>
      <div className={Styles.Header}>
        <span>filters</span>
        <span onClick={() => setFilterSidebar(false)}>{CloseIcon}</span>
      </div>
      <div className={Styles.Body}>
        <CheckboxGroup title='categories' items={categoryItems}/>
        <RadioBarGroup title='sort by' items={sortByItems}/>
        <CheckboxGroup title='market status' items={marketStatusItems}/>
        <CheckboxGroup title='currency' items={currencyItems}/>
      </div>
      <div className={Styles.Footer}>
        <PrimaryButton text='reset all' />
        <SecondaryButton text='apply filters' />
      </div>
    </div>
  );
};
