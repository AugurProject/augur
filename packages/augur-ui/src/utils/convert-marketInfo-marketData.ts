import type { Getters } from '@augurproject/sdk';
import {
  ARCHIVED_MARKET_LENGTH,
  CATEGORICAL,
  INVALID_OUTCOME_ID,
  MARKET_CLOSED,
  MARKET_OPEN,
  MARKET_REPORTING,
  REPORTING_STATE,
  SCALAR,
  SCALAR_DOWN_ID,
  SCALAR_UP_ID,
  INVALID_OUTCOME_LABEL,
} from 'modules/common/constants';
import {
  ConsensusFormatted,
  MarketData,
  OutcomeFormatted,
} from 'modules/types';
import { createBigNumber } from './create-big-number';
import deepClone from './deep-clone';
import { getDurationBetween, convertUnixToFormattedDate } from './format-date';
import {
  formatAttoRep,
  formatDaiPrice,
  formatNone,
  formatNumber,
  formatPercent,
  formatDai,
} from './format-number';
import { getOutcomeNameWithOutcome } from './get-outcome';
import { keyBy } from './key-by';

export function convertMarketInfoToMarketData(
  marketInfo: Getters.Markets.MarketInfo,
  currentTimestamp: number
) {
  const reportingFee = parseInt(marketInfo.reportingFeeRate || '0', 10);
  const creatorFee = parseInt(marketInfo.marketCreatorFeeRate || '0', 10);
  const allFee = createBigNumber(marketInfo.settlementFee || '0');
  const archivedDuration = marketInfo.finalizationTime && getDurationBetween(marketInfo.finalizationTime, currentTimestamp / 1000);
  const marketData: MarketData = {
    ...marketInfo,
    marketId: marketInfo.id,
    minPriceBigNumber: createBigNumber(marketInfo.minPrice),
    maxPriceBigNumber: createBigNumber(marketInfo.maxPrice),
    outcomesFormatted: processOutcomes(marketInfo),
    marketStatus: getMarketStatus(marketInfo.reportingState),
    endTimeFormatted: convertUnixToFormattedDate(marketInfo.endTime),
    creationTimeFormatted: convertUnixToFormattedDate(marketInfo.creationTime),
    categories: marketInfo.categories,
    isArchived: archivedDuration && (Math.abs(archivedDuration.asDays()) >= ARCHIVED_MARKET_LENGTH),
    finalizationTimeFormatted: marketInfo.finalizationTime
      ? convertUnixToFormattedDate(marketInfo.finalizationTime)
      : null,
    consensusFormatted: processConsensus(marketInfo),
    defaultSelectedOutcomeId: getDefaultOutcomeSelected(marketInfo.marketType),
    reportingFeeRatePercent: formatPercent(reportingFee * 100, {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4,
    }),
    noShowBondAmountFormatted: formatAttoRep(marketInfo.noShowBondAmount),
    marketCreatorFeeRatePercent: formatPercent(creatorFee * 100, {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4,
    }),
    settlementFeePercent: formatPercent(allFee.multipliedBy(100), {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4,
    }),
    openInterestFormatted: formatDai(marketInfo.openInterest, {
      positiveSign: false,
      decimals: 0,
      decimalsRounded: 0,
    }),
    volumeFormatted: formatDai(marketInfo.volume, {
      positiveSign: false,
      decimals: 0,
      decimalsRounded: 0,
    }),
    unclaimedCreatorFeesFormatted: formatDai('0'), // TODO: figure out where this comes from
    marketCreatorFeesCollectedFormatted: formatDai('0'), // TODO: figure out where this comes from
    disputeInfo: processDisputeInfo(
      marketInfo.marketType,
      marketInfo.disputeInfo,
      marketInfo.outcomes,
      marketInfo.isWarpSync,
    ),
  };

  return marketData;
}

export function getDefaultOutcomeSelected(marketType: string) {
  if (marketType === CATEGORICAL) return 1;
  return 2;
}

function getMarketStatus(reportingState: string) {
  let marketStatus = MARKET_OPEN;
  switch (reportingState) {
    case REPORTING_STATE.UNKNOWN:
    case REPORTING_STATE.PRE_REPORTING:
      marketStatus = MARKET_OPEN;
      break;
    case REPORTING_STATE.AWAITING_FINALIZATION:
    case REPORTING_STATE.FINALIZED:
      marketStatus = MARKET_CLOSED;
      break;
    default:
      marketStatus = MARKET_REPORTING;
      break;
  }
  return marketStatus;
}

