import React from 'react';
import classNames from 'classnames';
import { SORT_OPTIONS } from 'modules/common/constants';
import Styles from 'modules/app/components/inner-nav/markets-list-sortBy.styles.less';
import { SortByIcon } from 'modules/common/icons';
import { RadioBarGroup } from 'modules/common/form';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface MarketsListFiltersProps {
  marketSort: string;
  updateMarketsSortBy: Function;
  setSortOptions: Function;
}

const MarketsListFilters = ({
  marketSort,
  updateMarketsSortBy,
  setSortOptions,
}: MarketsListFiltersProps) => {
  const { isMobile, marketsList: { isSearching } } = useAppStatusStore();
  return (
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
          defaultSelected={marketSort}
          light
          onChange={(value: string) => isMobile ? setSortOptions(value) : updateMarketsSortBy(value)}
        />
      </div>
    </div>
  );
}
export default MarketsListFilters;
