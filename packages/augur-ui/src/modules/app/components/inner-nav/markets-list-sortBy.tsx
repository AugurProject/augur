import React from 'react';
import classNames from 'classnames';
import {
  MARKET_SORT_PARAMS,
  SORT_OPTIONS,
} from 'modules/common/constants';
import Styles from 'modules/app/components/inner-nav/markets-list-sortBy.styles.less';
import { SortByIcon } from 'modules/common/icons';
import { RadioBarGroup } from 'modules/common/form';

interface MarketsListFiltersProps {
  sortBy: string;
  isSearching: boolean;
  updateMarketsSortBy: Function;
  setSortOptions: Function;
  isMobile: boolean;
}

const MarketsListFilters = ({
  sortBy,
  isSearching,
  updateMarketsSortBy,
  setSortOptions,
  isMobile,
}: MarketsListFiltersProps) => (
  <div className={Styles.Filters}>
    <div
      className={classNames(Styles.FiltersGroup, {
        [Styles.Searching]: isSearching,
      })}
    >
      <div>
        {SortByIcon}
        Sort By
      </div>
      <RadioBarGroup
        radioButtons={SORT_OPTIONS}
        defaultSelected={sortBy}
        onChange={(value: string) => isMobile ? setSortOptions(value) : updateMarketsSortBy(value)}
      />
    </div>
  </div>
);

export default MarketsListFilters;
