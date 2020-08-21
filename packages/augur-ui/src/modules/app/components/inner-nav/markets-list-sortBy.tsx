import React from 'react';
import classNames from 'classnames';
import { SORT_OPTIONS, THEMES, SORT_OPTIONS_SPORTS } from 'modules/common/constants';
import Styles from 'modules/app/components/inner-nav/markets-list-sortBy.styles.less';
import { SortByIcon } from 'modules/common/icons';
import { RadioBarGroup } from 'modules/common/form';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { MARKET_SORT } from 'modules/app/store/constants';

interface MarketsListSortByProps {
  setFilterSortState: Function;
}

const MarketsListSortBy = ({ setFilterSortState }: MarketsListSortByProps) => {
  const {
    isMobile,
    theme,
    filterSortOptions: { sortBy },
    marketsList: { isSearching },
    actions: { updateFilterSortOptions },
  } = useAppStatusStore();
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
          radioButtons={theme === THEMES.SPORTS ? SORT_OPTIONS_SPORTS : SORT_OPTIONS}
          defaultSelected={sortBy}
          light
          onChange={(value: string) =>
            isMobile
              ? setFilterSortState({ [MARKET_SORT]: value })
              : updateFilterSortOptions({ [MARKET_SORT]: value })
          }
        />
      </div>
    </div>
  );
};
export default MarketsListSortBy;
