import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { SORT_OPTIONS, DEFAULT_MARKET_OFFSET, THEMES, SORT_OPTIONS_SPORTS } from 'modules/common/constants';
import Styles from 'modules/filter-sort/filter-dropdowns.styles.less';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';
import { PAGINATION_PARAM_NAME } from 'modules/routes/constants/param-names';
import { SquareDropdown } from 'modules/common/selection';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { MARKET_SORT, MARKET_OFFSET } from 'modules/app/store/constants';
import updateMultipleQueries from 'modules/routes/helpers/update-multiple-queries';
import { RefreshButton } from 'modules/common/buttons';

const convertSortOptions = (sortOptions) => sortOptions.map(option => {
  return {
    value: option.value,
    label: option.header,
  };
});

export const FilterSearch = ({ refresh }) => {
  const {
    filterSortOptions: { sortBy: defaultSort },
    actions: { updateFilterSortOptions  },
    theme
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
        options={convertSortOptions(theme === THEMES.SPORTS ? SORT_OPTIONS_SPORTS : SORT_OPTIONS)}
        minimalStyle
        preLabel='sort by'
        onChange={sortOption => {
          goToPageOne();
          updateMultipleQueries(
            [
              { filterType: MARKET_SORT, value: sortOption },
              { filterType: MARKET_OFFSET, value: DEFAULT_MARKET_OFFSET },
            ],
            location,
            history
          );
          updateFilterSortOptions({ [MARKET_SORT]: sortOption, [MARKET_OFFSET]: DEFAULT_MARKET_OFFSET })
        }}
        stretchOutOnMobile
      />
      <RefreshButton action={refresh} />
    </div>
  );
};

export default FilterSearch;
