import React from 'react';
import classNames from 'classnames';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import MarketCardFormatSwitcher from 'modules/filter-sort/components/market-card-format-switcher';
import Styles from 'modules/markets-list/components/markets-header.styles.less';
import { FilterButton } from 'modules/common/buttons';
import FilterDropDowns from 'modules/filter-sort/containers/filter-dropdowns';

interface MarketsHeaderProps {
  filter: string;
  sort: string;
  isSearchingMarkets: boolean;
  marketCardFormat: string;
  updateMarketsListCardFormat: Function;
  headerTitle: string;
}

const MarketsHeader: React.FC<MarketsHeaderProps> = props => {
  const {
    isSearchingMarkets,
    marketCardFormat,
    updateMarketsListCardFormat,
    headerTitle
  } = props;

  return (
    <article
      className={classNames(Styles.MarketsHeader, {
        [Styles.DisableFilters]: isSearchingMarkets,
      })}
    >
      <div>
        <FilterSearch isSearchingMarkets={isSearchingMarkets} />
        {/* MOBILE FILTERS TOGGLE */}
        <FilterButton />
      </div>
      <div>
        <h2>{headerTitle}</h2>
        <FilterSearch isSearchingMarkets={isSearchingMarkets} />
        <MarketCardFormatSwitcher
          marketCardFormat={marketCardFormat}
          updateMarketsListCardFormat={updateMarketsListCardFormat}
        />
        <FilterDropDowns />
      </div>
    </article>
  );
};

export default MarketsHeader;
