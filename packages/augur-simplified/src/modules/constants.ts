import { MarketTypeName } from '@augurproject/sdk-lite';
import { createBigNumber } from 'utils/create-big-number';
import {
  CryptoIcon,
  FinanceIcon,
  PillIcon,
  PoliticsIcon,
} from './common/icons';

// # Market Types
export const YES_NO = MarketTypeName.YesNo;
export const CATEGORICAL = MarketTypeName.Categorical;
export const SCALAR = MarketTypeName.Scalar;

// MAIN VIEWS
export const MARKET = 'market';
export const MARKETS = 'markets';
export const PORTFOLIO = 'portfolio';

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
export const MEDICAL = 'MEDICAL';
export const POLITICS = 'POLITICS';
export const FINANCE = 'FINANCE';
export const CRYPTO = 'CRYPTO';

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
};

// side bar types
export const NAVIGATION = 'NAVIGATION';
export const FILTERS = 'FILTERS';

export const SIDEBAR_TYPES = {
  [NAVIGATION]: NAVIGATION,
  [FILTERS]: FILTERS
}

//  transaction types
export const ALL = 'all';
export const SWAP = 'swap';
export const ADD = 'add';
export const REMOVE = 'remove';
