import React from 'react';

import {
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED,
} from 'modules/common/constants';
import { MarketStateLabel }  from 'modules/common/labels';

import Styles from 'modules/filter-sort/components/market-type-filter.styles.less';

interface MarketTypeFilterProps {
  marketCount: number;
  marketFilter: string;
  isSearchingMarkets: boolean;
  updateMarketsFilter: Function;
}

export const MarketTypeFilter = (
  props: MarketTypeFilterProps
) => {

  const { marketCount, marketFilter, isSearchingMarkets, updateMarketsFilter } = props;
  const marketStatesOptions = [
    { value: MARKET_OPEN, label: 'Open' },
    { value: MARKET_REPORTING, label: 'In-reporting' },
    { value: MARKET_CLOSED, label: 'Resolved' },
  ].map((marketState, idx) => {
    return (
      <MarketStateLabel
        key={idx}
        handleClick={() => updateMarketsFilter(marketState.value)}
        selected={marketFilter === marketState.value}
        loading={isSearchingMarkets}
        count={marketCount}
        label={marketState.label}
        marketType={marketState.value}
      />
    );
  });

  return <div className={Styles.MarketTypeLabels}>{marketStatesOptions}</div>;
};

export default MarketTypeFilter;
