import { MarketTypeName } from '@augurproject/sdk-lite';
import { createBigNumber } from 'utils/create-big-number';

// MAIN VIEWS
export const MARKET = 'market';
export const MARKETS = 'markets';
export const PORTFOLIO = 'portfolio';

// Directions
export const BUY = 'buy';
export const SELL = 'sell';

export const ETHER = createBigNumber(10).pow(18);
export const GWEI_CONVERSION = 1000000000;
export const SCALAR = MarketTypeName.Scalar;
export const TEN = createBigNumber(10, 10);
export const ZERO = createBigNumber(0);
