export const MARKETS_ACTIONS = {
  UPDATE_ORDER_BOOK: 'UPDATE_ORDER_BOOK',
  CLEAR_ORDER_BOOK: 'CLEAR_ORDER_BOOK'
};

export const DEFAULT_MARKETS_STATE = {
  orderbooks: {},
};

export const STUBBED_MARKETS_ACTIONS = {
  updateOrderBook: (marketId, orderBook) => {},
  clearOrderBook: () => {},
}

export const MOCK_MARKETS_STATE = {
  orderbooks: {},
};