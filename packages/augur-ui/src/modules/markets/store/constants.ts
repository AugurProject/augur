export const MARKETS_ACTIONS = {
  UPDATE_ORDER_BOOK: 'UPDATE_ORDER_BOOK',
  CLEAR_ORDER_BOOK: 'CLEAR_ORDER_BOOK',
  UPDATE_MARKETS_DATA: 'UPDATE_MARKETS_DATA',
  REMOVE_MARKET: 'REMOVE_MARKET',
  BULK_MARKET_TRADING_HISTORY: 'BULK_MARKET_TRADING_HISTORY',
  UPDATE_REPORTING_LIST: 'UPDATE_REPORTING_LIST',
};

export const DEFAULT_MARKETS_STATE = {
  orderBooks: {},
  marketInfos: {},
  marketTradingHistory: {},
  reportingListState: {},
};

export const STUBBED_MARKETS_ACTIONS = {
  updateOrderBook: (marketId, orderBook, payload) => {},
  clearOrderBook: () => {},
  updateMarketsData: marketInfos => {},
  removeMarket: marketId => {},
  bulkMarketTradingHistory: (keyedMarketTradingHistory, payload) => {},
  updateReportingList: (reportingState, marketIds, params, isLoading) => {},
};

export const MOCK_MARKETS_STATE = {
  orderBooks: {},
  marketInfos: {},
  marketTradingHistory: {},
  reportingListState: {},
};
