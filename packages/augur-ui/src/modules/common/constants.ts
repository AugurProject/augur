import { Getters, Logs, MarketReportingState } from '@augurproject/sdk';
import {
  Edge,
  Fortmatic,
  Ledger,
  MetaMask,
  Portis,
  Trezor,
  CategorySports,
  CategoryPolitics,
  CategoryEntertainment,
  CategoryFinance,
  CategoryCrypto,
} from 'modules/common/icons';
import { DEFAULT_DERIVATION_PATH } from 'modules/auth/helpers/derivation-path';
import * as d3 from 'd3-time';
import { createBigNumber } from 'utils/create-big-number';
import { formatShares, formatDai } from 'utils/format-number';

// # MISC Constants
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const MALFORMED_OUTCOME = 'malformed outcome';
// # Asset Types
export const ETH = 'ETH';
export const REP = 'REP';
export const DAI = 'DAI';

export const TRADING_TUTORIAL = 'TRADING_TUTORIAL';

// # Network Constants
export const MILLIS_PER_BLOCK = 12000;
export const UNIVERSE_ID = '0xf69b5';
// network id to names map
export const NETWORK_NAMES = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  42: 'Kovan',
  123456: 'Private',
};

// network name to id map
export const NETWORK_IDS = {
  Mainnet: '1',
  Ropsten: '3',
  Rinkeby: '4',
  Kovan: '42',
  Private1: '101',
  Private2: '102',
  Private3: '103',
  Private4: '104',
};

export const GAS_PRICE_API_ENDPOINT = 'https://ethgasstation.info/json/ethgasAPI.json';

export const GAS_SPEED_LABELS = {
  STANDARD: 'Standard',
  FAST: 'Fast',
  SLOW: 'Slow',
};

export const GAS_TIME_LEFT_LABELS = {
  STANDARD: '< 5 min',
  FAST: '< 2 min',
  SAFELOW: '< 30 min',
  SLOW: '30 min or more',
};


// ethereumNodeHttp
export const ETHEREUM_NODE_HTTP = 'ethereum_node_http';
// ethereumNodeWs
export const ETHEREUM_NODE_WS = 'ethereum_node_ws';

// # Auth Types
export const REGISTER = 'register';
export const LOGIN = 'login';
export const SIGNUP = 'signup';
export const LOGOUT = 'logout';
export const IMPORT = 'import';
export const FUND_ACCOUNT = 'fund_account';

export const AUTH_TYPES = {
  [REGISTER]: REGISTER,
  [LOGIN]: LOGIN,
  [IMPORT]: IMPORT,
  [LOGOUT]: LOGOUT,
};

export const DEFAULT_AUTH_TYPE = REGISTER;
const SECONDS_PER_DAY = 3600 * 24;
export const SIXTY_DAYS = 60 * SECONDS_PER_DAY;

export const EDGE_WALLET_TYPE = 'wallet:ethereum';

// # Connect Constants
export const ACCOUNT_TYPES = {
  EDGE: 'Edge',
  PORTIS: 'Portis',
  FORTMATIC: 'Fortmatic',
  TORUS: 'Tor.us',
  LEDGER: 'Ledger',
  METAMASK: 'MetaMask',
  TREZOR: 'Trezor',
  WEB3WALLET: 'MetaMask / Web3', // Mobile Wallets + Extensions (MetaMask, Dapper, Trust, Coinbase)
  UNLOCKED_ETHEREUM_NODE: 'unlockedEthereumNode',
};

export const WALLET_TYPE = {
  SOFTWARE: 'software',
  HARDWARE: 'hardware',
};

export const SIGNIN_LOADING_TEXT = 'Sit tight - loading your account.';
export const SIGNIN_LOADING_TEXT_PORTIS =
  'Follow instructions in the Portis window.';
export const SIGNIN_LOADING_TEXT_FORTMATIC =
  'Follow instructions in the Fortmatic window.';
export const SIGNIN_LOADING_TEXT_TORUS =
  'Follow instructions in the Tor.us window.';
export const SIGNIN_SIGN_WALLET =
  'Your wallet will ask you to digitally sign in to link it with Augur';

export const ERROR_TYPES = {
  UNABLE_TO_CONNECT: {
    header: 'Unable To Connect',
    subheader: 'Please install the MetaMask browser plug-in from Metamask.io',
  },
  NOT_SIGNED_IN: {
    header: 'Unable To Connect',
    subheader: 'Please make sure you are signed in to your account.',
  },
  INCORRECT_FORMAT: {
    header: 'Incorrect Format',
    subheader: `Please enter a derivative path with the format "${DEFAULT_DERIVATION_PATH}"`,
  },
  UNSUPPORTED_NETWORK: {
    header: 'Unsupported Network',
    subheader: 'Portis is only available on mainnet/kovan/localhost',
  },
};

// sidebar related constants
export const MOBILE_MENU_STATES = {
  CLOSED: 0,
  SIDEBAR_OPEN: 1,
  FIRSTMENU_OPEN: 2,
  SUBMENU_OPEN: 3,
};

export const SUB_MENU = 'subMenu';
export const MAIN_MENU = 'mainMenu';

// # Ledger Related Constants
export const ATTEMPTING_CONNECTION = 'ATTEMPTING_CONNECTION';
export const CONNECT_LEDGER = 'CONNECT_LEDGER';
export const OPEN_APP = 'OPEN_APP';
export const SWITCH_MODE = 'SWITCH_MODE';
export const ENABLE_CONTRACT_SUPPORT = 'ENABLE_CONTRACT_SUPPORT';
export const OTHER_ISSUE = 'OTHER_ISSUE';

// # Market Max Fees
export const MAX_FEE_100_PERCENT = '1';
export const MAX_FEE_40_PERCENT = '0.4';
export const MAX_FEE_30_PERCENT = '0.3';
export const MAX_FEE_20_PERCENT = '0.2';
export const MAX_FEE_10_PERCENT = '0.1';
export const MAX_FEE_05_PERCENT = '0.05';
export const MAX_FEE_02_PERCENT = '0.02';

export const feeFilters = [
  { header: 'All', value: MAX_FEE_100_PERCENT },
  { header: '0-2%', value: MAX_FEE_02_PERCENT },
  { header: '0-5%', value: MAX_FEE_05_PERCENT },
  { header: '0-10%', value: MAX_FEE_10_PERCENT },
];

export const TEMPLATE_FILTER_ALL = Getters.Markets.TemplateFilters.all;
export const templateFilterValues = [
  { header: 'All', value: TEMPLATE_FILTER_ALL},
  { header: 'Augur templates', value: Getters.Markets.TemplateFilters.templateOnly},
  { header: 'Custom markets', value: Getters.Markets.TemplateFilters.customOnly},
]

// # Valid Market Liquidity Spreads
export const MAX_SPREAD_ALL_SPREADS =
  Getters.Markets.MaxLiquiditySpread.OneHundredPercent;
export const MAX_SPREAD_20_PERCENT =
  Getters.Markets.MaxLiquiditySpread.TwentyPercent;
