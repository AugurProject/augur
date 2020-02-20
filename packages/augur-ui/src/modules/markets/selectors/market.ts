import { formatNumber } from 'utils/format-number';
import {
  YES_NO,
  SCALAR,
  INVALID_OUTCOME_ID,
  SCALAR_DOWN_ID,
  ZERO,
} from 'modules/common/constants';
import store, { AppState } from 'appStore';
import { selectMarketInfosState } from 'appStore/select-state';
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
  (marketData): MarketData => convertMarketInfoToMarketData(marketData)
);

export const selectSortedMarketOutcomes = (marketType, outcomes: OutcomeFormatted[]) => {
  const sortedOutcomes = [...outcomes];

  if (marketType === YES_NO) {
    return sortedOutcomes.reverse();
  }
  // Move invalid to the end
  sortedOutcomes.push(sortedOutcomes.shift());
  return sortedOutcomes;
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
    return buildScalarDisputingOutcomes(outcomes, sortedStakes);
  return buildYesNoCategoricalDisputingOutcomes(outcomes, sortedStakes);
};

const sortStakes = (stakes: Getters.Markets.StakeDetails[]) => {
  const winning = stakes.filter(s => s.tentativeWinning);
  const nonWinning = stakes.filter(s => !s.tentativeWinning);
  const sortedOutcomes = nonWinning.sort((a, b) => {
    if (createBigNumber(a.stakeCurrent).gt(createBigNumber(b.stakeCurrent)))
      return -1;
    if (createBigNumber(b.stakeCurrent).gt(createBigNumber(a.stakeCurrent)))
      return 1;
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
  const { marketId, description: denom } = outcomes[SCALAR_DOWN_ID]; // get denomination

  if (sortedStakes.length === 0) return [invalidOutcome];

  const results = sortedStakes.reduce((p, s) => {
    if (s.outcome === null) return p;
    return s.isInvalidOutcome
      ? [...p, invalidOutcome]
      : [
          ...p,
          {
            // description is displayed as outcome in dispute form
            id: Number(s.outcome),
            description: `${s.outcome} ${denom}`,
            marketId,
            lastPricePercent: null,
            lastPrice: null,
            volumeFormatted: formatNumber(ZERO),
            price: null,
            volume: '0',
            isTradeable: true,
          } as OutcomeFormatted,
        ];
  }, []);

  return results.find(o => o.id === INVALID_OUTCOME_ID)
    ? results
    : [...results, invalidOutcome];
};

const buildYesNoCategoricalDisputingOutcomes = (
  outcomes: OutcomeFormatted[],
  sortedStakes: Getters.Markets.StakeDetails[]
) => {
  const stakedOutcomes: OutcomeFormatted[] = sortedStakes
    .map(stake =>
      outcomes.find(o =>
        createBigNumber(o.id).eq(createBigNumber(stake.outcome))
      )
    )
    .filter(o => !!o);

  const result = outcomes.reduce(
    (p, outcome) =>
      p.find(s => createBigNumber(s.id).eq(createBigNumber(outcome.id)))
        ? p
        : [...p, outcome],
    stakedOutcomes
  );
  return result;
};
