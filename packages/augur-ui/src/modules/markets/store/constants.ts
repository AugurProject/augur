export const MARKETS_ACTIONS = {
  UPDATE_ORDER_BOOK: 'UPDATE_ORDER_BOOK',
  CLEAR_ORDER_BOOK: 'CLEAR_ORDER_BOOK',
  UPDATE_MARKETS_DATA: 'UPDATE_MARKETS_DATA',
  REMOVE_MARKET: 'REMOVE_MARKET',
  BULK_MARKET_TRADING_HISTORY: 'BULK_MARKET_TRADING_HISTORY',
  UPDATE_REPORTING_LIST: 'UPDATE_REPORTING_LIST',
  UPDATE_LIQUIDITY_POOLS: 'UPDATE_LIQUIDITY_POOLS',
};

export const DEFAULT_MARKETS_STATE = {
  orderBooks: {},
  marketInfos: {},
  marketTradingHistory: {},
  reportingListState: {},
  liquidityPools: {},
};

export const STUBBED_MARKETS_ACTIONS = {
  updateOrderBook: (marketId, orderBook, payload) => {},
  clearOrderBook: () => {},
  updateMarketsData: (marketInfos, payload = undefined) => {},
  removeMarket: marketId => {},
  bulkMarketTradingHistory: (keyedMarketTradingHistory, payload) => {},
  updateReportingList: (reportingState, marketIds, params, isLoading) => {},
  updateLiquidityPools: liquidityPools => {},
};

export const MOCK_MARKETS_STATE = {
  orderBooks: {},
  marketInfos: {},
  marketTradingHistory: {},
  reportingListState: {},
  liquidityPools: {}
};
