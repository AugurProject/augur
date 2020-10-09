import { BUY } from "modules/common/constants";

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
  placeBetsDisabled: false,
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
  placeBetsDisabled: false,
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
  MODIFY_BET_ERROR_MESSAGE: 'MODIFY_BET_ERROR_MESSAGE',
  CLEAR_BETSLIP: 'CLEAR_BETSLIP',
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
  SET_DISABLE_PLACE_BETS: 'SET_DISABLE_PLACE_BETS',
  TOGGLE_HEADER: 'TOGGLE_HEADER',
  TOGGLE_SUBHEADER: 'TOGGLE_SUBHEADER',
};

export const STUBBED_BETSLIP_ACTIONS = {
  setDisablePlaceBets: (placeBetsDisabled) => {},
  toggleHeader: selected => {},
  clearBetslip: () => {},
  toggleSubHeader: selected => {},
  toggleStep: () => {},
  addBet: (marketId, matchedId, description, max, min, normalizedPrice, outcome, shares, outcomeId, price) => {},
  modifyBet: (marketId, matchedId, orderId, order) => {},
  cancelBet: (marketId, matchedId, orderId) => {},
  sendAllBets: () => {},
  cancelAllBets: () => {},
  retry: (marketId, matchedId, orderId) => {},
  cashOut: (marketId, matchedId, orderId) => {},
  updateMatched: (marketId, matchedId, orderId, updates) => {},
  addMatched: (fromList, marketId, sportsBook, description, order) => {},
  trash: (marketId, matchedId, orderId) => {},
  cancelAllUnmatched: () => {},
};

// ==== Trading Form Constants
export const DEFAULT_ORDER_PROPERTIES = {
  orderPrice: '',
  orderQuantity: '',
  selectedNav: BUY,
  allowPostOnlyOrder: true,
  postOnlyOrder: false,
  doNotCreateOrders: false,
  orderDaiEstimate: '',
  orderEscrowdDai: '',
  gasCostEst: '',
  expirationDate: null,
};

export const MOCK_TRADING_STATE = {
  orderProperties: DEFAULT_ORDER_PROPERTIES,
};

export const DEFAULT_TRADING_STATE = MOCK_TRADING_STATE;

export const TRADING_ACTIONS = {
  CLEAR_ORDER_PROPERTIES: 'CLEAR_ORDER_PROPERTIES',
  UPDATE_ORDER_PROPERTIES: 'UPDATE_ORDER_PROPERTIES',
  UPDATE_SELECTED_NAV: 'UPDATE_SELECTED_NAV',
};

export const STUBBED_TRADING_ACTIONS = {
  clearOrderProperties: () => {},
  updateSelectedNav: (selectedNav) => {},
  updateOrderProperties: (orderProperties) => {},
};