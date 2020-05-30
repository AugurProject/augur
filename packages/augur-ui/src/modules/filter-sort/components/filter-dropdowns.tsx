import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { SORT_OPTIONS } from 'modules/common/constants';
import Styles from 'modules/filter-sort/components/filter-dropdowns.styles.less';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';
import { PAGINATION_PARAM_NAME } from 'modules/routes/constants/param-names';
import { SquareDropdown } from 'modules/common/selection';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { MARKET_SORT } from 'modules/app/store/constants';

const sortOptions = SORT_OPTIONS.map(option => {
  return {
    value: option.value,
    label: option.header,
  };
});

export const FilterSearch = () => {
  const {
    filterSortOptions: { marketSort: defaultSort },
    actions: { updateFilterSortOptions },
  } = useAppStatusStore();
  const history = useHistory();
  const location = useLocation();
  const goToPageOne = () => {
    let search = parseQuery(location.search);
    delete search[PAGINATION_PARAM_NAME];
    search = makeQuery(search);
    history.push({
      ...location,
      search,
    });
  };

  return (
    <div className={Styles.FilterDropdowns}>
      <SquareDropdown
        defaultValue={defaultSort}
        options={sortOptions}
        onChange={sortOption => {
          goToPageOne();
          updateFilterSortOptions({ [MARKET_SORT]: sortOption })
        }}
        stretchOutOnMobile
      />
    </div>
  );
};

export default FilterSearch;
