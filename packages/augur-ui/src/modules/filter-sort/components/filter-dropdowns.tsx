import React from 'react';
import { SORT_OPTIONS, DEFAULT_MARKET_OFFSET } from 'modules/common/constants';
import Styles from 'modules/filter-sort/components/filter-dropdowns.styles.less';
import { SquareDropdown } from 'modules/common/selection';
import {
  MARKET_SORT,
  MARKET_OFFSET,
} from '../actions/update-filter-sort-options';
import updateMultipleQueries from 'modules/routes/helpers/update-multiple-queries';
import { RefreshButton } from 'modules/common/buttons';

const sortOptions = SORT_OPTIONS.map(option => {
  return {
    value: option.value,
    label: option.header,
  };
});

interface FilterSearchProps {
  defaultSort: string;
  updateFilterSortOptions: Function;
  history: History;
  location: Location;
  refresh: Function
}

const FilterSearch = ({
  defaultSort,
  updateFilterSortOptions,
  history,
  location,
  refresh,
}: FilterSearchProps) => {
  const changeSortDropdown = value => {
    updateMultipleQueries(
      [
        { filterType: MARKET_SORT, value },
        { filterType: MARKET_OFFSET, value: DEFAULT_MARKET_OFFSET },
      ],
      location,
      history
    );

    updateFilterSortOptions({
      [MARKET_SORT]: value,
      [MARKET_OFFSET]: DEFAULT_MARKET_OFFSET,
    });
  };

  return (
    <div className={Styles.FilterDropdowns}>
      <SquareDropdown
        defaultValue={defaultSort}
        options={sortOptions}
        onChange={changeSortDropdown}
        stretchOutOnMobile
      />
      <RefreshButton action={refresh} />
    </div>
  );
};

export default FilterSearch;
