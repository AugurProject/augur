import { formatDai } from 'utils/format-number';
import {
  YES_NO,
  SCALAR,
  INVALID_OUTCOME_ID,
  SCALAR_DOWN_ID,
} from 'modules/common/constants';
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
    return sortedOutcomes.reverse();
  } else {
    // Move invalid to the end
    return sortedOutcomes.push(sortedOutcomes.shift());
  }
};

export const selectSortedDisputingOutcomes = (
  marketType: string,
  outcomes: OutcomeFormatted[],
  stakes: Getters.Markets.StakeDetails[] | null
): OutcomeFormatted[] => {
  const sorted = stakes
    ? stakes
        .sort((a, b) => {
          if (a.tentativeWinning) return -1;
          if (
            createBigNumber(a.stakeCurrent).gt(createBigNumber(b.stakeCurrent))
          )
            return 1;
          if (
            createBigNumber(b.stakeCurrent).gt(createBigNumber(a.stakeCurrent))
          )
            return -1;
          return 0;
        })
        .map(s => createBigNumber(s.outcome))
    : [];
  if (marketType === SCALAR) {
    const filteredSortedOutcomes = [
      outcomes.find(o => (o.id = INVALID_OUTCOME_ID)),
    ];
    const genericScalarOutcome = outcomes.find(o => (o.id = SCALAR_DOWN_ID));
    if (sorted.length === 0) return filteredSortedOutcomes;
    const result = sorted.reduce(
      (p, s) => [...p, { ...genericScalarOutcome, id: s }],
      []
    );
    return result;
  }

  if (stakes.length > 0) {
    const stakedOutcomes: OutcomeFormatted[] = sorted.map(id =>
      outcomes.find(o => createBigNumber(o.id).eq(createBigNumber(id)))
    );

    return outcomes.reduce(
      (p, outcome) =>
        p.find(s => createBigNumber(s.id).eq(createBigNumber(outcome.id)))
          ? p
          : [...p, outcome],
      stakedOutcomes
    );
  }

  return selectSortedMarketOutcomes(marketType, outcomes);
};
