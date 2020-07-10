import React from 'react';
import classNames from 'classnames';
import FilterSearch from 'modules/filter-sort/filter-search';
import MarketCardFormatSwitcher from 'modules/filter-sort/market-card-format-switcher';
import Styles from 'modules/markets-list/components/markets-header.styles.less';
import { FilterButton } from 'modules/common/buttons';
import FilterDropDowns from 'modules/filter-sort/filter-dropdowns';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface MarketsHeaderProps {
  headerTitle: string;
}

const MarketsHeader: React.FC<MarketsHeaderProps> = ({ headerTitle }) => {
  const {
    marketsList: { isSearching },
  } = useAppStatusStore();
  return (
    <article
      className={classNames(Styles.MarketsHeader, {
        [Styles.DisableFilters]: isSearching,
      })}
    >
      <div>
        <FilterSearch />
        {/* MOBILE FILTERS TOGGLE */}
        <FilterButton />
      </div>
      <div>
        <h2>{headerTitle}</h2>
        <FilterSearch />
        <MarketCardFormatSwitcher />
        <FilterDropDowns />
      </div>
    </article>
  );
};

export default MarketsHeader;
