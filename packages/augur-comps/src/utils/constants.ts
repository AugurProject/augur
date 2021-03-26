import { MarketTypeName } from '@augurproject/sdk-lite';
import { createBigNumber, BigNumber } from './create-big-number';
import {
  CryptoIcon,
  EntertainmentIcon,
  FinanceIcon,
  MedicalIcon,
  PoliticsIcon,
  SportsIcon,
} from '../components/common/category-icons';
import { EthIcon, UsdIcon } from '../components/common/icons';

// # Market Types
export const YES_NO = MarketTypeName.YesNo;
export const CATEGORICAL = MarketTypeName.Categorical;
export const SCALAR = MarketTypeName.Scalar;

// MAIN VIEWS
export const MARKET: string = 'market';
export const MARKETS: string = 'markets';
export const PORTFOLIO: string = 'portfolio';

export const YES_NO_OUTCOMES_NAMES = ['Invalid', 'No', 'Yes'];
// QUERY_PARAMS
export const MARKET_ID_PARAM_NAME: string = 'id';
export const AFFILIATE_NAME: string = 'r';
export const THEME_NAME: string = 't';

export const OUTCOME_YES_NAME: string = 'Yes';
export const OUTCOME_NO_NAME: string = 'No';
export const OUTCOME_INVALID_NAME: string = 'Invalid';

// Directions
export const BUY: string = 'buy';
export const SELL: string = 'sell';

export const ADD_LIQUIDITY: string = 'add liquidity';

export const ETHER: BigNumber = createBigNumber(10).pow(18);
export const GWEI_CONVERSION: number = 1000000000;
export const TEN: BigNumber = createBigNumber(10, 10);
export const ZERO: BigNumber = createBigNumber(0);
export const ONE: BigNumber = createBigNumber(1);
export const HUNDRED: BigNumber = createBigNumber(100);
export const THOUSAND: BigNumber = createBigNumber(1000);
export const MILLION: BigNumber = THOUSAND.times(THOUSAND);
export const BILLION: BigNumber = MILLION.times(THOUSAND);
export const TRILLION: BigNumber = BILLION.times(THOUSAND);
export const DAYS_IN_YEAR: BigNumber = createBigNumber(365);
export const SEC_IN_DAY: BigNumber = createBigNumber(86400);
export const PORTION_OF_INVALID_POOL_SELL: BigNumber = createBigNumber(0.5);
export const PORTION_OF_CASH_INVALID_POOL: BigNumber = createBigNumber(0.1);

// # Asset Types
export const ETH: string = 'ETH';
export const REP: string = 'REP';
export const DAI: string = 'DAI';
export const USDT: string = 'USDT';
export const USDC: string = 'USDC';
export const SHARES: string = 'SHARES';
export const ALL_CURRENCIES: string = 'All Currencies';

export const CASH_LABEL_FORMATS = {
  ETH: { symbol: 'Ξ', prepend: true, displayDecimals: 4, icon: EthIcon },
  USDC: { symbol: '$', prepend: true, displayDecimals: 2, icon: UsdIcon },
  SHARES: { symbol: '', prepend: true, displayDecimals: 4, icon: null },
};

// Portfolio table views
export const POSITIONS: string = 'positions';
export const LIQUIDITY: string = 'liquidity';
export const TABLES: string = 'TABLES';
export const ACTIVITY: string = 'ACTIVITY';

// top categories
export const MEDICAL: string = 'medical';
export const POLITICS: string = 'politics';
export const FINANCE: string = 'finance';
export const CRYPTO: string = 'crypto';
export const ENTERTAINMENT: string = 'entertainment';
export const ECONOMICS: string = 'economics';
export const SPORTS: string = 'sports';
export const OTHER: string = 'other';
export const ALL_MARKETS: string = 'all markets';

// sub categories
export const COVID: string = 'covid-19';
export const ELECTORAL_COLLEGE: string = 'electoral college';
export const FEDERAL_FUNDS: string = 'federal funds';
export const REPUSD: string = 'REP USD';
export const PRESIDENTIAL_ELECTION: string = 'electoral college';

