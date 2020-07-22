export const FORM_INPUT_TYPES = {
  MULTIPLE_QUANTITY: 'multipleOrderQuantity',
  QUANTITY: 'orderQuantity',
  PRICE: 'orderPrice',
  DO_NOT_CREATE_ORDERS: 'doNotCreateOrders',
  EST_DAI: 'orderDaiEstimate',
  ESCROW_DAI: 'orderEscrowdDai',
  SELECTED_NAV: 'selectedNav',
  EXPIRATION_DATE: 'expirationDate',
  ERRORS: 'errors',
  TRADE: 'trade',
  SIMULATE_QUEUE: 'simulateQueue',
  GAS_COST_EST: 'gasCostEst',
  POST_ONLY_ORDER: 'postOnlyOrder',
};

export const BET_TYPE = {
  SPREAD: 'Spread',
  MONEYLINE: 'Moneyline',
};

export const BET_STATUS = {
  UNSENT: 'UNSENT',
  UNFILLED: 'UNFILLED',
  PENDING: 'PENDING',
  FILLED: 'FILLED',
  PARTIALLY_FILLED: 'PARTIALLY_FILLED',
  CLOSED: 'CLOSED',
  FAILED: 'FAILED',
};

export const BETSLIP_SELECTED = {
  BETSLIP: 'betslip',
  MY_BETS: 'myBets',
  UNMATCHED: 'unmatched',
  MATCHED: 'matched',
};

export const EMPTY_BETSLIST = {
  count: 0,
  items: {},
};

export const DEFAULT_BETSLIP_STATE = {
  selected: {
    header: BETSLIP_SELECTED.BETSLIP,
    subHeader: BETSLIP_SELECTED.MATCHED,
  },
  step: 0,
  betslip: EMPTY_BETSLIST,
  unmatched: EMPTY_BETSLIST,
  matched: EMPTY_BETSLIST,
};

export const MOCK_BETSLIP_STATE = {
  selected: {
    header: BETSLIP_SELECTED.BETSLIP,
    subHeader: BETSLIP_SELECTED.MATCHED,
  },
  step: 0,
  betslip: {
    count: 0,
    items: {}
  },
  unmatched: {
    count: 0,
    items: {}
  },
  matched: {
    count: 0,
    items: {}
  },
};

export const BETSLIP_ACTIONS = {
  ADD_BET: 'ADD_BET',
  ADD_MATCHED: 'ADD_MATCHED',
  ADD_UNMATCHED: 'ADD_UNMATCHED',
  ADD_MULTIPLE_MATCHED: 'ADD_MULTIPLE_MATCHED',
  ADD_MULTIPLE_UNMATCHED: 'ADD_MULTIPLE_UNMATCHED',
  CASH_OUT: 'CASH_OUT',
  RETRY: 'RETRY',
  MODIFY_BET: 'MODIFY_BET',
  UPDATE_UNMATCHED: 'UPDATE_UNMATCHED',
  UPDATE_MATCHED: 'UPDATE_MATCHED',
  SEND_BET: 'SEND',
  SEND_ALL_BETS: 'SEND_ALL',
  TRASH: 'TRASH',
  CANCEL_BET: 'CANCEL_BET',
  CANCEL_UNMATCHED: 'CANCEL_UNMATCHED',
  CANCEL_ALL_BETS: 'CANCEL_ALL',
  CANCEL_ALL_UNMATCHED: 'CANCEL_ALL_UNMATCHED',
  TOGGLE_STEP: 'TOGGLE_STEP',
  TOGGLE_HEADER: 'TOGGLE_HEADER',
  TOGGLE_SUBHEADER: 'TOGGLE_SUBHEADER',
};

export const STUBBED_BETSLIP_ACTIONS = {
  toggleHeader: selected => {},
  toggleSubHeader: selected => {},
  toggleStep: () => {},
  addBet: (marketId, description, normalizedPrice, outcome, shares, outcomeId, price) => {},
  sendBet: (marketId, orderId, description, order) => {},
  modifyBet: (marketId, orderId, order) => {},
  cancelBet: (marketId, orderId) => {},
  sendAllBets: () => {},
  cancelAllBets: () => {},
  retry: (marketId, orderId) => {},
  cashOut: (marketId, orderId) => {},
  updateMatched: (marketId, orderId, updates) => {},
  addMatched: (fromList, marketId, description, order) => {},
  trash: (marketId, orderId) => {},
  cancelAllUnmatched: () => {},
  updateUnmatched: (marketId, orderId, updates) => {},
};