export const MAX_SPREAD_15_PERCENT =
  Getters.Markets.MaxLiquiditySpread.FifteenPercent;
export const MAX_SPREAD_10_PERCENT =
  Getters.Markets.MaxLiquiditySpread.TenPercent;
export const MAX_SPREAD_RECENTLY_DEPLETED =
  Getters.Markets.MaxLiquiditySpread.ZeroPercent;

export const spreadFilters = [
  { header: 'All', value: MAX_SPREAD_ALL_SPREADS },
  { header: 'Less than 10%', value: MAX_SPREAD_10_PERCENT },
  { header: 'Less than 15%', value: MAX_SPREAD_15_PERCENT },
  { header: 'Less than 20%', value: MAX_SPREAD_20_PERCENT },
  {
    header: 'Recently Depleted Liquidity',
    value: MAX_SPREAD_RECENTLY_DEPLETED,
  },
];

// # Market Invalid Show/Hide
export const INVALID_SHOW = 'show';
export const INVALID_HIDE = 'hide';

export const invalidFilters = [
  { header: 'Hide', value: INVALID_HIDE },
  { header: 'show', value: INVALID_SHOW },
];

// # Sorting Options
export const NEUTRAL = 'neutral';
export const ASCENDING = 'ascending';
export const DESCENDING = 'descending';

// # Market Sort Params
export enum MARKET_SORT_PARAMS {
  VOLUME = 'volume',
  CREATION_TIME = 'creationTime',
  END_DATE = 'endTime',
  RECENTLY_TRADED = 'recentlyTraded',
  OPEN_INTEREST = 'openInterest',
  LIQUIDITY = 'liquidity',
}

export const SORT_OPTIONS = [
  { value: MARKET_SORT_PARAMS.LIQUIDITY, header: 'Highest liquidity' },
  { value: MARKET_SORT_PARAMS.OPEN_INTEREST, header: 'Highest open interest' },
  { value: MARKET_SORT_PARAMS.VOLUME, header: 'Highest volume' },
  { value: MARKET_SORT_PARAMS.CREATION_TIME, header: 'Recently created' },
  { value: MARKET_SORT_PARAMS.END_DATE, header: 'Ending soon ' },
  { value: MARKET_SORT_PARAMS.RECENTLY_TRADED, header: 'Recently Traded' },
];

export enum MARKET_CARD_FORMATS {
  COMPACT = 'compact',
  CLASSIC = 'classic',
  EXPANDED = 'expanded',
}

export const SEARCH_FILTER_PLACHOLDER = 'Search markets and categories';
export const SEARCH_FILTER_PLACHOLDER_MOBILE = 'Search';

// The user should be able to sort by:

// Volume
// Recently Traded
// End Date (soonest first)
// Creation Date (most recent first)
// Fee (lowest first)
// The user should be able to filter by market state:

// Open (PRE_REPORTING)
// In Reporting (DESIGNATED_REPORTING, OPEN_REPORTING, CROWDSOURCING_DISPUTE, AWAITING_NEXT_WINDOW)
// Resolved (FINALIZED)
// TODO: this will come from SDK in the near future
export const REPORTING_STATE = {
  PRE_REPORTING: MarketReportingState.PreReporting,
  DESIGNATED_REPORTING: MarketReportingState.DesignatedReporting,
  OPEN_REPORTING: MarketReportingState.OpenReporting,
  CROWDSOURCING_DISPUTE: MarketReportingState.CrowdsourcingDispute,
  AWAITING_NEXT_WINDOW: MarketReportingState.AwaitingNextWindow,
  AWAITING_FINALIZATION: MarketReportingState.AwaitingFinalization,
  FINALIZED: MarketReportingState.Finalized,
  FORKING: MarketReportingState.Forking,
  AWAITING_FORK_MIGRATION: MarketReportingState.AwaitingForkMigration,
};

// TODO: this no longer exists and can be removed during refactor of claiming winnings
export const CONTRACT_INTERVAL = {
  CLAIM_PROCEEDS_WAIT_TIME: 0,
  DESIGNATED_REPORTING_DURATION_SECONDS: 3 * SECONDS_PER_DAY,
  DISPUTE_ROUND_DURATION_SECONDS: 7 * SECONDS_PER_DAY,
  FORK_DURATION_SECONDS: 60 * SECONDS_PER_DAY,
};

// # Market States
export const ALL_MARKETS = 'all';
export const MARKET_OPEN = 'open';
export const MARKET_REPORTING = 'reporting';
export const MARKET_CLOSED = 'closed';

// InReporting Labels
export const IN_REPORTING = 'In-reporting';
export const WAITING_ON_REPORTER = 'Waiting on reporter';
export const OPEN_REPORTING = 'Open reporting';
export const FAST_DISPUTE = 'Fast dispute';
export const SLOW_DISPUTE = 'Slow dispute';
export const REPORTING_ENDS = 'Reporting ends';
export const DISPUTE_ENDS = 'Dispute ends';

// # Market Status Messages
export const MARKET_STATUS_MESSAGES = {
  OPEN: 'Open',
  IN_REPORTING: 'In Reporting',
  RESOLVED: 'Resolved',
  FORKING: 'Forking',
  AWAITING_NO_REPORT_MIGRATION: 'Awaiting No Report Migrated',
  AWAITING_FORK_MIGRATION: 'Awaiting Fork Migration',
  WAITING_PERIOD_ENDS: 'Waiting period ends',
};

// Market Header
export const COPY_MARKET_ID = 'Copy Market ID';
export const COPY_AUTHOR = 'Copy Market Creator ID';

// # Search/Filter Param Names
export const FILTER_SEARCH_PARAM = 'keywords';
export const TAGS_PARAM_NAME = 'tags';
export const CATEGORY_PARAM_NAME = 'category';
export const MAXFEE_PARAM_NAME = 'maxFee';
export const SPREAD_PARAM_NAME = 'spread';
export const SHOW_INVALID_MARKETS_PARAM_NAME = 'showInvalid';
export const TEMPLATE_FILTER = 'templateFilter';

// # Close Dialog Status
export const CLOSE_DIALOG_CLOSING = 'CLOSE_DIALOG_CLOSING';
export const CLOSE_DIALOG_PENDING = 'CLOSE_DIALOG_PENDING';
export const CLOSE_DIALOG_FAILED = 'CLOSE_DIALOG_FAILED';
export const CLOSE_DIALOG_NO_ORDERS = 'CLOSE_DIALOG_NO_ORDERS';
export const REMOVE_DIALOG_NO_ORDERS = 'REMOVE_DIALOG_NO_ORDERS';

// # Link Types
export const TYPE_MARKET = 'market';
export const TYPE_REPORT = 'report';
export const TYPE_DISPUTE = 'dispute';
export const TYPE_CLAIM_PROCEEDS = 'claim proceeds';
export const TYPE_TRADE = 'trade';
export const TYPE_VIEW = 'view';
export const TYPE_VIEW_ORDERS = 'view orders';
export const TYPE_VIEW_SETS = 'view sets';
export const TYPE_VIEW_DETAILS = 'view';
export const TYPE_MIGRATE_REP = 'migrate-rep';
export const TYPE_FINALIZE_MARKET = 'finalize market';

