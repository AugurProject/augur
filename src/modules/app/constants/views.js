// NOTE --  if a view is only accessible when logged in, be sure to add it
//          to the `authenticated-views` array under app/constants

// Main Views
export const M = 'm';
export const MARKETS = 'markets';
export const CREATE_MARKET = 'create-market';
export const TRANSACTIONS = 'transactions';
export const ACCOUNT = 'account';
export const AUTHENTICATION = 'authentication';
export const TOPICS = 'topics';

export const DEFAULT_VIEW = TOPICS;

// Internal Navigation

//  Sign Up / Login
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_SIGNUP = 'AUTH_SIGNUP';
export const AUTH_IMPORT = 'AUTH_IMPORT';

//  Portfolio
export const MY_POSITIONS = 'my-positions';
export const MY_MARKETS = 'my-markets';
export const MY_REPORTS = 'my-reports';

//  Market
export const MARKET_DATA_NAV_OUTCOMES = 'outcomes';
export const MARKET_DATA_ORDERS = 'orders';
export const MARKET_DATA_NAV_CHARTS = 'charts';
export const MARKET_DATA_NAV_DETAILS = 'details';
export const MARKET_DATA_NAV_REPORT = 'report';
export const MARKET_DATA_NAV_SNITCH = 'snitch';
export const MARKET_USER_DATA_NAV_POSITIONS = 'positions';
export const MARKET_USER_DATA_NAV_OPEN_ORDERS = 'open-orders';

//  Account
export const ACCOUNT_DEPOSIT = 'deposit-funds';
export const ACCOUNT_TRANSFER = 'transfer-funds';
export const ACCOUNT_EXPORT = 'export-account';