function processOutcomes(
  market: Getters.Markets.MarketInfo
): OutcomeFormatted[] {
  const isScalar = market.marketType === SCALAR;
  const outcomes = deepClone<Getters.Markets.MarketInfoOutcome[]>(market.outcomes);
  if (
    market.reportingState === REPORTING_STATE.FINALIZED ||
    market.reportingState === REPORTING_STATE.AWAITING_FINALIZATION
  ) {
    isScalar
      ? outcomes.forEach(o => (o.price = null))
      : outcomes.forEach(o => (o.price = market.minPrice));
    let invalid = false;
    let outcome = null;
    if (market.reportingState === REPORTING_STATE.FINALIZED) {
      invalid = market.consensus.invalid;
      outcome = market.consensus.outcome;
    } else {
      const tentativeWinner =  market.disputeInfo && market.disputeInfo.stakes.find(
        s => s.tentativeWinning
      );
      invalid = tentativeWinner && tentativeWinner.isInvalidOutcome;
      outcome = tentativeWinner && tentativeWinner.outcome;
    }
    if (invalid) {
      outcomes.find(o => o.id === INVALID_OUTCOME_ID).price = market.maxPrice;
    } else {
      const winner = outcomes.find(o => o.id === Number(outcome));
      if (winner) {
        winner.price = market.maxPrice;
      }
      if (isScalar) {
        outcomes.find(o => o.id === SCALAR_UP_ID).price = String(outcome);
      }
    }
  }

  return outcomes.map(outcome => ({
    ...outcome,
    marketId: market.id,
    lastPricePercent: outcome.price
      ? formatNumber(outcome.price, {
          decimals: 3,
          decimalsRounded: 1,
          positiveSign: false,
          zeroStyled: true,
        })
      : formatNone(),
    lastPrice: !!outcome.price
      ? formatDaiPrice(outcome.price || 0, {
          positiveSign: false,
        })
      : formatNone(),
    volumeFormatted: formatDai(outcome.volume, {
      positiveSign: false,
    }),
    isTradeable:
      market.marketType === SCALAR && outcome.id === SCALAR_DOWN_ID
        ? false
        : true,
  }));
}

function getEmptyStake(outcomeId: string | null, bondSizeOfNewStake: string) {
  return {
    outcome: outcomeId !== null ? outcomeId : null,
    bondSizeCurrent: bondSizeOfNewStake,
    stakeCurrent: '0',
    stakeRemaining: bondSizeOfNewStake,
    isInvalidOutcome: outcomeId === String(INVALID_OUTCOME_ID),
    isMalformedOutcome: false,
    tentativeWinning: false,
  };
}

// fill in missing stakes
function processDisputeInfo(
  marketType: string,
  disputeInfo: Getters.Markets.DisputeInfo,
  outcomes: Getters.Markets.MarketInfoOutcome[],
  isWarpSync: boolean,
): Getters.Markets.DisputeInfo {
  if (!disputeInfo) return disputeInfo;
  if (marketType === SCALAR) {
    const invalidIncluded = disputeInfo.stakes.find(
      s => s.isInvalidOutcome
    );
    // add blank outcome
    const blankStake = getEmptyStake(null, disputeInfo.bondSizeOfNewStake);
    if (invalidIncluded || isWarpSync) {
      return { ...disputeInfo, stakes: [...disputeInfo.stakes, blankStake] };
    } else {
      return {
        ...disputeInfo,
        stakes: [
          ...disputeInfo.stakes,
          getEmptyStake(
            String(INVALID_OUTCOME_ID),
            disputeInfo.bondSizeOfNewStake
          ),
          blankStake,
        ],
      };
    }
  }

  const outcomesNotStaked = outcomes
    .map(o => o.id)
    .reduce(
      (p, id) =>
        p.includes(String(id))
          ? p.filter(pid => pid !== String(id))
          : [...p, String(id)],
      disputeInfo.stakes.map(s => s.outcome)
    );

  const addedStakes = outcomesNotStaked.map(o =>
    getEmptyStake(String(o), disputeInfo.bondSizeOfNewStake)
  );

  return {
    ...disputeInfo,
    stakes: [...disputeInfo.stakes, ...addedStakes],
  };
}

function processConsensus(
  market: Getters.Markets.MarketInfo
): ConsensusFormatted | null {
  const isScalar = market.marketType === SCALAR;
  if (market.reportingState === REPORTING_STATE.FINALIZED) {
    return {
      ...market.consensus,
      winningOutcome: market.consensus.outcome,
      outcomeName: isScalar
        ? market.consensus.invalid ? INVALID_OUTCOME_LABEL : market.consensus.outcome
        : getOutcomeNameWithOutcome(
            market,
            market.consensus.outcome,
            market.consensus.invalid
          ),
    };
  }

  if (market.reportingState === REPORTING_STATE.AWAITING_FINALIZATION) {
    if (!market.disputeInfo) return null;
    const winning = market.disputeInfo.stakes.find(s => s.tentativeWinning);
    if (!winning) return null;
    return {
      ...winning,
      winningOutcome: winning.outcome,
      outcomeName: isScalar
        ? winning.isInvalidOutcome ? INVALID_OUTCOME_LABEL : winning.outcome
        : getOutcomeNameWithOutcome(
            market,
            winning.outcome,
            winning.isInvalidOutcome
          ),
    };
  }
  return null;
}

export const keyMarketInfoCollectionByMarketId = (
  marketInfos: Getters.Markets.MarketInfo[]
) => {
  return keyBy(marketInfos, 'id');
};