// # Market Loading States
export const MARKET_INFO_LOADING = 'MARKET_INFO_LOADING';
export const MARKET_INFO_LOADED = 'MARKET_INFO_LOADED';
export const MARKET_FULLY_LOADING = 'MARKET_FULLY_LOADING';
export const MARKET_FULLY_LOADED = 'MARKET_FULLY_LOADED';

// # Market Outcome Constants
export const INVALID_OUTCOME_ID = 0;
export const INVALID_OUTCOME_NAME = 'Invalid';
export const YES_NO_NO_ID = 1;
export const YES_NO_NO_OUTCOME_NAME = 'No';
export const YES_NO_YES_ID = 2;
export const YES_NO_YES_OUTCOME_NAME = 'Yes';
export const SCALAR_DOWN_ID = 1;
export const SCALAR_UP_ID = 2;
export const INDETERMINATE_PLUS_ONE = '0.500000000000000001';
export const INDETERMINATE_OUTCOME_NAME = 'Indeterminate';

// # Market Types
export const YES_NO = Logs.MarketTypeName.YesNo;
export const CATEGORICAL = Logs.MarketTypeName.Categorical;
export const SCALAR = Logs.MarketTypeName.Scalar;

// # New Market Constraint Constants
export const DESCRIPTION_MIN_LENGTH = 1;
export const DESCRIPTION_MAX_LENGTH = 256;
export const CATEGORICAL_OUTCOMES_MIN_NUM = 2;
export const CATEGORICAL_OUTCOMES_MAX_NUM = 8;
export const CATEGORICAL_OUTCOME_MAX_LENGTH = 32;
export const TAGS_MAX_LENGTH = 25;
export const TAGS_MAX_NUM = 2;
export const RESOURCES_MAX_NUM = 5;
export const RESOURCES_MAX_LENGTH = 1250;
export const DESIGNATED_REPORTER_SELF = 'DESIGNATED_REPORTER_SELF';
export const DESIGNATED_REPORTER_SPECIFIC = 'DESIGNATED_REPORTER_SPECIFIC';
export const INITIAL_LIQUIDITY_DEFAULT = 500;
export const INITIAL_LIQUIDITY_MIN = 250;
export const SETTLEMENT_FEE_DEFAULT = 0;
export const SETTLEMENT_FEE_MIN = 0;
export const SETTLEMENT_FEE_MAX = 12.5;
export const AFFILIATE_FEE_DEFAULT = 0;

// Advanced Market Creation Defaults
export const STARTING_QUANTITY_DEFAULT = 100;
export const STARTING_QUANTITY_MIN = 0.1;
export const BEST_STARTING_QUANTITY_DEFAULT = 100;
export const BEST_STARTING_QUANTITY_MIN = 0.1;
export const PRICE_WIDTH_DEFAULT = 0.1;
export const PRICE_WIDTH_MIN = 0.01;
export const PRICE_DEPTH_DEFAULT = 0.1; // Not used yet
export const IS_SIMULATION = false; // Not used yet

// # Permissible Periods
// Note: times are in seconds
export const RANGES = [
  {
    duration: 60,
    label: 'Past minute',
    tickInterval: axis => axis.ticks(d3.timeSecond.every(30)),
  },
  {
    duration: 3600,
    label: 'Past hour',
    tickInterval: axis => axis.ticks(d3.timeMinute.every(10)),
  },
  {
    duration: 86400,
    label: 'Past day',
    tickInterval: axis => axis.ticks(d3.timeHour.every(3)),
  },
  {
    duration: 604800,
    label: 'Past week',
    isDefault: true,
    tickInterval: axis =>
      axis.ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat('%a %d')),
  },
  {
    duration: 2629800,
    label: 'Past month',
    tickInterval: axis => axis.ticks(d3.timeDay.every(6)),
  },
  {
    duration: 31557600,
    label: 'Past year',
    tickInterval: axis =>
      axis.ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%b')),
  },
];

export const PERIOD_RANGES = {
  3600: {
    period: 3600,
    format: '{value:%b %d}',
    crosshair: '{value:%H:%M}',
    range: 24 * 3600 * 1000, // 1 day
  },
  43200: {
    period: 43200,
    format: '{value:%b %d}',
    crosshair: '{value:%H:%M}',
    range: 7 * 24 * 3600 * 1000, // 1 week
  },
  86400: {
    period: 86400,
    format: '{value:%b %d}',
    crosshair: '{value:%b %d }',
    range: 30 * 24 * 3600 * 1000, // month
  },
  604800: {
    period: 604800,
    format: '{value:%b %d}',
    crosshair: '{value:%b %d }',
    range: 6 * 30 * 24 * 3600 * 1000, // 6 months
  },
};

export const DEFAULT_PERIODS_VALUE = 86400;
export const DEFAULT_SHORT_PERIODS_VALUE = 3600;
export const PERIODS = [
  {
    value: 3600,
    label: 'Hourly',
  },
  {
    value: 43200,
    label: '12 Hour',
  },
  {
    value: 86400,
    label: 'Daily',
  },
  {
    value: 604800,
    label: 'Weekly',
  },
];

// # Precision Constants
export const UPPER_FIXED_PRECISION_BOUND = 2;
export const LOWER_FIXED_PRECISION_BOUND = 0;

export const ONBOARDING_SEEN_KEY = 'onboardingSeen';

// # Modal Constants
export const MODAL_LEDGER = 'MODAL_LEDGER';
export const MODAL_TREZOR = 'MODAL_TREZOR';
export const MODAL_REPORTING = 'MODAL_REPORTING';
export const MODAL_CONTENT = 'MODAL_CONTENT';
export const MODAL_CATEGORIES = 'MODAL_CATEGORIES';
export const MODAL_MARKET_TYPE = 'MODAL_MARKET_TYPE';
export const MODAL_NETWORK_MISMATCH = 'MODAL_NETWORK_MISMATCH';
export const MODAL_NETWORK_CONNECT = 'MODAL_NETWORK_CONNECT';
export const MODAL_NETWORK_DISCONNECTED = 'MODAL_NETWORK_DISCONNECTED';
export const MODAL_ACCOUNT_APPROVAL = 'MODAL_ACCOUNT_APPROVAL';
export const MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET =
  'MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET';
