import {
  MarketInfo,
  MarketInfoOutcome,
} from '@augurproject/sdk/build/state/getter/Markets';
import { MarketData, Consensus, MarketOutcome } from 'modules/types';
import {
  REPORTING_STATE,
  MARKET_OPEN,
  MARKET_CLOSED,
  MARKET_REPORTING,
  CATEGORICAL,
} from 'modules/common/constants';
import { convertUnixToFormattedDate } from './format-date';
import calculatePayoutNumeratorsValue from './calculate-payout-numerators-value';
import { formatPercent, formatDai, formatNone, formatNumber } from './format-number';
import { createBigNumber } from './create-big-number';

export function convertMarketInfoToMarketData(marketInfo: MarketInfo) {
  const reportingFee = parseInt(marketInfo.reportingFeeRate || '0', 10);
  const creatorFee = parseInt(marketInfo.marketCreatorFeeRate || '0', 10);
  const allFee = parseInt(marketInfo.settlementFee || '0', 10);
  const marketData: MarketData = {
    ...marketInfo,
    minPriceBigNumber: createBigNumber(marketInfo.minPrice),
    maxPriceBigNumber: createBigNumber(marketInfo.maxPrice),
    marketOutcomes: processOutcomes(marketInfo),
    marketStatus: getMarketStatus(marketInfo.reportingState),
    endTimeFormatted: convertUnixToFormattedDate(marketInfo.endTime),
    creationTimeFormatted: convertUnixToFormattedDate(marketInfo.creationTime),
    finalizationTimeFormatted: marketInfo.finalizationTime ? convertUnixToFormattedDate(marketInfo.finalizationTime) : null,
    consensusFormatted: processConsensus(marketInfo),
    reportingFeeRatePercent: formatPercent(reportingFee * 100, {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4,
    }),
    marketCreatorFeeRatePercent: formatPercent(creatorFee * 100, {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4,
    }),
    settlementFeePercent: formatPercent(allFee * 100, {
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
  };

  return marketData;
}

function getMarketStatus(reportingState: string) {
  let marketStatus = MARKET_OPEN;
  switch (reportingState) {
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

function processOutcomes(market: MarketInfo): Array<MarketOutcome> {
  return market.outcomes.map(outcome => ({
      ...outcome,
      marketId: market.id,
      lastPricePercent: outcome.price
        ? formatNumber(outcome.price, {
            decimals: 2,
            decimalsRounded: 1,
            denomination: '',
            positiveSign: false,
            zeroStyled: true,
          })
        : formatNone(),
      lastPrice: outcome.price
        ? formatDai(outcome.price || 0, {
            positiveSign: false,
          })
        : formatNone(),
        isTradable: isTradableOutcome(outcome, market.marketType),
        volumeFormatted: formatDai(outcome.volume, {
          positiveSign: false,
        }),
    }));
};

function isTradableOutcome(outcome: MarketInfoOutcome, marketType: string) {
  if (marketType === CATEGORICAL) return true;
  if (outcome.id === 1) return false; // Don't trade No and scalar's outcome 1 in the UI
  return true;
}

function processConsensus(market: MarketInfo): Consensus | null {
  if (market.consensus === null) return null;
  //   - formatted reported outcome
  //   - the percentage of correct reports (for binaries only)
  const winningOutcome = null;
  let outcomeName = null;
  if (market.outcomes.length) {
    const winningOutcome = calculatePayoutNumeratorsValue(
      market,
      market.consensus
    );
    // for scalars, we will just use the winningOutcome for display
    const marketOutcome = market.outcomes.find(
      outcome => outcome.id === parseInt(winningOutcome, 10)
    );
    if (marketOutcome) outcomeName = marketOutcome.description;
  }
  return { payout: market.consensus, winningOutcome, outcomeName };
}
