import { formatDai } from 'utils/format-number';
import { YES_NO, SCALAR } from 'modules/common/constants';
import store, { AppState } from 'store';
import { selectMarketInfosState } from 'store/select-state';
import { MarketData, OutcomeFormatted } from 'modules/types';
import { convertMarketInfoToMarketData } from 'utils/convert-marketInfo-marketData';
import { createSelector } from 'reselect';
import { Getters } from '@augurproject/sdk';
import { createBigNumber } from 'utils/create-big-number';

function selectMarketsDataStateMarket(state, marketId) {
  return selectMarketInfosState(state)[marketId];
}

export const selectMarket = (marketId): MarketData | null => {
  const state = store.getState() as AppState;
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

    // TODO: currently where this data comes from is unknown, need to have discussion about architecture.
    market.unclaimedCreatorFees = formatDai(marketData.unclaimedCreatorFees);
    market.marketCreatorFeesCollected = formatDai(
      marketData.marketCreatorFeesCollected || 0
    );

    return market;
  }
);

export const selectSortedMarketOutcomes = (marketType, outcomes) => {
  const sortedOutcomes = [...outcomes];

  if (marketType === YES_NO) {
    return sortedOutcomes.filter(outcome => outcome.isTradable).reverse();
  } else {
    // Move invalid to the end
    sortedOutcomes.push(sortedOutcomes.shift());
    return sortedOutcomes.filter(outcome => outcome.isTradable);
  }
};

export const selectSortedDisputingOutcomes = (
  marketType: string,
  outcomes: OutcomeFormatted[],
  stakes: Getters.Markets.StakeDetails[] | null
): OutcomeFormatted[] => {
  if (marketType === SCALAR) {
    return outcomes;
  }
  if (stakes && stakes.length > 0)
    return stakes
      .sort((a, b) => {
        if (
          createBigNumber(a.bondSizeCurrent).gt(
            createBigNumber(b.bondSizeCurrent)
          )
        )
          return -1;
        if (
          createBigNumber(b.bondSizeCurrent).gt(
            createBigNumber(a.bondSizeCurrent)
          )
        )
          return 1;
        return 0;
      })
      .map(s => outcomes.find(o => o.id === parseInt(s.outcome, 10)));

  return selectSortedMarketOutcomes(marketType, outcomes);
};
