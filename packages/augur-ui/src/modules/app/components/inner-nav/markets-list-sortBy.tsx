import React from 'react';
import classNames from 'classnames';
import {
  MARKET_SORT_PARAMS,
  SORT_OPTIONS,
} from 'modules/common/constants';
import Styles from 'modules/app/components/inner-nav/markets-list-sortBy.styles.less';
import { RadioBarGroup } from 'modules/common/form';

interface MarketsListFiltersProps {
  marketSort: string;
  isSearching: boolean;
  updateMarketsSortBy: Function;
}

const MarketsListFilters = (props: MarketsListFiltersProps) => (
  <div className={Styles.Filters}>
    <div
      className={classNames(Styles.FiltersGroup, {
        [Styles.Searching]: props.isSearching,
      })}
    >
      <div>Sort By</div>
      <RadioBarGroup
        radioButtons={SORT_OPTIONS}
        defaultSelected={props.marketSort}
        onChange={(value: string) => {
          props.updateMarketsSortBy(value);
        }}
      />
    </div>
  </div>
);

export default MarketsListFilters;