export const MODAL_CLAIM_FEES = 'MODAL_CLAIM_FEES';
export const MODAL_PARTICIPATE = 'MODAL_PARTICIPATE';
export const MODAL_NETWORK_DISABLED = 'MODAL_NETWORK_DISABLED';
export const MODAL_DISCLAIMER = 'MODAL_DISCLAIMER';
export const MODAL_CONFIRM = 'MODAL_CONFIRM';
export const MODAL_REVIEW = 'MODAL_REVIEW';
export const MODAL_GAS_PRICE = 'MODAL_GAS_PRICE';
export const MODAL_REP_FAUCET = 'MODAL_REP_FAUCET';
export const MODAL_CREATE_MARKET = 'MODAL_CREATE_MARKET';
export const MODAL_DAI_FAUCET = 'MODAL_DAI_FAUCET';
export const MODAL_CREATION_HELP = 'MODAL_CREATION_HELP';
export const MODAL_DEPOSIT = 'MODAL_DEPOSIT';
export const MODAL_WITHDRAW = 'MODAL_WITHDRAW';
export const MODAL_MIGRATE_REP = 'MODAL_MIGRATE_REP';
export const MODAL_TRANSACTIONS = 'MODAL_TRANSACTIONS';
export const MODAL_UNSIGNED_ORDERS = 'MODAL_UNSIGNED_ORDERS';
export const MODAL_ADD_FUNDS = 'MODAL_ADD_FUNDS';
export const MODAL_UNIVERSE_SELECTOR = 'MODAL_UNIVERSE_SELECTOR';
export const MODAL_BUY_DAI = 'MODAL_BUY_DAI';
export const MODAL_TEST_BET = 'MODAL_TEST_BET';
export const MODAL_GLOBAL_CHAT = 'MODAL_GLOBAL_CHAT';
export const MODAL_AUGUR_USES_DAI = 'MODAL_AUGUR_USES_DAI';
export const MODAL_TUTORIAL_OUTRO = 'MODAL_TUTORIAL_OUTRO';
export const MODAL_TUTORIAL_INTRO = 'MODAL_TUTORIAL_INTRO';

// export const MODAL_CLAIM_TRADING_PROCEEDS = 'MODAL_CLAIM_TRADING_PROCEEDS';
export const MODAL_CLAIM_MARKETS_PROCEEDS = 'MODAL_CLAIM_MARKETS_PROCEEDS';
export const MODAL_TRADING_OVERLAY = 'MODAL_TRADING_OVERLAY';
export const MODAL_FINALIZE_MARKET = 'MODAL_FINALIZE_MARKET';
export const MODAL_DISCARD = 'MODAL_DISCARD';
export const DISCLAIMER_SEEN = 'disclaimerSeen';
export const MARKET_REVIEW_SEEN = 'marketReviewSeen';
export const MODAL_MARKET_REVIEW = 'MODAL_MARKET_REVIEW';
export const MODAL_OPEN_ORDERS = 'MODAL_OPEN_ORDERS';
export const MODAL_MARKET_LOADING = 'MODAL_MARKET_LOADING';
export const MODAL_DR_QUICK_GUIDE = 'MODAL_DR_QUICK_GUIDE';
export const MODAL_MIGRATE_MARKET = 'MODAL_MIGRATE_MARKET';
export const MODAL_LOGIN = 'MODAL_LOGIN';
export const MODAL_SIGNUP = 'MODAL_SIGNUP';
export const MODAL_CONNECT = 'MODAL_CONNECT';
export const MODAL_LOADING = 'MODAL_LOADING';
export const MODAL_ACCOUNT_CREATED = 'MODAL_ACCOUNT_CREATED';
export const MODA_WALLET_ERROR = 'MODA_WALLET_ERROR';

// transactions parameter names
export const TX_ORDER_ID = '_orderId';
export const TX_ORDER_IDS = '_orderIds';
export const TX_TRADE_GROUP_ID = '_tradeGroupId';
export const TX_MARKET_ID = '_market';
export const TX_AMOUNT = '_amount';
export const TX_DIRECTION = '_direction';
export const TX_ORDER_TYPE = '_type';
export const TX_PRICE = '_price';
export const TX_OUTCOME_ID = '_outcome';
export const TX_NUM_SHARES = '_attoshares';
export const TX_OUTCOMES = '_outcomes';
export const TX_PRICES = '_prices';
export const TX_TYPES = '_types';
// # Alerts
export const CRITICAL = 'CRITICAL';
export const INFO = 'INFO';
export const CREATEGENESISUNIVERSE = 'CREATEGENESISUNIVERSE';
export const CANCELORDER = 'CANCELORDER';
export const CANCELORDERS = 'CANCELORDERS';
export const WITHDRAWETHERTOIFPOSSIBLE = 'WITHDRAWETHERTOIFPOSSIBLE';
export const CALCULATEREPORTINGFEE = 'CALCULATEREPORTINGFEE';
export const CLAIMTRADINGPROCEEDS = 'CLAIMTRADINGPROCEEDS';
export const PUBLICCREATEORDER = 'PUBLICCREATEORDER';
export const PUBLICCREATEORDERS = 'PUBLICCREATEORDERS';
export const BUYPARTICIPATIONTOKENS = 'BUYPARTICIPATIONTOKENS';
export const PUBLICFILLBESTORDER = 'PUBLICFILLBESTORDER';
export const PUBLICFILLBESTORDERWITHLIMIT = 'PUBLICFILLBESTORDERWITHLIMIT';
export const PUBLICFILLORDER = 'PUBLICFILLORDER';
export const MIGRATEREP = 'MIGRATEREP';
export const WITHDRAWETHER = 'WITHDRAWETHER';
export const WITHDRAWTOKENS = 'WITHDRAWTOKENS';
export const CONTRIBUTE = 'CONTRIBUTE';
export const DISAVOWCROWDSOURCERS = 'DISAVOWCROWDSOURCERS';
export const DOINITIALREPORT = 'DOINITIALREPORT';
export const FINALIZE = 'FINALIZE';
export const FINALIZEFORK = 'FINALIZEFORK';
export const MIGRATETHROUGHONEFORK = 'MIGRATETHROUGHONEFORK';
export const MIGRATEBALANCESFROMLEGACYREP = 'MIGRATEBALANCESFROMLEGACYREP';
export const MIGRATEALLOWANCESFROMLEGACYREP = 'MIGRATEALLOWANCESFROMLEGACYREP';
export const MIGRATEIN = 'MIGRATEIN';
export const MIGRATEOUT = 'MIGRATEOUT';
export const MIGRATEOUTBYPAYOUT = 'MIGRATEOUTBYPAYOUT';
export const UPDATEPARENTTOTALTHEORETICALSUPPLY =
  'UPDATEPARENTTOTALTHEORETICALSUPPLY';
export const UPDATESIBLINGMIGRATIONTOTAL = 'UPDATESIBLINGMIGRATIONTOTAL';
export const PUBLICBUY = 'PUBLICBUY';
export const PUBLICBUYWITHLIMIT = 'PUBLICBUYWITHLIMIT';
export const PUBLICSELL = 'PUBLICSELL';
export const PUBLICSELLWITHLIMIT = 'PUBLICSELLWITHLIMIT';
export const PUBLICTRADE = 'PUBLICTRADE';
export const PUBLICTRADEWITHLIMIT = 'PUBLICTRADEWITHLIMIT';
export const FAUCET = 'FAUCET';
export const CLAIMSHARESINUPDATE = 'CLAIMSHARESINUPDATE';
export const GETFROZENSHAREVALUEINMARKET = 'GETFROZENSHAREVALUEINMARKET';
export const CREATEMARKET = 'CREATEMARKET';
export const CREATECATEGORICALMARKET = 'CREATECATEGORICALMARKET';
export const CREATESCALARMARKET = 'CREATESCALARMARKET';
export const CREATEYESNOMARKET = 'CREATEYESNOMARKET';
export const CREATECHILDUNIVERSE = 'CREATECHILDUNIVERSE';
export const FORK = 'FORK';
export const REDEEMSTAKE = 'REDEEMSTAKE';
export const GETINITIALREPORTSTAKESIZE = 'GETINITIALREPORTSTAKESIZE';
export const GETORCACHEDESIGNATEDREPORTNOSHOWBOND =
  'GETORCACHEDESIGNATEDREPORTNOSHOWBOND';
