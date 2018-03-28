// MAIN VIEWS
export const MARKET = 'market'
export const MARKETS = 'markets'
export const CREATE_MARKET = 'create-market'
export const TRANSACTIONS = 'transactions'
export const ACCOUNT = 'account'
export const AUTHENTICATION = 'authentication'
export const CONNECT = 'connect'
export const CREATE = 'create'
export const CATEGORIES = 'categories'
export const REPORTING = 'reporting'
export const REPORT = 'report'
export const DISPUTE = 'dispute'
export const MIGRATE_REP = 'migrate-rep'

export const DEFAULT_VIEW = CATEGORIES

// NOTE -- if the view is conditionally displayed based on a param, it's value should be housed withint the resepective constant file
// Most of these will be progressively being refactored out

// SUB VIEWS
//  Portfolio
export const MY_POSITIONS = 'my-positions'
export const MY_MARKETS = 'my-markets'
export const FAVORITES = 'favorites'
export const PORTFOLIO_TRANSACTIONS = 'transactions'
export const PORTFOLIO_REPORTS = 'reports'

//  Market (TODO -- These should be params, not routes)
export const MARKET_DATA_NAV_OUTCOMES = 'outcomes'
export const MARKET_DATA_ORDERS = 'orders'
export const MARKET_DATA_NAV_CHARTS = 'charts'
export const MARKET_DATA_NAV_DETAILS = 'details'
export const MARKET_DATA_NAV_REPORT = 'report'
export const MARKET_DATA_NAV_SNITCH = 'snitch'
export const MARKET_USER_DATA_NAV_POSITIONS = 'positions'
export const MARKET_USER_DATA_NAV_OPEN_ORDERS = 'open-orders'

//  Account
export const ACCOUNT_DEPOSIT = 'deposit-funds'
export const ACCOUNT_TRANSFER = 'transfer-funds'
export const ACCOUNT_WITHDRAW = 'withdraw-funds'
export const ACCOUNT_REP_FAUCET = 'rep-faucet'
export const ACCOUNT_UNIVERSES = 'universes'

// Reporting
export const REPORTING_DISPUTE_MARKETS = 'reporting-dispute-markets'
export const REPORTING_REPORT_MARKETS = 'reporting-report-markets'
export const REPORTING_REPORT = 'reporting-report' // NOTE -- Not currently used...but will be shortly
export const REPORTING_RESOLVED_MARKETS = 'reporting-resolved-markets'

// Dev only
export const STYLE_SANDBOX = 'style-sandbox'
