import { formatDai } from 'utils/format-number';
import {
  YES_NO,
  SCALAR,
  INVALID_OUTCOME_ID,
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
    sortedOutcomes.push(sortedOutcomes.shift());
    return sortedOutcomes;
  }
};

export const selectSortedDisputingOutcomes = (
  marketType: string,
  outcomes: OutcomeFormatted[],
  stakes: Getters.Markets.StakeDetails[] | null
): OutcomeFormatted[] => {
  if (!stakes || stakes.length === 0)
    return selectSortedMarketOutcomes(marketType, outcomes);

  const sortedStakes = sortStakes(stakes);
  if (marketType === SCALAR)
    buildScalarDisputingOutcomes(outcomes, sortedStakes);
  return buildYesNoCategoricalDisputingOutcomes(outcomes, sortedStakes);
};

const sortStakes = (stakes: Getters.Markets.StakeDetails[]) => {
  const winning = stakes.filter(s => s.tentativeWinning);
  const nonWinning = stakes.filter(s => !s.tentativeWinning);
  const sortedOutcomes = nonWinning.sort((a, b) => {
    if (createBigNumber(a.stakeCurrent).gt(createBigNumber(b.stakeCurrent)))
      return 1;
    if (createBigNumber(b.stakeCurrent).gt(createBigNumber(a.stakeCurrent)))
      return -1;
    return 0;
  });
  return [...winning, ...sortedOutcomes];
};

const buildScalarDisputingOutcomes = (
  outcomes: OutcomeFormatted[],
  sortedStakes: Getters.Markets.StakeDetails[]
) => {
  // always add invalid
  const invalidOutcome = outcomes[INVALID_OUTCOME_ID];
  const denom = invalidOutcome.description;

  if (sortedStakes.length === 0) return [invalidOutcome];

  const results = sortedStakes.map(s =>
    s.isInvalidOutcome
      ? invalidOutcome
      : { // only need id and description properties for disputing card
          id: s.outcome,
          description: denom,
        }
  );
  return results.find(o => o.id === INVALID_OUTCOME_ID)
    ? results
    : [...results, invalidOutcome];
};

const buildYesNoCategoricalDisputingOutcomes = (
  outcomes: OutcomeFormatted[],
  sortedStakes: Getters.Markets.StakeDetails[]
) => {
  const stakedOutcomes: OutcomeFormatted[] = sortedStakes.map(stake =>
    outcomes.find(o => createBigNumber(o.id).eq(createBigNumber(stake.outcome)))
  ).filter(o => !!o);

  const result = outcomes.reduce(
    (p, outcome) =>
      p.find(s => createBigNumber(s.id).eq(createBigNumber(outcome.id)))
        ? p
        : [...p, outcome],
    stakedOutcomes
  );
  return result;
};