export const POPULAR_CATEGORIES_ICONS = {
  [MEDICAL]: MedicalIcon,
  [POLITICS]: PoliticsIcon,
  [CRYPTO]: CryptoIcon,
  [FINANCE]: FinanceIcon,
  [SPORTS]: SportsIcon,
  [ENTERTAINMENT]: EntertainmentIcon,
};

// side bar types
export const NAVIGATION: string = 'NAVIGATION';
export const FILTERS: string = 'FILTERS';

export const SIDEBAR_TYPES = {
  [NAVIGATION]: NAVIGATION,
  [FILTERS]: FILTERS,
};

//  transaction types
export const ALL: string = 'all';
export const SWAP: string = 'swap';
export const ADD: string = 'add';
export const REMOVE: string = 'remove';

export const INVALID_OUTCOME_ID: number = 0;
export const NO_OUTCOME_ID: number = 1;
export const YES_OUTCOME_ID: number = 2;

export const OPEN: string = 'Open';
export const IN_SETTLEMENT: string = 'In settlement';
export const RESOLVED: string = 'Resolved';

export const INSUFFICIENT_LIQUIDITY: string = 'Insufficent Liquidity';
export const INSUFFICIENT_BALANCE: string = 'Insufficent Balance';
export const OVER_SLIPPAGE: string = 'Over Slippage Tolerance';
export const ENTER_AMOUNT: string = 'Enter Amount';
export const ERROR_AMOUNT: string = 'Amount is not valid';
export const CONNECT_ACCOUNT: string = 'Connect Account';
export const SET_PRICES: string = 'Set Prices';

export const SETTINGS_SLIPPAGE: string = "2"
// graph market status
export const MARKET_STATUS = {
  TRADING: 'TRADING',
  REPORTING: 'REPORTING',
  DISPUTING: 'DISPUTING',
  FINALIZED: 'FINALIZED',
  SETTLED: 'SETTLED',
};

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

export const TOTAL_VOLUME: string = 'Total Volume';
export const TWENTY_FOUR_HOUR_VOLUME: string = '24hr volume';
export const ENDING_SOON: string = 'ending soon';

export const sortByItems = [
  {
    label: TOTAL_VOLUME,
    value: TOTAL_VOLUME,
  },
  {
    label: TWENTY_FOUR_HOUR_VOLUME,
    value: TWENTY_FOUR_HOUR_VOLUME,
  },
  {
    label: LIQUIDITY,
    value: LIQUIDITY,
  },
  {
    label: ENDING_SOON,
    value: ENDING_SOON,
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
    label: RESOLVED,
    value: RESOLVED,
  },
];

export const currencyItems = [
  {
    label: ALL_CURRENCIES,
    value: ALL_CURRENCIES,
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

export const TX_STATUS = {
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  FAILURE: 'FAILURE',
}

// approvals
export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

export enum ApprovalAction {
  ENTER_POSITION,
  EXIT_POSITION,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  TRANSFER_LIQUIDITY
}

export const NULL_ADDRESS: string = '0x0000000000000000000000000000000000000000';

// Modals
export const MODAL_ADD_LIQUIDITY: string = 'MODAL_ADD_LIQUIDITY';
export const MODAL_CONNECT_WALLET: string = 'MODAL_CONNECT_WALLET';

export const DEFAULT_MARKET_VIEW_SETTINGS = {
  categories: ALL_MARKETS,
  reportingState: OPEN,
  sortBy: TOTAL_VOLUME,
  currency: ALL_CURRENCIES,
};

export const CREATE: string = 'create';

export const DefaultMarketOutcomes = [
  {
    id: 0,
    name: 'Invalid',
    price: '$0.00',
    isInvalid: true,
  },
  {
    id: 1,
    name: 'No',
    price: '$0.25',
  },
  {
    id: 2,
    name: 'yes',
    price: '$0.75',
  },
];
