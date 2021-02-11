import {
  ADD_LIQUIDITY,
  BUY,
  SELL,
  USDC,
  DEFAULT_MARKET_VIEW_SETTINGS,
  SETTINGS_SLIPPAGE,
} from '../constants';
import { AppStatusState, GraphDataState } from '../types';

export const STUBBED_GRAPH_DATA_ACTIONS = {
  updateGraphHeartbeat: (processed, blocknumber, errors) => {},
};

export const DEFAULT_GRAPH_DATA_STATE: GraphDataState = {
  ammExchanges: {},
  blocknumber: null,
  cashes: {},
  errors: null,
  markets: {},
};

export const GRAPH_DATA_KEYS = {
  AMM_EXCHANGES: 'ammExchanges',
  BLOCKNUMBER: 'blocknumber',
  CASHES: 'cashes',
  ERRORS: 'errors',
  MARKETS: 'markets',
};

export const GRAPH_DATA_ACTIONS = {
  UPDATE_GRAPH_HEARTBEAT: 'UPDATE_GRAPH_HEARTBEAT',
};

export const STUBBED_APP_STATUS_ACTIONS = {
  setIsMobile: isMobile => {},
  setSidebar: sidebarType => {},
  setShowTradingForm: showTradingForm => {},
  updateLoginAccount: updateLoginAccount => {},
  updateMarketsViewSettings: settings => {},
  updateUserBalances: balances => {},
  updateSettings: settings => {},
  updateTransaction: (hash, updates) => {},
  addTransaction: transaction => {},
  removeTransaction: hash => {},
  logout: () => {},
  finalizeTransaction: hash => {},
  setModal: modal => {},
  closeModal: () => {},
  updateSeenPositionWarning: (id, seenPositionWarning, warningType) => {},
  addSeenPositionWarnings: (seenPositionWarnings) => {}
};


export const DEFAULT_APP_STATUS_STATE: AppStatusState = {
  isMobile: false,
  sidebarType: null,
  loginAccount: null,
  isLogged: false,
  modal: {},
  showTradingForm: false,
  transactions: [],
  marketsViewSettings: DEFAULT_MARKET_VIEW_SETTINGS,
  paraConfig: { addresses: {}, paraDeploys: {}},
  userInfo: {
    activity: [],
    balances: {
      ETH: {
        balance: "0",
        rawBalance: "0",
        usdValue: "0",
      },
      USDC: {
        balance: "0",
        rawBalance: "0",
        usdValue: "0",
      },
      totalAccountValue: "0",
      totalPositionUsd: "0",
      total24hrPositionUsd: "0",
      change24hrPositionUsd: "0",
      availableFundsUsd: "0",
      lpTokens: {},
      marketShares: {},
      claimableWinnings: {}
    },
  },
  settings: {
    slippage: SETTINGS_SLIPPAGE,
    showInvalidMarkets: false,
    showLiquidMarkets: false,
  },
  seenPositionWarnings: {}
};

export const APP_STATE_KEYS = {
  IS_MOBILE: 'isMobile',
  SIDEBAR_TYPE: 'sidebarType',
  LOGIN_ACCOUNT: 'loginAccount',
  POSITIONS: 'positions',
  LIQUIDITY: 'liquidity',
  TRANSACTIONS: 'transactions',
  USER_INFO: 'userInfo',
  MARKETS_VIEW_SETTINGS: 'marketsViewSettings',
  PARA_CONFIG: 'paraConfig',
  SETTINGS: 'settings',
  MODAL: 'modal',
  IS_LOGGED: 'isLogged',
  SHOW_TRADING_FORM: 'showTradingForm',
  SEEN_POSITION_WARNINGS: 'seenPositionWarnings'
};

