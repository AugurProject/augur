import createCachedSelector from "re-reselect";
import { createBigNumber } from "utils/create-big-number";
import {
  formatShares,
  formatEther,
  formatPercent,
  formatNumber
} from "utils/format-number";
import { convertUnixToFormattedDate } from "utils/format-date";
import {
  YES_NO,
  CATEGORICAL,
  SCALAR,
  ZERO,
  YES_NO_INDETERMINATE_OUTCOME_ID,
  CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID,
  INDETERMINATE_OUTCOME_NAME,
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED
} from "modules/common-elements/constants";

import { constants } from "services/constants";
import { getOutcomeName } from "utils/get-outcome";

import store from "src/store";

import {
  selectAggregateOrderBook,
  selectTopBid,
  selectTopAsk
} from "modules/orders/helpers/select-order-book";
import getOrderBookSeries from "modules/orders/selectors/order-book-series";

import { positionSummary } from "modules/positions/selectors/positions-summary";

import { selectReportableOutcomes } from "modules/reports/selectors/reportable-outcomes";

import calculatePayoutNumeratorsValue from "utils/calculate-payout-numerators-value";

import {
  selectMarketsDataState,
  selectOutcomesDataState,
  selectOrderBooksState,
  selectOrderCancellationState,
  selectAccountShareBalance,
  selectAccountPositionsState
} from "src/select-state";

export const selectMarket = marketId => {
  const state = store.getState();
  const marketsData = selectMarketsDataState(state);

  if (
    !marketId ||
    !marketsData ||
    !marketsData[marketId] ||
    !marketsData[marketId].id
  ) {
    return {};
  }

  return getMarketSelector(state, marketId);
};

function selectMarketsDataStateMarket(state, marketId) {
  return selectMarketsDataState(state)[marketId];
}

function selectOutcomesDataStateMarket(state, marketId) {
  return selectOutcomesDataState(state)[marketId];
}

function selectOrderBooksStateMarket(state, marketId) {
  return selectOrderBooksState(state)[marketId];
}

function selectAccountShareBalanceMarket(state, marketId) {
  return selectAccountShareBalance(state)[marketId];
}

function selectAccountPositionsStateMarket(state, marketId) {
  return selectAccountPositionsState(state)[marketId];
}

const getMarketSelector = createCachedSelector(
  selectMarketsDataStateMarket,
  selectOutcomesDataStateMarket,
  selectOrderBooksStateMarket,
  selectOrderCancellationState,
  selectAccountShareBalanceMarket,
  selectAccountPositionsStateMarket,
  (
    marketData,
    marketOutcomesData,
    orderBooks,
    orderCancellation,
    accountShareBalances,
    accountPositions
  ) =>
    assembleMarket(
      marketData,
      marketOutcomesData,
      orderBooks,
      orderCancellation,
      accountShareBalances,
      accountPositions
    )
)((state, marketId) => marketId);