export const GETORCACHEDESIGNATEDREPORTSTAKE =
  'GETORCACHEDESIGNATEDREPORTSTAKE';
export const GETORCACHEREPORTINGFEEDIVISOR = 'GETORCACHEREPORTINGFEEDIVISOR';
export const GETORCACHEVALIDITYBOND = 'GETORCACHEVALIDITYBOND';
export const GETORCREATECURRENTFEEWINDOW = 'GETORCREATECURRENTFEEWINDOW';
export const GETORCREATEFEEWINDOWBYTIMESTAMP =
  'GETORCREATEFEEWINDOWBYTIMESTAMP';
export const GETORCREATENEXTFEEWINDOW = 'GETORCREATENEXTFEEWINDOW';
export const GETORCREATEPREVIOUSFEEWINDOW = 'GETORCREATEPREVIOUSFEEWINDOW';
export const UPDATEFORKVALUES = 'UPDATEFORKVALUES';
export const APPROVE = 'APPROVE';
export const DECREASEAPPROVAL = 'DECREASEAPPROVAL';
export const DEPOSITETHER = 'DEPOSITETHER';
export const DEPOSITETHERFOR = 'DEPOSITETHERFOR';
export const FORKANDREDEEM = 'FORKANDREDEEM';
export const REDEEMFORREPORTINGPARTICIPANT = 'REDEEMFORREPORTINGPARTICIPANT';
export const REDEEM = 'REDEEM';
export const INCREASEAPPROVAL = 'INCREASEAPPROVAL';
export const MIGRATE = 'MIGRATE';
export const TRANSFER = 'TRANSFER';
export const TRANSFERFROM = 'TRANSFERFROM';
export const TRANSFEROWNERSHIP = 'TRANSFEROWNERSHIP';
export const WITHDRAWETHERTO = 'WITHDRAWETHERTO';
export const WITHDRAWINEMERGENCY = 'WITHDRAWINEMERGENCY';
export const SENDETHER = 'SENDETHER';
export const SENDREPUTATION = 'SENDREPUTATION';
export const CUSTOM = 'Custom';
export const PREFILLEDSTAKE = 'PREFILLEDSTAKE';

// # Orders/Trade Constants
export const ORDER_BOOK_TABLE = 'ORDER_BOOK_TABLE';
export const ORDER_BOOK_CHART = 'ORDER_BOOK_CHART';
export const BIDS = 'bids';
export const ASKS = 'asks';
export const CANCELED = 'CANCELED';
export const OPEN = 'OPEN';
export const FILLED = 'FILLED';
export const ALL_ORDERS = 'ALL';
export const PRICE = 'price';
export const SHARE = 'share';
export const SHARES = 'Shares';
export const BUY = 'buy';
export const SELL = 'sell';
export const BUY_INDEX = 0;
export const SELL_INDEX = 1;
export const BOUGHT = 'bought';
export const SOLD = 'sold';
export const BUYING = 'buying';
export const SELLING = 'selling';
export const BUYING_BACK = 'buying back';
export const SELLING_OUT = 'selling out';
export const WARNING = 'warning';
export const ERROR = 'error';
export const UP = 'up';
export const DOWN = 'down';
export const NONE = 'none';
export const ZERO = createBigNumber(0);
export const ONE = createBigNumber(1, 10);
export const TWO = createBigNumber(2, 10);
export const TEN = createBigNumber(10, 10);
export const TEN_TO_THE_EIGHTEENTH_POWER = TEN.exponentiatedBy(18);
export const MIN_QUANTITY = createBigNumber('0.00000001');
export const DISPUTE_GAS_COST = createBigNumber(480000);
export const INITAL_REPORT_GAS_COST = createBigNumber(1094412);
export const V1_REP_MIGRATE_ESTIMATE = createBigNumber(303000);
export const NEW_ORDER_GAS_ESTIMATE = createBigNumber(675334);
export const NEW_MARKET_GAS_ESTIMATE = createBigNumber(2000000);
export const MIGRATE_MARKET_GAS_ESTIMATE = createBigNumber(3000000); // TODO: Get actual gas estimate for migrating a market
export const CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE = createBigNumber(1121349); // Gas cost for claiming proceeds from a categorical market with 8 outcomes (worst-case gas cost)
export const CLAIM_MARKETS_PROCEEDS_GAS_LIMIT = createBigNumber(3000000);
export const CLAIM_FEES_GAS_COST = createBigNumber(250000);
export const BUY_PARTICIPATION_TOKENS_GAS_LIMIT = createBigNumber(290000);
export const MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT = Math.floor(
  createBigNumber(CLAIM_MARKETS_PROCEEDS_GAS_LIMIT)
    .div(CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE)
    .toNumber()
);
export const MAX_BULK_ORDER_COUNT = 5;
export const ETHER = createBigNumber(10).pow(18);

// # Positions
export const LONG = 'long';
export const SHORT = 'short';
export const CLOSED = 'closed';
export const NO_POSITION = '—';

export const AWAITING_SIGNATURE = 'awaiting signature';
export const PENDING = 'pending';
export const SUCCESS = 'success';
export const FAILED = 'Failed';
export const FAILURE = 'Failure';
export const CONFIRMED = 'Confirmed';
export const COMMITTING = 'committing';
export const SUBMITTED = 'submitted';
export const INTERRUPTED = 'interrupted';

// Market Creation
export const CREATING_MARKET = 'creating market...';

// Order Book Generation
export const GENERATING_ORDER_BOOK = 'generating order book...';

export const SIMULATED_ORDER_BOOK = 'order book simulated';

export const COMPLETE_SET_BOUGHT = 'complete set bought';
export const ORDER_BOOK_ORDER_COMPLETE = 'order creation complete';
export const ORDER_BOOK_OUTCOME_COMPLETE = 'outcome creation complete';

export const CANCELLING_ORDER = 'cancelling order';

export const DAY = 'days';
export const WEEK = 'week';
export const MONTH = 'month';
export const EITHER = 'either';
export const MAKER = 'maker';
export const TAKER = 'taker';
// for add-transactions.js and transactions.jsx
export const ALL = 'all';
export const PUBLIC_TRADE = 'publicTrade';
export const OPEN_ORDER = 'OpenOrder';
export const MARKET_CREATION = 'MarketCreation';
export const TRADE = 'Trade';
export const POSITION = 'Position';
export const REPORTING = 'Reporting';

