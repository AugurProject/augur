import React from 'react';

import FilterBox from 'modules/portfolio/components/common/filter-box';
import { MarketProgress } from 'modules/common/progress';
import { FavoritesButton } from 'modules/common/buttons';
import { END_TIME, THEMES } from 'modules/common/constants';

import Styles from 'modules/portfolio/components/common/quad.styles.less';
import favoriteStyles from 'modules/portfolio/components/favorites/favorites.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { selectMarket } from 'modules/markets/selectors/market';
import { MarketData } from "modules/types";

const sortByOptions = [
  {
    label: 'Most Recently Added',
    value: 'recentlyTraded',
    comp(marketA, marketB) {
      return marketB.favoriteAddedData - marketA.favoriteAddedData;
    },
  },
  {
    label: 'Market Creation',
    value: 'marketCreation',
    comp(marketA, marketB) {
      return marketB.creationTime - marketA.creationTime;
    },
  },
  {
    label: 'Expiring Soonest',
    value: END_TIME,
    comp(marketA, marketB) {
      return marketA.endTime.timestamp - marketB.endTime.timestamp;
    },
  },
];

function filterComp(input, market) {
  if (!market) return false;
  return market.description
    ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0
    : true;
}

interface FavoritesProps {
  toggle: Function;
}

const Favorites = ({
  toggle,
}: FavoritesProps) => {
  const { theme, favorites } = useAppStatusStore();

  const markets = Object.keys(favorites).reduce(
    (filtered: any, marketId: string) => [
      ...filtered,
      { ...selectMarket(marketId), favoriteAddedData: favorites[marketId] }
    ],
    [],
  );

  const isTrading = theme === THEMES.TRADING;
  let customClass = favoriteStyles.Watchlist;
  if (!isTrading && markets.length === 0) {
    customClass = favoriteStyles.WatchlistEmptyDisplay;
  }
  function renderRightContent(market) {
    return (
      <div className={Styles.MultiColumn}>
        <MarketProgress
          reportingState={market.reportingState}
          endTimeFormatted={market.endTimeFormatted}
          reportingWindowEndTime={
            (market.disputeInfo &&
              market.disputeInfo.disputeWindow &&
              market.disputeInfo.disputeWindow.endTime) ||
            0
          }
          alignRight
        />
        <FavoritesButton
          marketId={market.id}
          hideText
          isSmall
        />
      </div>
    );
  };

  return (
    <FilterBox
      title={isTrading ? 'Watchlist' : 'Favorites'}
      customClass={customClass}
      sortByOptions={sortByOptions}
      sortByStyles={isTrading ? { minWidth: '10.625rem' } : {}}
      markets={markets}
      filterComp={filterComp}
      renderRightContent={renderRightContent}
      noToggle
      filterLabel="markets"
      toggle={toggle}
      pickVariables={[
        'id',
        'favoriteAddedData',
        'description',
        'reportingState',
        'endTime',
        'creationTime',
      ]}
      emptyDisplayText={
        isTrading ? null : "You don't have any favorite market to show!"
      }
    />
  );
};

export default Favorites;
