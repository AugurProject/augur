import {
  COVID,
  FEDERAL_FUNDS,
  FINANCE,
  MEDICAL,
  REPUSD,
  CRYPTO,
  ADD_LIQUIDITY,
  BUY,
  SELL,
  USDC,
} from 'modules/constants';
import { createBigNumber } from 'utils/create-big-number';
import { formatDai } from 'utils/format-number';

export const STUBBED_APP_STATUS_ACTIONS = {
  setIsMobile: isMobile => {},
  setSidebar: (sidebarType) => {},
  updateGraphData: graphData => {},
  setShowTradingForm: showTradingForm => {},
  updateProcessed: processed => {},
};

export const DEFAULT_APP_STATUS_STATE = {
  isMobile: false,
  sidebarType: null,
  loginAccount: null,
  showTradingForm: false,
  marketInfos: {},
  positions: [],
  liquidity: [],
  transactions: {},
  userInfo: {
    activity: {},
    balances: {},
  },
  graphData: {
    markets: {},
    past: {},
    paraShareTokens: {},
  },
};

export const APP_STATE_KEYS = {
  IS_MOBILE: 'isMobile',
  SIDEBAR_TYPE: 'sidebarType',
  LOGIN_ACCOUNT: 'loginAccount',
  MARKET_INFOS: 'marketInfos',
  POSITIONS: 'positions',
  LIQUIDITY: 'liquidity',
  TRANSACTIONS: 'transactions',
  USER_INFO: 'userInfo',
  GRAPH_DATA: 'graphData',
  PROCESSED: 'processed'
};

export const APP_STATUS_ACTIONS = {
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  SET_SIDEBAR: 'SET_SIDEBAR',
  UPDATE_GRAPH_DATA: 'UPDATE_GRAPH_DATA',
  SET_SHOW_TRADING_FORM: 'SET_SHOW_TRADING_FORM',
  UPDATE_PROCESSED: 'UPDATE_PROCESSED',
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
        feesEarned: '$0.67',
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
        feesEarned: '$0.67',
        initialValue: '$201.00',
        currentValue: '$225.00',
      },
    ],
  },
];

export const fakeTransactionsData = {
  0: {
    transactions: [
      {
        id: 0,
        title: 'Swap USDC for Yes Shares',
        totalValue: '$150',
        tokenAmount: '150 USDC',
        shareAmount: '50 shares',
        account: '0x3058...d369',
        time: '30 mins ago',
      },
      {
        id: 1,
        title: 'Swap USDC for Yes Shares',
        totalValue: '$150',
        tokenAmount: '150 USDC',
        shareAmount: '50 shares',
        account: '0x3058...d369',
        time: '30 mins ago',
      },
      {
        id: 2,
        title: 'Swap USDC for Yes Shares',
        totalValue: '$150',
        tokenAmount: '150 USDC',
        shareAmount: '50 shares',
        account: '0x3058...d369',
        time: '30 mins ago',
      },
    ],
  },
};

export const MOCK_APP_STATUS_STATE = {
  ...DEFAULT_APP_STATUS_STATE,
  positions: fakePositionsData,
  liquidity: fakeLiquidityData,
  transactions: fakeTransactionsData,
  sidebarType: null,
  showTradingForm: false,
  marketInfos: {
    '0xdeadbeef': {
      id: '0xdeadbeef',
      description:
        "Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?",
      minPrice: 0,
      maxPrice: 1,
      minPriceBigNumber: createBigNumber(0),
      maxPriceBigNumber: createBigNumber(1),
      expirationDate: 'July 31, 2021',
      categories: [MEDICAL, COVID, 'vaccine'],
      totalLiquidity: formatDai(createBigNumber(83375)),
      twentyFourHourVolume: formatDai(createBigNumber(12027)),
      totalVolume: formatDai(createBigNumber(350019)),
      details: [
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      ],
      outcomes: [
        { id: 0, label: 'Invalid', value: 'invalid', lastPrice: '0' },
        { id: 1, label: 'Yes', value: 'yes', lastPrice: '0.75' },
        { id: 2, label: 'No', value: 'no', lastPrice: '0.25' },
      ],
      settlementFee: '0.1',
      marketCurrency: 'USDC',
    },
    '0x01': {
      id: '0x01',
      subcategory: COVID,
      category: MEDICAL,
      description:
        "Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?",
      volume: 350019,
      outcomes: [
        {
          description: 'yes',
          price: 0.75,
        },
        {
          description: 'no',
          price: 0.25,
        },
      ],
    },
    '0x02': {
      id: '0x02',
      subcategory: 'Covid-19',
      category: MEDICAL,
      description: "Will Pfizer's thing happen?",
      volume: 350019,
      outcomes: [
        {
          description: 'yes',
          price: 0.75,
        },
        {
          description: 'no',
          price: 0.25,
        },
      ],
    },
    '0x03': {
      id: '0x03',
      subcategory: REPUSD,
      category: CRYPTO,
      inUsd: true,
      description: 'How many electoral college votes?',
      volume: 350019,
      outcomes: [
        {
          description: '306',
          price: 0.75,
        },
        {
          description: '303 - 305',
          price: 0.25,
        },
      ],
    },
    '0x04': {
      id: '0x04',
      subcategory: FEDERAL_FUNDS,
      category: FINANCE,
      description: "Will Pfizer's thing happen?",
      volume: 350019,
      outcomes: [
        {
          description: 'yes',
          price: 0.75,
        },
        {
          description: 'no',
          price: 0.25,
        },
      ],
    },
    '0x05': {
      id: '0x05',
      subcategory: 'Us Politics',
      category: FINANCE,
      inUsd: true,
      description: 'How many electoral college votes?',
      volume: 350019,
      outcomes: [
        {
          description: '306',
          price: 0.75,
        },
        {
          description: '303 - 305',
          price: 0.25,
        },
      ],
    },
    '0x06': {
      id: '0x06',
      subcategory: 'Us Politics',
      category: FINANCE,
      description: 'How many electoral college votes?',
      volume: 0,
      noLiquidity: true,
      outcomes: [
        {
          description: '306',
          price: 0,
        },
        {
          description: '303 - 305',
          price: 0,
        },
      ],
    },
  },
  userInfo: {
    activity: {
      '04/12': {
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
      '03/12': {
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
      '30/11': {
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
    },
  },
};