// Other
export const TRANSFER_FUNDS = 'transfer_funds';
export const SENT_CASH = 'sent_cash';
export const SENT_ETHER = 'sent_ether';
export const SMALL = 'small';
export const NORMAL = 'normal';
export const LARGE = 'large';

// Trade/order labels
export const BID = 'bid';
export const ASK = 'ask';
export const MATCH_BID = 'match_bid';
export const MATCH_ASK = 'match_ask';

export const VOLUME_DAI_SHARES = [
  {
    value: DAI,
    label: DAI,
  },
  {
    value: SHARES,
    label: SHARES,
  },
];

export const VOLUME_ETH_SHARES = [
  {
    value: ETH,
    label: ETH,
  },
  {
    value: SHARES,
    label: SHARES,
  },
];

// Account Summary - Your Overview
export const YOUR_OVERVIEW_TITLE = 'Your Overview';
export const PROFIT_LOSS_CHART_TITLE = 'Profit and Loss';
export const AVAILABLE_TRADING_BALANCE = 'Available Trading Balance';
export const TOTAL_FROZEN_FUNDS = 'Total Frozen Funds';
export const REP_BALANCE = 'REP Balance';
export const REP_STAKED = 'REP Staked';
export const TOTAL_ACCOUNT_VALUE_IN_DAI = 'Total Account Value';
export const TOTAL_ACCOUNT_VALUE_IN_REP = 'My Available REP Balance ';
export const ALL_TIME_PROFIT_AND_LOSS_REP = 'All Time Profit and Loss';
export const MY_TOTOL_REP_STAKED = 'My Total REP Staked';

// Account Summary - Augur Status
export const AUGUR_STATUS_TITLE = 'Augur Status';
export const SYNCING_TITLE = 'Syncing market Data';
export const SYNCED = 'Synced';
export const SYNCING = 'Syncing';
export const MANY_BLOCKS_BEHIND = '(many blocks behind)';
export const SYNC_MESSAGE_SYNCED = 'Market Data is up to date.';
export const SYNC_MESSAGE_SYNCING =
  'Market data such as price and orderbooks may be out of date.';
export const SYNC_MESSAGE_BLOCKSBEHIND =
  'Market data such as price and orderbooks may be considerably out of date.';
export const SYNC_BENIND = 'Blocks behind';
export const SYNC_PROCESSED = 'Blocks Processed';

// Account Summary - Notifications
export const NOTIFICATIONS_TITLE = 'Notifications';
export const NOTIFICATIONS_LABEL = 'notifications';
export const NEW = 'New';
export const RESOLVED_MARKETS_OPEN_ORDERS_TITLE =
  'Open Orders in Resolved Market';
export const REPORTING_ENDS_SOON_TITLE = 'Reporting Ends Soon';
export const FINALIZE_MARKET_TITLE = 'Finalize Market';
export const UNSIGNED_ORDERS_TITLE = 'Unsigned Orders';
export const CLAIM_REPORTING_FEES_TITLE = 'Claim Stake and Fees';
export const PROCEEDS_TO_CLAIM_TITLE = 'Claim Proceeds';
export const OPEN_ORDERS_RESOLVED_MARKET = 'resolvedMarketsOpenOrders';
export const REPORT_ON_MARKET = 'reportOnMarkets';
export const FINALIZE_MARKET = 'finalizeMarkets';
export const MARKET_IN_DISPUTE = 'marketsInDispute';
export const CLAIM_REPORTING_FEES = 'claimReportingFees';
export const UNSIGNED_ORDERS = 'unsignedOrders';
export const PROCEEDS_TO_CLAIM = 'proceedsToClaim';

export const NOTIFICATION_TYPES = {
  [OPEN_ORDERS_RESOLVED_MARKET]: OPEN_ORDERS_RESOLVED_MARKET,
  [REPORT_ON_MARKET]: REPORT_ON_MARKET,
  [FINALIZE_MARKET]: FINALIZE_MARKET,
  [MARKET_IN_DISPUTE]: MARKET_IN_DISPUTE,
  [CLAIM_REPORTING_FEES]: CLAIM_REPORTING_FEES,
  [UNSIGNED_ORDERS]: UNSIGNED_ORDERS,
  [PROCEEDS_TO_CLAIM]: PROCEEDS_TO_CLAIM,
};

// Account View - Timeframe selection options
// # Timeframe readable names
export const TIMEFRAMES = {
  DAY: '24 hr',
  WEEK: '1 Week',
  MONTH: '1 Month',
  ALL: 'All Time',
};

export const TIMEFRAME_OPTIONS = [
  { label: TIMEFRAMES.DAY, periodInterval: 86400, id: 0 },
  { label: TIMEFRAMES.WEEK, periodInterval: 604800, id: 1 },
  { label: TIMEFRAMES.MONTH, periodInterval: 2592000, id: 2 },
  { label: TIMEFRAMES.ALL, periodInterval: 0, id: 3 },
];

// Pending Queue Types
export const CLAIM_STAKE_FEES = 'CLAIM_STAKE_FEES';
export const CLAIM_MARKETS_PROCEEDS = 'CLAIM_MARKETS_PROCEEDS';
export const CREATE_MARKET = 'CREATE_MARKET';

// Pending Queue SINGLE TYPE
export const CLAIM_FEE_WINDOWS = 'CLAIM_FEE_WINDOWS';

// Media Queries
export const SMALL_MOBILE = '(max-width: 900px)'; // matches @breakpoint-mobile-mid
export const TABLET = '(min-width: 901px) and (max-width: 1280px)';
export const DESKTOP = '(min-width:1281px) and (max-width: 2000px)';
export const LARGE_DESKTOP = '(min-width: 2001px)';
// temp tablet breakpoint until trading pg additional breakpoints are implemented
export const TEMP_TABLET = '(max-width: 1280px)';
export const TABLET_MAX = '(max-width: 1200px)';

// Sort variables
export const END_TIME = 'endTime';

// Table Column types
export const PLAIN = 'PLAIN';
export const TEXT = 'TEXT';
export const POSITION_TYPE = 'POSITION_TYPE';
export const VALUE = 'VALUE';
export const CANCEL_TEXT_BUTTON = 'CANCEL_TEXT_BUTTON';
export const MOVEMENT_LABEL = 'MOVEMENT_LABEL';
export const INVALID_LABEL = 'INVALID_LABEL';

export const COLUMN_TYPES = {
  [TEXT]: TEXT,
  [POSITION_TYPE]: POSITION_TYPE,
  [VALUE]: VALUE,
  [INVALID_LABEL]: INVALID_LABEL,
  [CANCEL_TEXT_BUTTON]: CANCEL_TEXT_BUTTON,
  [MOVEMENT_LABEL]: MOVEMENT_LABEL,
  [PLAIN]: PLAIN,
};

export const BINARY_CATEGORICAL_SHARE_OPTIONS = {
  decimals: 2,
  decimalsRounded: 2,
};