export const APP_STATUS_ACTIONS = {
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  SET_SIDEBAR: 'SET_SIDEBAR',
  SET_SHOW_TRADING_FORM: 'SET_SHOW_TRADING_FORM',
  UPDATE_PROCESSED: 'UPDATE_PROCESSED',
  SET_LOGIN_ACCOUNT: 'SET_LOGIN_ACCOUNT',
  UPDATE_MARKETS_VIEW_SETTINGS: 'UPDATE_MARKETS_VIEW_SETTINGS',
  UPDATE_USER_BALANCES: 'UPDATE_USER_BALANCES',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  REMOVE_TRANSACTION: 'REMOVE_TRANSACTION',
  UPDATE_BLOCKNUMBER: 'UPDATE_BLOCKNUMBER',
  FINALIZE_TRANSACTION: 'FINALIZE_TRANSACTION',
  SET_MODAL: 'SET_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  LOGOUT: 'LOGOUT',
  UPDATE_SEEN_POSITION_WARNING: 'UPDATE_SEEN_POSITION_WARNING',
  ADD_SEEN_POSITION_WARNINGS: 'ADD_SEEN_POSITION_WARNINGS'
};

export const fakePositionsData = [
  {
    id: '0',
    description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
    asset: USDC,
    positions: [
      {
        id: '0',
        outcome: 'Yes',
        quantityOwned: 300,
        avgPricePaid: '$0.67',
        initialValue: '$201.00',
        currentValue: '$225.00',
        profitLoss: '+$24.00',
      },
      {
        id: '1',
        outcome: 'Invalid',
        quantityOwned: 10,
        avgPricePaid: '$0.05',
        initialValue: '$201.00',
        currentValue: '$225.00',
        profitLoss: '+$24.00',
      },
    ],
    claimableWinnings: '$24.00',
  },
  {
    id: '1',
    description: `Which team will win the 2021 English Premier League?`,
    asset: USDC,
    positions: [
      {
        id: '0',
        outcome: 'Liverpool F.C.',
        quantityOwned: 300,
        avgPricePaid: '$0.67',
        initialValue: '$201.00',
        currentValue: '$225.00',
        profitLoss: '+$24.00',
      },
    ],
  },
];

export const fakeLiquidityData = [
  {
    id: '0x01',
    description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
    asset: USDC,
    liquidity: [
      {
        id: '0',
        liquiditySharesOwned: 300,
        initialValue: '$201.00',
        currentValue: '$225.00',
      },
    ],
  },
  {
    id: '0x02',
    description: `How many electoral college votes will be cast for Joe Biden?`,
    asset: USDC,
    liquidity: [
      {
        id: '1',
        liquiditySharesOwned: 300,
        initialValue: '$201.00',
        currentValue: '$225.00',
      },
    ],
  },
];

export const MOCK_APP_STATUS_STATE = {
  ...DEFAULT_APP_STATUS_STATE,
  positions: fakePositionsData,
  liquidity: fakeLiquidityData,
  transactions: [],
  userInfo: {
    balances: {},
    activity: [
      {
        date: '04/12',
        activity: [
          {
            id: '04/12-0',
            type: BUY,
            currency: USDC,
            description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
            subheader: '100 Yes @ .40',
            time: '02:58 PM',
            value: '- 400.00 USDC',
          },
          {
            id: '04/12-1',
            type: BUY,
            currency: USDC,
            description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
            subheader: '100 Yes @ .40',
            time: '02:58 PM',
            value: '- 400.00 USDC',
          },
          {
            id: '04/12-2',
            type: SELL,
            currency: USDC,
            description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
            subheader: '100 Yes @ .40',
            time: '02:58 PM',
            value: '- 400.00 USDC',
          },
        ],
      },
      {
        date: '03/12',
        activity: [
          {
            id: '03/12-0',
            type: ADD_LIQUIDITY,
            currency: USDC,
            description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
            subheader: '100 Yes @ .40',
            time: '02:58 PM',
            value: '- 400.00 USDC',
          },
        ],
      },
      {
        date: '30/11',
        activity: [
          {
            id: '30/11-0',
            type: BUY,
            currency: USDC,
            description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
            subheader: '100 Yes @ .40',
            time: '02:58 PM',
            value: '- 400.00 USDC',
          },
          {
            id: '30/11-1',
            type: BUY,
            currency: USDC,
            description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
            subheader: '100 Yes @ .40',
            time: '02:58 PM',
            value: '- 400.00 USDC',
          },
          {
            id: '30/11-2',
            type: SELL,
            currency: USDC,
            description: `Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?`,
            subheader: '100 Yes @ .40',
            time: '02:58 PM',
            value: '- 400.00 USDC',
          },
        ],
      },
    ],
  },
};
