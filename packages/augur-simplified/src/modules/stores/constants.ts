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
  setIsMobile: () => {},
};

export const DEFAULT_APP_STATUS_STATE = {
  isMobile: false,
  loginAccount: null,
  marketInfos: {},
  userInfo: {
    activity: {},
  },
};

export const APP_STATUS_ACTIONS = {
  SET_IS_MOBILE: 'SET_IS_MOBILE',
};

export const MOCK_APP_STATUS_STATE = {
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
