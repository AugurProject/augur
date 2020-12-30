import { MarketTypeName } from '@augurproject/sdk-lite';
import { createBigNumber } from 'utils/create-big-number';
import {
  CryptoIcon,
  EntertainmentIcon,
  FinanceIcon,
  PillIcon,
  PoliticsIcon,
  SportsIcon,
} from './common/icons';

// # Market Types
export const YES_NO = MarketTypeName.YesNo;
export const CATEGORICAL = MarketTypeName.Categorical;
export const SCALAR = MarketTypeName.Scalar;

// MAIN VIEWS
export const MARKET = 'market';
export const MARKETS = 'markets';
export const PORTFOLIO = 'portfolio';

// QUERY_PARAMS
export const MARKET_ID_PARAM_NAME = 'id';
export const AFFILIATE_NAME = 'r';
export const THEME_NAME = 't';

// Directions
export const BUY = 'buy';
export const SELL = 'sell';

export const ADD_LIQUIDITY = 'add liquidity';

export const ETHER = createBigNumber(10).pow(18);
export const GWEI_CONVERSION = 1000000000;
export const TEN = createBigNumber(10, 10);
export const ZERO = createBigNumber(0);

// # Asset Types
export const ETH = 'ETH';
export const REP = 'REP';
export const DAI = 'DAI';
export const USDT = 'USDT';
export const USDC = 'USDC';

// Portfolio table views
export const POSITIONS = 'positions';
export const LIQUIDITY = 'liquidity';

// categories
export const MEDICAL = 'medical';
export const POLITICS = 'politics';
export const FINANCE = 'finance';
export const CRYPTO = 'crypto';
export const ENTERTAINMENT = 'entertainment';
export const ECONOMICS = 'economics';
export const SPORTS = 'sports';
export const OTHER = 'other';
export const ALL_MARKETS = 'all markets';

// sub categories
export const COVID = 'covid-19';
export const ELECTORAL_COLLEGE = 'electoral college';
export const FEDERAL_FUNDS = 'federal funds';
export const REPUSD = 'REP USD';
export const PRESIDENTIAL_ELECTION = 'electoral college';

export const POPULAR_CATEGORIES_ICONS = {
  [MEDICAL]: PillIcon,
  [POLITICS]: PoliticsIcon,
  [CRYPTO]: CryptoIcon,
  [FINANCE]: FinanceIcon,
  [SPORTS]: SportsIcon,
  [ENTERTAINMENT]: EntertainmentIcon,
};

// side bar types
export const NAVIGATION = 'NAVIGATION';
export const FILTERS = 'FILTERS';

export const SIDEBAR_TYPES = {
  [NAVIGATION]: NAVIGATION,
  [FILTERS]: FILTERS,
};

//  transaction types
export const ALL = 'all';
export const SWAP = 'swap';
export const ADD = 'add';
export const REMOVE = 'remove';

export const INVALID_OUTCOME_ID = 0;
export const NO_OUTCOME_ID = 1;
export const YES_OUTCOME_ID = 2;

export const OPEN = 'Open';
export const IN_SETTLEMENT = 'In settlement';
export const FINALIZED = 'Finalized';

export const categoryItems = [
  {
    label: ALL_MARKETS,
    value: ALL_MARKETS,
  },
  {
    label: CRYPTO,
    value: CRYPTO,
  },
  {
    label: ECONOMICS,
    value: ECONOMICS,
  },
  {
    label: ENTERTAINMENT,
    value: ENTERTAINMENT,
  },
  {
    label: MEDICAL,
    value: MEDICAL,
  },
  {
    label: SPORTS,
    value: SPORTS,
  },
  {
    label: OTHER,
    value: OTHER,
  },
];

export const TOTAL_VOLUME = 'Total Volume';
export const sortByItems = [
  {
    label: TOTAL_VOLUME,
    value: TOTAL_VOLUME,
  },
  {
    label: '24hr volume',
    value: '24hr volume',
  },
  {
    label: 'liquidity',
    value: 'liquidity',
  },
  {
    label: 'ending soon',
    value: 'ending soon',
  },
];

export const marketStatusItems = [
  {
    label: OPEN,
    value: OPEN,
  },
  {
    label: IN_SETTLEMENT,
    value: IN_SETTLEMENT,
  },
  {
    label: FINALIZED,
    value: FINALIZED,
  },
];

export const currencyItems = [
  {
    label: ALL,
    value: ALL,
  },
  {
    label: ETH,
    value: ETH,
  },
  {
    label: USDC,
    value: USDC,
  },
];

// approvals

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
