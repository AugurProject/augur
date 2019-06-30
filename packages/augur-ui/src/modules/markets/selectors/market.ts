import createCachedSelector from 're-reselect';
import { formatDai } from 'utils/format-number';
import { YES_NO } from 'modules/common/constants';
import store from 'store';

import {
  selectMarketInfosState,
} from 'store/select-state';
import { MarketData } from 'modules/types';
import { convertMarketInfoToMarketData } from 'utils/convert-marketInfo-marketData';
import { createSelector } from 'reselect';

function selectMarketsDataStateMarket(state, marketId) {
  return selectMarketInfosState(state)[marketId];
}

export const selectMarket = (marketId): MarketData | null => {
  const state = store.getState();
  const marketInfo = selectMarketInfosState(state);

  if (
    !marketId ||
    !marketInfo ||
    !marketInfo[marketId] ||
    !marketInfo[marketId].id
  ) {
    return null;
  }

  return assembleMarket(state, marketId);
};

const assembleMarket = createSelector(
  selectMarketsDataStateMarket,
  (marketData): MarketData => {
  const market: MarketData = convertMarketInfoToMarketData(marketData);

  // TODO: tags will get removed with new nav redesign
  market.tags = (market.tags || []).filter(tag => !!tag);

  // TODO: currently where this data comes from is unknown, need to have discussion about architecture.
  market.unclaimedCreatorFees = formatDai(marketData.unclaimedCreatorFees);
  market.marketCreatorFeesCollected = formatDai(
    marketData.marketCreatorFeesCollected || 0
  );

  return market;
});

export const selectSortedMarketOutcomes = (marketType, outcomes) => {
  const sortedOutcomes = [...outcomes];

  if (marketType === YES_NO) {
    return (
      sortedOutcomes
        // Only keep Invalid [0] / Yes [2]
        .filter(outcome => outcome.id !== 1)
        // Only tradable
        .filter(outcome => outcome.isTradable)
        // Move invalid to the end
        .reverse()
    );
  } else {
    // Move invalid to the end
    sortedOutcomes.push(sortedOutcomes.shift());
    return (
      sortedOutcomes
        // Only tradable
        .filter(outcome => outcome.isTradable)
    );
  }
};
