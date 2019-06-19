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
import { MarketInfo } from "@augurproject/sdk/build/state/getter/Markets";

const NullMarket: MarketInfo = {
  id: "",
  universe: "",
  numOutcomes: 3,
  minPrice: "0",
  maxPrice: "1",
  cumulativeScale: "1",
  marketType: YES_NO,
  author: "",
  creationBlock: 0,
  creationTime: 0,
  category: "",
  volume: "0",
  openInterest: "0",
  reportingState: REPORTING_STATE.PRE_REPORTING,
  needsMigration: false,
  endTime: 0,
  finalizationBlockNumber: null,
  finalizationTime: null,
  description: "",
  scalarDenomination: "N/A",
  details: null,
  resolutionSource: null,
  numTicks: "100",
  tags: [],
  tickSize: "0.01",
  consensus: null,
  outcomes: [{
    id: 0,
    price: "0",
    description: "Invalid",
    volume: "0",
  },
  {
    id: 1,
    price: "0",
    description: "-",
    volume: "0",
  },
  {
    id: 2,
    price: "0",
    description: "-",
    volume: "0",
  }],
  marketCreatorFeeRate: "0",
  settlementFee: "0",
  reportingFeeRate: "0",
  disputeInfo: null,
}

export const selectMarket = (marketId): MarketData => {
  const state = store.getState();
  const marketsData = selectMarketsDataState(state);

  if (
    !marketId ||
    !marketsData ||
    !marketsData[marketId] ||
    !marketsData[marketId].id
  ) {
    return convertMarketInfoToMarketData(NullMarket);
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
