import { Getters } from '@augurproject/sdk';
import { MarketData, Consensus, OutcomeFormatted } from 'modules/types';
import {
  REPORTING_STATE,
  MARKET_OPEN,
  MARKET_CLOSED,
  MARKET_REPORTING,
  CATEGORICAL,
  SCALAR,
  SCALAR_DOWN_ID,
  INVALID_OUTCOME_ID,
} from 'modules/common/constants';
import { convertUnixToFormattedDate } from './format-date';
import {
  formatPercent,
  formatDai,
  formatNone,
  formatNumber,
  formatAttoRep,
} from './format-number';
import { createBigNumber } from './create-big-number';
import { keyBy } from './key-by';
import { getOutcomeNameWithOutcome } from './get-outcome';

export function convertMarketInfoToMarketData(
  marketInfo: Getters.Markets.MarketInfo
) {
  const reportingFee = parseInt(marketInfo.reportingFeeRate || '0', 10);
  const creatorFee = parseInt(marketInfo.marketCreatorFeeRate || '0', 10);
  const allFee = createBigNumber(marketInfo.settlementFee || '0');
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
    }),
    volumeFormatted: formatDai(marketInfo.volume, {
      positiveSign: false,
    }),
    unclaimedCreatorFeesFormatted: formatDai('0'), // TODO: figure out where this comes from
    marketCreatorFeesCollectedFormatted: formatDai('0'), // TODO: figure out where this comes from
    disputeInfo: processDisputeInfo(
      marketInfo.marketType,
      marketInfo.disputeInfo,
      marketInfo.outcomes
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
    case REPORTING_STATE.PRE_REPORTING:
      marketStatus = MARKET_OPEN;
      break;
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
  return market.outcomes.map(outcome => ({
    ...outcome,
    marketId: market.id,
    lastPricePercent: outcome.price
      ? formatNumber(outcome.price, {
          decimals: 2,
          decimalsRounded: 1,
          positiveSign: false,
          zeroStyled: true,
        })
      : formatNone(),
    lastPrice: outcome.price
      ? formatDai(outcome.price || 0, {
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
  outcomes: Getters.Markets.MarketInfoOutcome[]
): Getters.Markets.DisputeInfo {
  if (!disputeInfo) return disputeInfo;
  if (marketType === SCALAR) {
    const invalidIncluded = disputeInfo.stakes.find(
      s => Number(s.outcome) === INVALID_OUTCOME_ID
    );
    // add blank outcome
    const blankStake = getEmptyStake(null, disputeInfo.bondSizeOfNewStake);
    if (invalidIncluded) {
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
): Consensus | null {
  const isScalar = market.marketType === SCALAR;
  if (market.reportingState === REPORTING_STATE.FINALIZED) {
    return {
      ...market.consensus,
      winningOutcome: market.consensus.outcome,
      outcomeName: isScalar
        ? market.consensus.outcome
        : getOutcomeNameWithOutcome(
            market,
            market.consensus.outcome,
            market.consensus.invalid
          ),
    };
  }

  if (market.reportingState === REPORTING_STATE.AWAITING_FINALIZATION) {
    const winning = market.disputeInfo.stakes.find(s => s.tentativeWinning);
    return {
      ...winning,
      winningOutcome: winning.outcome,
      outcomeName: isScalar
        ? winning.outcome
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