// Login method variables
export const TREZOR_MANIFEST_EMAIL = 'team@augur.net';
export const TREZOR_MANIFEST_APPURL = 'https://dev.augur.net';
export const PORTIS_API_KEY = 'b67817cf-8dd0-4116-a0cf-657820ddc019';
export const FORTMATIC_API_KEY = 'pk_live_8001A50CCA35D8CB';
export const FORTMATIC_API_TEST_KEY = 'pk_test_5185BE42CA372148';

export const NON_EXISTENT = 'N/A';

export const YES_NO_OUTCOMES = [
  {
    id: 0,
    description: 'Invalid',
    isTradeable: true,
  },
  {
    id: 1,
    description: 'No',
    isTradeable: true,
  },
  {
    id: 2,
    description: 'Yes',
    isTradeable: true,
  },
];

export const SCALAR_OUTCOMES = [
  {
    id: 0,
    description: 'Invalid',
    isTradeable: true,
  },
  {
    id: 2,
    description: NON_EXISTENT,
    isTradeable: true,
  },
];

export const POPULAR_CATEGORIES = [
  'sports',
  'politics',
  'entertainment',
  'finance',
  'crypto',
];

export const POPULAR_CATEGORIES_ICONS = [
  CategorySports,
  CategoryPolitics,
  CategoryEntertainment,
  CategoryFinance,
  CategoryCrypto,
];

export const CATEGORIES_MAX = 5;

export enum PAGINATION_VIEW_OPTIONS {
  ALL = 'All',
  TEN = '10',
  FIFTY = '50',
  HUNDRED = '100',
}

export enum TRADING_TUTORIAL_STEPS {
  INTRO_MODAL = 0,
  MARKET_DETAILS = 1,
  MARKET_DATA = 2,
  BUYING_SHARES = 3,
  SELECT_OUTCOME = 4,
  QUANTITY = 5,
  LIMIT_PRICE = 6,
  ORDER_VALUE = 7,
  ORDER_BOOK = 8,
  PLACE_ORDER = 9,
  OPEN_ORDERS = 10,
  MY_FILLS = 11,
  POSITIONS = 12,
  OUTRO_MODAL = 13,
}

export const TRADING_TUTORIAL_COPY = {
  [TRADING_TUTORIAL_STEPS.MARKET_DETAILS]: {
    title: 'Market Details',
    subheader: [
      {
        text:
          "First, lets start by looking over the market details. Be sure to check that the question isn't subjective or ambiguous, and that the Resolution Source abides by the",
        linkText: 'community guidelines.',
        link: 'https://www.docs.augur.net',
      },
    ],
  },
  [TRADING_TUTORIAL_STEPS.MARKET_DATA]: {
    title: 'Market Data',
    subheader: [
      {
        text:
          "Here you can get an idea of the market's trading volume (how much has changed hands) and open interest (sum of trades matched). Make sure that the event expiration leaves time for the outcome to be made known and that you're comfortable with the market's fees.",
      },
    ],
  },
  [TRADING_TUTORIAL_STEPS.BUYING_SHARES]: {
    title: 'Buying Shares',
    subheader: [
      {
        text:
          "Let's practice buying shares, or going 'long' on an outcome. First, make sure the 'buy shares' tab is selected.",
      },
      {
        text: "To learn more about selling shares, or going 'short,' see our",
        linkText: 'guide.',
        link: 'https://www.docs.augur.net',
      },
    ],
  },
  [TRADING_TUTORIAL_STEPS.SELECT_OUTCOME]: {
    title: 'Select Outcome',
    subheader: [
      {
        text: "Select the outcome you believe will be correct or appreciate in price.",
      },
      {
        text: "To learn why invalid is an outcome, see our",
        linkText: "guide.",
        link: 'https://www.docs.augur.net'
      },
    ],
  },[TRADING_TUTORIAL_STEPS.QUANTITY]: {
    title: 'Quantity',
    subheader: [
      {
        text: 'Enter the amount of shares you wish to buy. Remember each share is priced between $0.01 - $0.99'
      },
      {
        text: 'Please enter a quantity of 100.',
        lighten: true
      },
    ],
  },
  [TRADING_TUTORIAL_STEPS.LIMIT_PRICE]: {
    title: 'Limit Price',
    subheader: [
      {
        text: 'The Limit Price is the price you’re willing to buy or sell per share. This value is between $0.01 and $0.99, which can also be thought of as a probabilty in percentage terms.'
      },
      {
        text: 'For example predicting that there is a 40% chance of this outcome occurring, you would buy $0.40 per share. If your prediction is right, you stand to make a profit of $0.60 per share.'
      },
      {
        text: 'Enter a limit price of $0.40.',
        lighten: true
      }
    ],
  },
  [TRADING_TUTORIAL_STEPS.ORDER_VALUE]: {
    title: 'Total Order Value',
    subheader: [
      {
        text: "This shows the amount of money required to make this trade.",
      },
      {
        text: "You can change this value to control the total cost of your order, and the quantity will adjust to compensate for the new total order value. So if you want to bet $40, enter 40 in here.",
      },
    ],
  },
  [TRADING_TUTORIAL_STEPS.PLACE_ORDER]: {
    title: 'Place your order',
    subheader: [
      {
        text: "Review your order and make sure everything looks correct.",
      },
      {
        text: "Now go ahead and press the 'Place Buy Order' button or click next.",
        lighten: true,
      }
    ],
  },
  [TRADING_TUTORIAL_STEPS.ORDER_BOOK]: {
    title: 'Order Book',
    subheader: [
      {
        text:
          'Alternatively, you can select an available order from the order book to automatically fill into your order ticket.',
      },
      {
        text:
          'The orders in red are sell orders (offers); the quantities shown are available to buy at the listed prices. The orders in green (bids) are orders from users who wish to buy shares. The quantities show how much you can sell to them at the listed prices.',
      },
    ],
  },
  [TRADING_TUTORIAL_STEPS.OPEN_ORDERS]: {
    title: 'Open Orders',
    subheader: [
      {
        text:
          "Once you order is confirmed, you'll get a notification in the top right and you'll see your funds update in the top bar.",
      },
      {
        text:
          'If you place an order and it doesn’t fill immediately, your order will remain on the order book as an open order until it’s traded with or cancelled.',
      },
      {
        text: 'You can view your open orders for the market in this tab.',
      },
      {
        text:
          'As you can see our order just disappeared from open orders because it was filled. Click next to see it in my fills.',
      },
    ],
  },
  [TRADING_TUTORIAL_STEPS.MY_FILLS]: {
    title: 'My Fills',
    subheader: [
      {
        text:
          "Once an order is partially or completley filled, you'll get a notification in the top right. 'My Fills' are where you can track all filled or partially-filled orders.",
      },
    ],
  },
  [TRADING_TUTORIAL_STEPS.POSITIONS]: {
    title: 'Positions',
    subheader: [
      {
        text:
          'Tracks your overall exposure in the current market. This includes your overall position, the average price you put on that position, potential profit and loss (unrealized P/L) and any realized gains or losses (realized P/L).',
      },
    ],
  },
};

