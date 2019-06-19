import createCachedSelector from "re-reselect";
import { createBigNumber } from "utils/create-big-number";
import {
  formatShares,
  formatEther,
  formatPercent,
  formatNumber
} from "utils/format-number";
import {
  SCALAR,
  ZERO,
  OPEN,
  REPORTING_STATE,
  YES_NO,
} from "modules/common/constants";

import { getOutcomeName } from "utils/get-outcome";

import store from "store";

import {
  selectAggregateOrderBook,
  selectTopBid,
  selectTopAsk
} from "modules/orders/helpers/select-order-book";
import getOrderBookSeries from "modules/orders/selectors/order-book-series";

import { positionSummary } from "modules/positions/selectors/positions-summary";

import {
  selectMarketsDataState,
  selectOutcomesDataState,
  selectOrderBooksState,
  selectOrderCancellationState,
  selectAccountShareBalance,
  selectAccountPositionsState
} from "store/select-state";
import { PositionData, MarketData } from "modules/types";
import { convertMarketInfoToMarketData } from "utils/convert-marketInfo-marketData";

export const selectMarket = (marketId): MarketData | null => {
  const state = store.getState();
  const marketInfo = selectMarketsDataState(state);

  if (
    !marketId ||
    !marketInfo ||
    !marketInfo[marketId] ||
    !marketInfo[marketId].id
  ) {
    return null;
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
): MarketData => {

  const market: MarketData = convertMarketInfoToMarketData(marketData);

  const numCompleteSets =
    (accountShareBalances &&
      accountShareBalances.length > 0 &&
      Math.min.apply(null, accountShareBalances).toString()) ||
    "0";

  const userTradingPositions = accountPositions || {};
  if (market.outcomes) {
    market.userPositions = Object.values(
      userTradingPositions.tradingPositions || []
    ).map((value) => {
      const position = value as PositionData;
      const outcome = market.outcomes[position.outcome];
      return {
        ...positionSummary(position, outcome),
        outcomeName: getOutcomeName(market, outcome),
      };
    });
  }

  if (createBigNumber(numCompleteSets).gt(ZERO) && market.userPositions) {
    // need to remove all 0 positions
    market.userPositions = market.userPositions.filter(
      pos =>
        !createBigNumber(pos.quantity.value).isEqualTo(ZERO) ||
        !createBigNumber(pos.unrealizedNet.value).isEqualTo(ZERO) ||
        !createBigNumber(pos.realizedNet.value).isEqualTo(ZERO)
    );
  }

  // TODO: move order book out of market selector when getter is ready
  market.marketOutcomes.map(outcome => {
    const orderBook = selectAggregateOrderBook(
      outcome.id,
      orderBooks,
      orderCancellation
    );
    outcome.orderBook = orderBook;
    outcome.orderBookSeries = getOrderBookSeries(orderBook);
    outcome.topBid = selectTopBid(orderBook, false);
    outcome.topAsk = selectTopAsk(orderBook, false);

  })


  market.tags = (market.tags || []).filter(tag => !!tag);

  market.unclaimedCreatorFees = formatEther(marketData.unclaimedCreatorFees);

  market.marketCreatorFeesCollected = formatEther(
    marketData.marketCreatorFeesCollected || 0
  );

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

  return market;
};