const assembleMarket = (
  marketData,
  marketOutcomesData,
  orderBooks,
  orderCancellation,
  accountShareBalances,
  accountPositions
) => {
  const marketId = marketData.id;
  const market = {
    ...marketData,
    description: marketData.description || "",
    id: marketId
  };

  if (typeof market.minPrice !== "undefined")
    market.minPrice = createBigNumber(market.minPrice);
  if (typeof market.maxPrice !== "undefined")
    market.maxPrice = createBigNumber(market.maxPrice);

  switch (market.marketType) {
    case YES_NO:
      market.isYesNo = true;
      market.isCategorical = false;
      market.isScalar = false;
      delete market.scalarDenomination;
      break;
    case CATEGORICAL:
      market.isYesNo = false;
      market.isCategorical = true;
      market.isScalar = false;
      delete market.scalarDenomination;
      break;
    case SCALAR:
      market.isYesNo = false;
      market.isCategorical = false;
      market.isScalar = true;
      break;
    default:
      break;
  }

  market.endTime = convertUnixToFormattedDate(marketData.endTime);
  market.creationTime = convertUnixToFormattedDate(marketData.creationTime);

  switch (market.reportingState) {
    case constants.REPORTING_STATE.PRE_REPORTING:
      market.marketStatus = MARKET_OPEN;
      break;
    case constants.REPORTING_STATE.AWAITING_FINALIZATION:
    case constants.REPORTING_STATE.FINALIZED:
      market.marketStatus = MARKET_CLOSED;
      break;
    default:
      market.marketStatus = MARKET_REPORTING;
      break;
  }

  market.reportingFeeRatePercent = formatPercent(
    marketData.reportingFeeRate * 100,
    {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4
    }
  );
  market.marketCreatorFeeRatePercent = formatPercent(
    marketData.marketCreatorFeeRate * 100,
    {
      positiveSign: false,
      decimals: 4,
      decimalsRounded: 4
    }
  );
  market.settlementFeePercent = formatPercent(marketData.settlementFee * 100, {
    positiveSign: false,
    decimals: 4,
    decimalsRounded: 4
  });
  market.openInterest = formatEther(marketData.openInterest, {
    positiveSign: false
  });
  market.volume = formatEther(marketData.volume, {
    positiveSign: false
  });

  market.resolutionSource = market.resolutionSource
    ? market.resolutionSource
    : undefined;

  const numCompleteSets =
    (accountShareBalances &&
      accountShareBalances.length > 0 &&
      Math.min.apply(null, accountShareBalances).toString()) ||
    "0";

  const userTradingPositions = accountPositions || {};
  if (market.outcomes) {
    market.userPositions = Object.values(
      userTradingPositions.tradingPositions || []
    ).map(position => {
      const outcome = market.outcomes[position.outcome];
      return {
        ...positionSummary(position, outcome),
        outcomeName: getOutcomeName(market, outcome)
      };
    });
  }

  if (createBigNumber(numCompleteSets).gt(ZERO)) {
    // need to remove all 0 positions
    market.userPositions = market.userPositions.filter(
      pos =>
        !createBigNumber(pos.quantity.value).isEqualTo(ZERO) ||
        !createBigNumber(pos.unrealizedNet.value).isEqualTo(ZERO) ||
        !createBigNumber(pos.realizedNet.value).isEqualTo(ZERO)
    );
  }

  market.outcomes = Object.keys(marketOutcomesData || {})
    .map(outcomeId => {
      const outcomeData = marketOutcomesData[outcomeId];
      const volume = createBigNumber(outcomeData.volume);

      const outcome = {
        ...outcomeData,
        id: outcomeId,
        marketId,
        lastPrice: formatEther(outcomeData.price || 0, {
          positiveSign: false
        })
      };
      if (volume && volume.eq(ZERO)) {
        outcome.lastPrice.formatted = "—";
      }
      if (market.isScalar) {
        // note: not actually a percent
        if (volume && volume.gt(ZERO)) {
          outcome.lastPricePercent = formatNumber(outcome.lastPrice.value, {
            decimals: 2,
            decimalsRounded: 1,
            denomination: "",
            positiveSign: false,
            zeroStyled: true
          });
          // format-number thinks 0 is '-', need to correct
          if (outcome.lastPrice.fullPrecision === "0") {
            outcome.lastPricePercent.formatted = "0";
            outcome.lastPricePercent.full = "0";
          }
        } else {
          const midPoint = createBigNumber(market.minPrice, 10)
            .plus(createBigNumber(market.maxPrice, 10))
            .dividedBy(2);
          outcome.lastPricePercent = formatNumber(midPoint, {
            decimals: 2,
            decimalsRounded: 1,
            denomination: "",
            positiveSign: false,
            zeroStyled: true
          });
        }
        // format-number thinks 0 is '-', need to correct
        if (outcome.lastPrice.fullPrecision === "0") {
          outcome.lastPricePercent.formatted = "0";
          outcome.lastPricePercent.full = "0";
        }
      } else if (createBigNumber(outcome.volume || 0).gt(ZERO)) {
        outcome.lastPricePercent = formatPercent(
          outcome.lastPrice.value * 100,
          {
            positiveSign: false
          }
        );
      } else {
        outcome.lastPricePercent = formatPercent(100 / market.numOutcomes, {
          positiveSign: false
        });
      }

      const orderBook = selectAggregateOrderBook(
        outcome.id,
        orderBooks,
        orderCancellation
      );
      outcome.orderBook = orderBook;
      outcome.orderBookSeries = getOrderBookSeries(orderBook);
      outcome.topBid = selectTopBid(orderBook, false);
      outcome.topAsk = selectTopAsk(orderBook, false);

      return outcome;
    })
    .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

  market.tags = (market.tags || []).filter(tag => !!tag);

  market.unclaimedCreatorFees = formatEther(marketData.unclaimedCreatorFees);

  market.marketCreatorFeesCollected = formatEther(
    marketData.marketCreatorFeesCollected || 0
  );

  market.reportableOutcomes = selectReportableOutcomes(
    market.marketType,
    market.outcomes
  );
  const indeterminateOutcomeId =
    market.type === YES_NO
      ? YES_NO_INDETERMINATE_OUTCOME_ID
      : CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID;
  market.reportableOutcomes.push({
    id: indeterminateOutcomeId,
    name: INDETERMINATE_OUTCOME_NAME
  });

  market.myPositionsSummary = {};
  if (userTradingPositions.tradingPositionsPerMarket) {
    const marketPositions = userTradingPositions.tradingPositionsPerMarket;
    // leave complete sets here, until we finish new notifications
    if (numCompleteSets) {
      market.myPositionsSummary.numCompleteSets = formatShares(numCompleteSets);
    }
    if (market.userPositions && market.userPositions.length > 0) {
      market.myPositionsSummary.currentValue = formatEther(
        marketPositions.unrealizedRevenue || ZERO
      );

      market.myPositionsSummary.totalReturns = formatEther(
        marketPositions.total || ZERO
      );

      market.myPositionsSummary.totalPercent = formatPercent(
        createBigNumber(marketPositions.totalPercent || ZERO).times(100),
        { decimalsRounded: 2 }
      );

      market.myPositionsSummary.valueChange = formatPercent(
        createBigNumber(
          marketPositions.unrealizedRevenue24hChangePercent || ZERO
        ).times(100),
        { decimalsRounded: 2 }
      );
    }
  }

  // Update the consensus object:
  //   - formatted reported outcome
  //   - the percentage of correct reports (for binaries only)
  if (marketData.consensus) {
    market.consensus = {
      ...marketData.consensus
    };
    if (market.reportableOutcomes.length) {
      const { payout, isInvalid } = market.consensus;
      const winningOutcome = calculatePayoutNumeratorsValue(
        market,
        payout,
        isInvalid
      );
      // for scalars, we will just use the winningOutcome for display
      market.consensus.winningOutcome = winningOutcome;
      const marketOutcome = market.reportableOutcomes.find(
        outcome => outcome.id === winningOutcome
      );
      if (marketOutcome) market.consensus.outcomeName = marketOutcome.name;
    }
    if (market.consensus.proportionCorrect) {
      market.consensus.percentCorrect = formatPercent(
        createBigNumber(market.consensus.proportionCorrect, 10).times(100)
      );
    }
  } else {
    market.consensus = null;
  }
  return market;
};