export const GWEI_CONVERSION = 1000000000;

export const EVENT_EXPIRATION_TOOLTIP = {
  header: 'Event expiration',
  content: 'This date time indicates when the settlement process begins.',
};

export const TUTORIAL_QUANTITY = 100;
export const TUTORIAL_PRICE = 0.4;
export const TRADING_TUTORIAL_OUTCOMES = [
  {
    id: 0,
    description: 'Invalid',
    isTradeable: true,
  },
  {
    id: 1,
    description: 'Los Angeles Rams',
    isTradeable: true,
  },
  {
    id: 2,
    description: 'New England Patriots',
    isTradeable: true,
  },
  {
    id: 3,
    description: 'Tie/No Winner',
    isTradeable: true,
  },
];

export const DISPUTING_GUIDE = {
  title: 'DISPUTING QUICK GUIDE',
  content: [{
    header: 'Disputing',
    paragraphs: [
      'After a market’s initial report, it will wait for the current dispute window to end before entering into the ‘Currently Disputing’ tab. This is the time for users to dispute a Tentative Outcome if thet believe the market has been reported on incorectly. Markets awaiting their first or next dispute round can be seen in the ‘Awaiting Next Dispute Round’ tab. An exception to this is when markets have been selected for Fast Resolution.'
    ]
  }, {
    header: 'How to dispute an outcome',
    paragraphs: [
      'A market has to have one of of its non-tentative outcomes bonds filled in order to successfully dispute the current tentative outcome. Choose a non-tentative outcome to either fill the bond completely using your own REP or contribute a smaller amount as part of a crowd sourced bond. If a bond for a non-tentative outcome is successfully filled then that outcome will become the new tentative outcome and the market waits for the next dispute round. This process can repeat itself until a Tentative Outcome is unsuccessfully disputed during a round. Each round the REP stake required to fill a dispute bond is increased.'
    ]
  }, {
    header: 'How a market resolves',
    paragraphs: [
      'If a tentative outcome is not successfully disputed during a dispute round then the market resolves with the current tentative outcome becoming the winning outcome and the reporting phase for that market  is over.'
    ]
  }, {
    header: 'The benefits of reporting',
    paragraphs: [
      'Users who correctly staked on the Winning Outcome get to take a share of the REP that was staked on the incorrect outcome(s). This means you can potentially earn 40% ROI by disputing (i.e staking) against liars and reporting the truth. This keeps the Augur oracle secure and ultimately the Augur platform working how it should.'
    ]
  }],
  learnMoreButtonText: 'Learn more about disputing',
  closeButtonText: 'Close'
};

export const REPORTING_GUIDE = {
  title: 'REPORTING QUICK GUIDE',
  content: [{
    header: 'Upcoming Designated Reporting',
    paragraphs: [
      'Markets in “Upcoming Designated Reporting” are about to enter the reporting phase. The UI displays how much time is remaining before the market will enter reporting'
    ]
  }, {
    header: 'Designated Reporting',
    paragraphs: [
      'Once a market enters reporting, the Designated Reporter (DR) has 24 hours to submit a report on the market’s outcome. If the DR does not submit a report within 24 hours, the market will enter Open Reporting, and the market creator will not receive the No-Show Bond back.',
      'The DR does not unilaterally decide on a market’s outcome. Once a DR submits an outcome, it is open to dispute. If the market ends up resolving to another outcome, the DR will lose their REP stake.'
    ]
  }, {
    header: 'Open Reporting',
    paragraphs: [
      'A market enters Open Reporting if the Designated Reporter does not submit a report within 24 hours of a market’s Reporting Start Time. At this time, any user may report on the outcome and will receive the forfeited No-Show Bond if the market ends up resolving to the outcome that they report. Open Reporting does not require any staked REP on the part of the reporter.'
    ]
  }],
  learnMoreButtonText: 'Learn more about reporting',
  closeButtonText: 'Close'
};

function createOrder(disappear, price, quantity, id, outcomeId, type) {
  return {
    disappear,
    avgPrice: formatDai(price),
    cumulativeShares: quantity.toString(),
    id,
    mySize: '0',
    orderEstimate: createBigNumber(price),
    outcomeId,
    outcomeName: TRADING_TUTORIAL_OUTCOMES[outcomeId].description,
    price: price.toString(),
    quantity: quantity.toString(),
    shares: quantity.toString(),
    sharesEscrowed: formatShares(quantity),
    tokensEscrowed: formatDai(price),
    type,
    unmatchedShares: formatShares(quantity),
  };
}

function createOutcomeOrders(outcomeId) {
  return [
    createOrder(true, TUTORIAL_PRICE, TUTORIAL_QUANTITY, 0, outcomeId, SELL),
    createOrder(false, .5, 150, 1, outcomeId, SELL),
    createOrder(false, .6, 200, 2, outcomeId, SELL),
    createOrder(false, .3, 100, 3, outcomeId, BUY),
    createOrder(false, .2, 150, 4, outcomeId, BUY),
    createOrder(false, .1, 200, 5, outcomeId, BUY),
  ]
}

export const TUTORIAL_ORDER_BOOK = {
  0: createOutcomeOrders(0),
  1: createOutcomeOrders(1),
  2: createOutcomeOrders(2),
  3: createOutcomeOrders(3),
};

function createTrade(date, amount, key, price, time, type) {
  return {
    date,
    amount: createBigNumber(amount),
    key,
    price: createBigNumber(price),
    time,
    type,
  };
}

export const TUTORIAL_TRADING_HISTORY = {
  '21Nov 2019': [
    createTrade('21Nov 2019', 100, '1', 0.5, '19:56:22', BUY),
    createTrade('21Nov 2019', 81, '2', 0.4, '19:55:21', BUY),
    createTrade('20Nov 2019', 56, '3', 0.2, '12:35:21', SELL),
    createTrade('20Nov 2019', 16, '4', 0.24, '11:45:11', SELL),
  ],
  '22Nov 2019': [
    createTrade('22Nov 2019', 40, '1', 0.5, '13:50:32', BUY),
    createTrade('22Nov 2019', 88, '2', 0.4, '02:11:01', SELL),
    createTrade('20Nov 2019', 78, '3', 0.12, '01:35:21', SELL),
  ],
  '25Nov 2019': [
    createTrade('25Nov 2019', 22, '1', 0.5, '11:50:18', SELL),
    createTrade('25Nov 2019', 35, '2', 0.4, '06:44:05', BUY),
    createTrade('20Nov 2019', 44, '3', 0.3, '01:35:21', BUY),
  ],
  '20Nov 2019': [
    createTrade('20Nov 2019', 102, '1', 0.1, '16:50:22', SELL),
    createTrade('20Nov 2019', 56, '2', 0.2, '12:35:21', SELL),
    createTrade('20Nov 2019', 44, '3', 0.3, '12:34:21', BUY),
    createTrade('20Nov 2019', 12, '4', 0.45, '02:35:21', SELL),
    createTrade('20Nov 2019', 78, '6', 0.12, '02:23:21', SELL),
  ],
};
