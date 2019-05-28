import {
  Ledger,
  Edge,
  MetaMask,
  Trezor
} from "modules/common/components/icons";
import { DEFAULT_DERIVATION_PATH } from "modules/auth/helpers/derivation-path";
import {
  timeDay,
  timeHour,
  timeMinute,
  timeMonth,
  timeSecond,
  timeFormat
} from "d3";

import { createBigNumber } from "utils/create-big-number";
// All named constants go here

// # MISC Constants
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const MALFORMED_OUTCOME = "malformed outcome";
// # Asset Types
export const ETH = "ETH";
export const REP = "REP";
export const DAI = "DAI";

// # Network Constants
export const MILLIS_PER_BLOCK = 12000;
export const UNIVERSE_ID = "0xf69b5";
// network id to names map
export const NETWORK_NAMES = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  42: "Kovan",
  12346: "Private"
};
// network name to id map
export const NETWORK_IDS = {
  Mainnet: "1",
  Ropsten: "3",
  Rinkeby: "4",
  Kovan: "42",
  Private1: "101",
  Private2: "102",
  Private3: "103",
  Private4: "104"
};

export const GAS_SPEED_LABELS = {
  STANDARD: "Standard",
  FAST: "Fast",
  SLOW: "Slow"
};
// augurNode
export const AUGUR_NODE_URL = "augur_node";
// ethereumNodeHttp
export const ETHEREUM_NODE_HTTP = "ethereum_node_http";
// ethereumNodeWs
export const ETHEREUM_NODE_WS = "ethereum_node_ws";

// # Auth Types
export const REGISTER = "register";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const IMPORT = "import";
export const FUND_ACCOUNT = "fund_account";

export const AUTH_TYPES = {
  [REGISTER]: REGISTER,
  [LOGIN]: LOGIN,
  [IMPORT]: IMPORT,
  [LOGOUT]: LOGOUT
};

export const DEFAULT_AUTH_TYPE = REGISTER;

export const EDGE_WALLET_TYPE = "wallet:ethereum";

// # Connect Nav Constants
export const ACCOUNT_TYPES = {
  EDGE: "edge",
  LEDGER: "ledger",
  METAMASK: "metaMask",
  TREZOR: "trezor",
  UNLOCKED_ETHEREUM_NODE: "unlockedEthereumNode",
};

export const WALLET_TYPE = {
  SOFTWARE: "software",
  HARDWARE: "hardware"
};

export const ERROR_TYPES = {
  UNABLE_TO_CONNECT: {
    header: "Unable To Connect",
    subheader: "Please install the MetaMask browser plug-in from Metamask.io"
  },
  NOT_SIGNED_IN: {
    header: "Unable To Connect",
    subheader: "Please make sure you are signed in to your account."
  },
  INCORRECT_FORMAT: {
    header: "Incorrect Format",
    subheader: `Please enter a derivative path with the format "${DEFAULT_DERIVATION_PATH}"`
  }
};

const DEFAULT_ITEM_INDEX = 0;
export const ITEMS = [
  {
    param: ACCOUNT_TYPES.METAMASK,
    title: "Metamask / Web 3 Provider",
    icon: MetaMask,
    type: WALLET_TYPE.SOFTWARE
  },
  {
    param: ACCOUNT_TYPES.TREZOR,
    title: "Trezor",
    icon: Trezor,
    type: WALLET_TYPE.HARDWARE
  },
  {
    param: ACCOUNT_TYPES.LEDGER,
    title: "Ledger",
    icon: Ledger,
    type: WALLET_TYPE.HARDWARE
  }
];
if (!process.env.AUGUR_HOSTED) {
  ITEMS.unshift({
    param: ACCOUNT_TYPES.EDGE,
    title: "Edge",
    icon: Edge,
    type: WALLET_TYPE.SOFTWARE
  });
}
ITEMS[DEFAULT_ITEM_INDEX].default = true;

// sidebar related constants
export const MOBILE_MENU_STATES = {
  CLOSED: 0,
  SIDEBAR_OPEN: 1,
  FIRSTMENU_OPEN: 2,
  SUBMENU_OPEN: 3
};

export const SUB_MENU = "subMenu";
export const MAIN_MENU = "mainMenu";

// # Ledger Related Constants
export const ATTEMPTING_CONNECTION = "ATTEMPTING_CONNECTION";
export const CONNECT_LEDGER = "CONNECT_LEDGER";
export const OPEN_APP = "OPEN_APP";
export const SWITCH_MODE = "SWITCH_MODE";
export const ENABLE_CONTRACT_SUPPORT = "ENABLE_CONTRACT_SUPPORT";
export const OTHER_ISSUE = "OTHER_ISSUE";

// # Market Max Fees
export const MAX_FEE_100_PERCENT = "1";
export const MAX_FEE_40_PERCENT = "0.4";
export const MAX_FEE_30_PERCENT = "0.3";
export const MAX_FEE_20_PERCENT = "0.2";
export const MAX_FEE_10_PERCENT = "0.1";
export const MAX_FEE_05_PERCENT = "0.05";
export const MAX_FEE_02_PERCENT = "0.02";

// # Sorting Options
export const NEUTRAL = "neutral";
export const ASCENDING = "ascending";
export const DESCENDING = "descending";

// # Market Sort Params
export const MARKET_VOLUME = "volume";
export const MARKET_CREATION_TIME = "creationTime";
export const MARKET_END_DATE = "endTime";
export const MARKET_RECENTLY_TRADED = "recentlyTraded";
export const MARKET_FEE = "marketFee";
export const MARKET_OPEN_INTEREST = "openInterest";
// The user should be able to sort by:

// Volume
// Recently Traded
// End Date (soonest first)
// Creation Date (most recent first)
// Fee (lowest first)
// The user should be able to filter by market state:

// Open (PRE_REPORTING)
// In Reporting (DESIGNATED_REPORTING, OPEN_REPORTING, CROWDSOURCING_DISPUTE, AWAITING_NEXT_WINDOW)
// Resolved (AWAITING_FINALIZATION, FINALIZED)

// # Market States
export const ALL_MARKETS = "all";
export const MARKET_OPEN = "open";
export const MARKET_REPORTING = "reporting";
export const MARKET_CLOSED = "closed";

// InReporting Labels
export const IN_REPORTING = "In-reporting";
export const WAITING_ON_REPORTER = "Waiting on reporter";
export const OPEN_REPORTING = "Open reporting";
export const AWAITING_NEXT_DISPUTE = "Awaiting next dispute";
export const DISPUTE_ROUND = "Dispute round";
export const REPORTING_ENDS = "Reporting Ends";
export const DISPUTE_ENDS = "Dispute Ends";

// # Market Status Messages
export const MARKET_STATUS_MESSAGES = {
  OPEN: "Open",
  IN_REPORTING: "In Reporting",
  RESOLVED: "Resolved",
  FORKING: "Forking",
  AWAITING_NO_REPORT_MIGRATION: "Awaiting No Report Migrated",
  AWAITING_FORK_MIGRATION: "Awaiting Fork Migration",
  WAITING_PERIOD_ENDS: "Waiting period ends"
};

// Market Header
export const COPY_MARKET_ID = "Copy Market ID";
export const COPY_AURTHOR = "Copy Market Creator ID";

// # Search/Filter Param Names
export const FILTER_SEARCH_PARAM = "keywords";
export const TAGS_PARAM_NAME = "tags";
export const CATEGORY_PARAM_NAME = "category";

// # Close Dialog Status
export const CLOSE_DIALOG_CLOSING = "CLOSE_DIALOG_CLOSING";
export const CLOSE_DIALOG_PENDING = "CLOSE_DIALOG_PENDING";
export const CLOSE_DIALOG_FAILED = "CLOSE_DIALOG_FAILED";
export const CLOSE_DIALOG_NO_ORDERS = "CLOSE_DIALOG_NO_ORDERS";
export const REMOVE_DIALOG_NO_ORDERS = "REMOVE_DIALOG_NO_ORDERS";

// # Link Types
export const TYPE_MARKET = "market";
export const TYPE_REPORT = "report";
export const TYPE_DISPUTE = "dispute";
export const TYPE_CLAIM_PROCEEDS = "claim proceeds";
export const TYPE_TRADE = "trade";
export const TYPE_VIEW = "view";
export const TYPE_VIEW_ORDERS = "view orders";
export const TYPE_VIEW_SETS = "view sets";
export const TYPE_VIEW_DETAILS = "view details";
export const TYPE_MIGRATE_REP = "migrate-rep";
export const TYPE_FINALIZE_MARKET = "finalize market";

// # Market Loading States
export const MARKET_INFO_LOADING = "MARKET_INFO_LOADING";
export const MARKET_INFO_LOADED = "MARKET_INFO_LOADED";
export const MARKET_FULLY_LOADING = "MARKET_FULLY_LOADING";
export const MARKET_FULLY_LOADED = "MARKET_FULLY_LOADED";

// # Market Outcome Constants
export const YES_NO_NO_ID = 0;
export const YES_NO_NO_OUTCOME_NAME = "No";
export const YES_NO_YES_ID = 1;
export const YES_NO_YES_OUTCOME_NAME = "Yes";
export const SCALAR_DOWN_ID = 0;
export const SCALAR_UP_ID = 1;
export const YES_NO_INDETERMINATE_OUTCOME_ID = "0.5";
export const CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID = "0.5";
export const INDETERMINATE_PLUS_ONE = "0.500000000000000001";
export const INDETERMINATE_OUTCOME_NAME = "Indeterminate";

// # Market Types
export const YES_NO = "yesNo";
export const CATEGORICAL = "categorical";
export const SCALAR = "scalar";
export const COMBINATORIAL = "combinatorial";

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
export const EXPIRY_SOURCE_GENERIC = "EXPIRY_SOURCE_GENERIC";
export const EXPIRY_SOURCE_SPECIFIC = "EXPIRY_SOURCE_SPECIFIC";
export const DESIGNATED_REPORTER_SELF = "DESIGNATED_REPORTER_SELF";
export const DESIGNATED_REPORTER_SPECIFIC = "DESIGNATED_REPORTER_SPECIFIC";
export const INITIAL_LIQUIDITY_DEFAULT = 500;
export const INITIAL_LIQUIDITY_MIN = 250;
export const SETTLEMENT_FEE_DEFAULT = 0;
export const SETTLEMENT_FEE_MIN = 0;
export const SETTLEMENT_FEE_MAX = 12.5;
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
    label: "Past minute",
    tickInterval: axis => axis.ticks(timeSecond.every(30))
  },
  {
    duration: 3600,
    label: "Past hour",
    tickInterval: axis => axis.ticks(timeMinute.every(10))
  },
  {
    duration: 86400,
    label: "Past day",
    tickInterval: axis => axis.ticks(timeHour.every(3))
  },
  {
    duration: 604800,
    label: "Past week",
    isDefault: true,
    tickInterval: axis =>
      axis.ticks(timeDay.every(1)).tickFormat(timeFormat("%a %d"))
  },
  {
    duration: 2629800,
    label: "Past month",
    tickInterval: axis => axis.ticks(timeDay.every(6))
  },
  {
    duration: 31557600,
    label: "Past year",
    tickInterval: axis =>
      axis.ticks(timeMonth.every(1)).tickFormat(timeFormat("%b"))
  }
];

export const PERIOD_RANGES = {
  3600: {
    period: 3600,
    format: "{value:%H:%M}",
    crosshair: "{value:%H:%M}",
    range: 24 * 3600 * 1000 // 1 day
  },
  43200: {
    period: 43200,
    format: "{value:%H:%M}",
    crosshair: "{value:%H:%M}",
    range: 7 * 24 * 3600 * 1000 // 1 week
  },
  86400: {
    period: 86400,
    format: "{value:%b %d}",
    crosshair: "{value:%b %d}",
    range: 30 * 24 * 3600 * 1000 // month
  },
  604800: {
    period: 604800,
    format: "{value:%b %d}",
    crosshair: "{value:%b %d}",
    range: 6 * 30 * 24 * 3600 * 1000 // 6 months
  }
};

export const DEFAULT_PERIODS_VALUE = 86400;
export const DEFAULT_SHORT_PERIODS_VALUE = 3600;
export const PERIODS = [
  {
    value: 3600,
    label: "Hourly"
  },
  {
    value: 43200,
    label: "12 Hour"
  },
  {
    value: 86400,
    label: "Daily"
  },
  {
    value: 604800,
    label: "Weekly"
  }
];

// # Precision Constants
export const UPPER_FIXED_PRECISION_BOUND = 8;
export const LOWER_FIXED_PRECISION_BOUND = 0;

// # Modal Constants
export const MODAL_LEDGER = "MODAL_LEDGER";
export const MODAL_TREZOR = "MODAL_TREZOR";
export const MODAL_NETWORK_MISMATCH = "MODAL_NETWORK_MISMATCH";
export const MODAL_NETWORK_CONNECT = "MODAL_NETWORK_CONNECT";
export const MODAL_NETWORK_DISCONNECTED = "MODAL_NETWORK_DISCONNECTED";
export const MODAL_ACCOUNT_APPROVAL = "MODAL_ACCOUNT_APPROVAL";
export const MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET =
  "MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET";
export const MODAL_CLAIM_FEES = "MODAL_CLAIM_FEES";
export const MODAL_PARTICIPATE = "MODAL_PARTICIPATE";
export const MODAL_MIGRATE_MARKET = "MODAL_MIGRATE_MARKET";
export const MODAL_NETWORK_DISABLED = "MODAL_NETWORK_DISABLED";
export const MODAL_DISCLAIMER = "MODAL_DISCLAIMER";
export const MODAL_CONFIRM = "MODAL_CONFIRM";
export const MODAL_REVIEW = "MODAL_REVIEW";
export const MODAL_GAS_PRICE = "MODAL_GAS_PRICE";
export const MODAL_REP_FAUCET = "MODAL_REP_FAUCET";
export const MODAL_DAI_FAUCET = "MODAL_DAI_FAUCET";
export const MODAL_DEPOSIT = "MODAL_DEPOSIT";
export const MODAL_WITHDRAW = "MODAL_WITHDRAW";
export const MODAL_TRANSACTIONS = "MODAL_TRANSACTIONS";
export const MODAL_UNSIGNED_ORDERS = "MODAL_UNSIGNED_ORDERS";
export const MODAL_CLAIM_TRADING_PROCEEDS = "MODAL_CLAIM_TRADING_PROCEEDS";
export const MODAL_CLAIM_PROCEEDS = "MODAL_CLAIM_PROCEEDS";
export const MODAL_TRADING_OVERLAY = "MODAL_TRADING_OVERLAY";
export const MODAL_SELL_COMPLETE_SETS = "MODAL_SELL_COMPLETE_SETS";
export const MODAL_FINALIZE_MARKET = "MODAL_FINALIZE_MARKET";
export const DISCLAIMER_SEEN = "disclaimerSeen";
export const MARKET_REVIEW_SEEN = "marketReviewSeen";
export const MARKET_REVIEWS = "marketReviews";
export const MARKET_REVIEW_TRADE_SEEN = "marketReviewTradeSeen";
export const MODAL_MARKET_REVIEW = "MODAL_MARKET_REVIEW";
export const MODAL_MARKET_REVIEW_TRADE = "MODAL_MARKET_REVIEW_TRADE";
export const MODAL_OPEN_ORDERS = "MODAL_OPEN_ORDERS";

// # Alerts
export const CRITICAL = "CRITICAL";
export const INFO = "INFO";
export const CREATEGENESISUNIVERSE = "CREATEGENESISUNIVERSE";
export const CANCELORDER = "CANCELORDER";
export const WITHDRAWETHERTOIFPOSSIBLE = "WITHDRAWETHERTOIFPOSSIBLE";
export const CALCULATEREPORTINGFEE = "CALCULATEREPORTINGFEE";
export const CLAIMTRADINGPROCEEDS = "CLAIMTRADINGPROCEEDS";
export const PUBLICBUYCOMPLETESETS = "PUBLICBUYCOMPLETESETS";
export const PUBLICBUYCOMPLETESETSWITHCASH = "PUBLICBUYCOMPLETESETSWITHCASH";
export const PUBLICSELLCOMPLETESETS = "PUBLICSELLCOMPLETESETS";
export const PUBLICSELLCOMPLETESETSWITHCASH = "PUBLICSELLCOMPLETESETSWITHCASH";
export const PUBLICCREATEORDER = "PUBLICCREATEORDER";
export const BUYPARTICIPATIONTOKENS = "BUYPARTICIPATIONTOKENS";
export const PUBLICFILLBESTORDER = "PUBLICFILLBESTORDER";
export const PUBLICFILLBESTORDERWITHLIMIT = "PUBLICFILLBESTORDERWITHLIMIT";
export const PUBLICFILLORDER = "PUBLICFILLORDER";
export const MIGRATEREP = "MIGRATEREP";
export const WITHDRAWETHER = "WITHDRAWETHER";
export const WITHDRAWTOKENS = "WITHDRAWTOKENS";
export const CONTRIBUTE = "CONTRIBUTE";
export const DISAVOWCROWDSOURCERS = "DISAVOWCROWDSOURCERS";
export const DOINITIALREPORT = "DOINITIALREPORT";
export const FINALIZE = "FINALIZE";
export const FINALIZEFORK = "FINALIZEFORK";
export const MIGRATETHROUGHONEFORK = "MIGRATETHROUGHONEFORK";
export const MIGRATEBALANCESFROMLEGACYREP = "MIGRATEBALANCESFROMLEGACYREP";
export const MIGRATEALLOWANCESFROMLEGACYREP = "MIGRATEALLOWANCESFROMLEGACYREP";
export const MIGRATEIN = "MIGRATEIN";
export const MIGRATEOUT = "MIGRATEOUT";
export const MIGRATEOUTBYPAYOUT = "MIGRATEOUTBYPAYOUT";
export const UPDATEPARENTTOTALTHEORETICALSUPPLY =
  "UPDATEPARENTTOTALTHEORETICALSUPPLY";
export const UPDATESIBLINGMIGRATIONTOTAL = "UPDATESIBLINGMIGRATIONTOTAL";
export const PUBLICBUY = "PUBLICBUY";
export const PUBLICBUYWITHLIMIT = "PUBLICBUYWITHLIMIT";
export const PUBLICSELL = "PUBLICSELL";
export const PUBLICSELLWITHLIMIT = "PUBLICSELLWITHLIMIT";
export const PUBLICTRADE = "PUBLICTRADE";
export const PUBLICTRADEWITHLIMIT = "PUBLICTRADEWITHLIMIT";
export const FAUCET = "FAUCET";
export const CLAIMSHARESINUPDATE = "CLAIMSHARESINUPDATE";
export const GETFROZENSHAREVALUEINMARKET = "GETFROZENSHAREVALUEINMARKET";
export const CREATEMARKET = "CREATEMARKET";
export const CREATECATEGORICALMARKET = "CREATECATEGORICALMARKET";
export const CREATESCALARMARKET = "CREATESCALARMARKET";
export const CREATEYESNOMARKET = "CREATEYESNOMARKET";
export const CREATECHILDUNIVERSE = "CREATECHILDUNIVERSE";
export const FORK = "FORK";
export const REDEEMSTAKE = "REDEEMSTAKE";
export const GETINITIALREPORTSTAKESIZE = "GETINITIALREPORTSTAKESIZE";
export const GETORCACHEDESIGNATEDREPORTNOSHOWBOND =
  "GETORCACHEDESIGNATEDREPORTNOSHOWBOND";
export const GETORCACHEDESIGNATEDREPORTSTAKE =
  "GETORCACHEDESIGNATEDREPORTSTAKE";
export const GETORCACHEMARKETCREATIONCOST = "GETORCACHEMARKETCREATIONCOST";
export const GETORCACHEREPORTINGFEEDIVISOR = "GETORCACHEREPORTINGFEEDIVISOR";
export const GETORCACHEVALIDITYBOND = "GETORCACHEVALIDITYBOND";
export const GETORCREATECURRENTFEEWINDOW = "GETORCREATECURRENTFEEWINDOW";
export const GETORCREATEFEEWINDOWBYTIMESTAMP =
  "GETORCREATEFEEWINDOWBYTIMESTAMP";
export const GETORCREATENEXTFEEWINDOW = "GETORCREATENEXTFEEWINDOW";
export const GETORCREATEPREVIOUSFEEWINDOW = "GETORCREATEPREVIOUSFEEWINDOW";
export const UPDATEFORKVALUES = "UPDATEFORKVALUES";
export const APPROVE = "APPROVE";
export const DECREASEAPPROVAL = "DECREASEAPPROVAL";
export const DEPOSITETHER = "DEPOSITETHER";
export const DEPOSITETHERFOR = "DEPOSITETHERFOR";
export const FORKANDREDEEM = "FORKANDREDEEM";
export const REDEEMFORREPORTINGPARTICIPANT = "REDEEMFORREPORTINGPARTICIPANT";
export const REDEEM = "REDEEM";
export const INCREASEAPPROVAL = "INCREASEAPPROVAL";
export const MIGRATE = "MIGRATE";
export const TRANSFER = "TRANSFER";
export const TRANSFERFROM = "TRANSFERFROM";
export const TRANSFEROWNERSHIP = "TRANSFEROWNERSHIP";
export const WITHDRAWETHERTO = "WITHDRAWETHERTO";
export const WITHDRAWINEMERGENCY = "WITHDRAWINEMERGENCY";
export const SENDETHER = "SENDETHER";
export const SENDREPUTATION = "SENDREPUTATION";

// # Orders/Trade Constants
export const ORDER_BOOK_TABLE = "ORDER_BOOK_TABLE";
export const ORDER_BOOK_CHART = "ORDER_BOOK_CHART";
export const BIDS = "bids";
export const ASKS = "asks";
export const CANCELED = "CANCELED";
export const OPEN = "OPEN";
export const PRICE = "price";
export const SHARE = "share";
export const SHARES = "Shares";
export const BUY = "buy";
export const SELL = "sell";
export const BOUGHT = "bought";
export const SOLD = "sold";
export const BUYING = "buying";
export const SELLING = "selling";
export const BUYING_BACK = "buying back";
export const SELLING_OUT = "selling out";
export const WARNING = "warning";
export const ERROR = "error";
export const UP = "up";
export const DOWN = "down";
export const NONE = "none";
export const ZERO = createBigNumber(0);
export const ONE = createBigNumber(1, 10);
export const TWO = createBigNumber(2, 10);
export const TEN = createBigNumber(10, 10);
export const TEN_TO_THE_EIGHTEENTH_POWER = TEN.exponentiatedBy(18);
export const MIN_QUANTITY = createBigNumber("0.00000001");
export const NEW_ORDER_GAS_ESTIMATE = createBigNumber(700000);
export const ETHER = createBigNumber(10).pow(18);

// # Positions
export const LONG = "long";
export const SHORT = "short";
export const CLOSED = "closed";
export const NO_POSITION = "—";

export const AWAITING_SIGNATURE = "awaiting signature";
export const PENDING = "pending";
export const SUCCESS = "success";
export const FAILED = "Failed";
export const CONFIRMED = "Confirmed";
export const COMMITTING = "committing";
export const SUBMITTED = "submitted";
export const INTERRUPTED = "interrupted";

// Market Creation
export const CREATING_MARKET = "creating market...";

// Order Book Generation
export const GENERATING_ORDER_BOOK = "generating order book...";

export const SIMULATED_ORDER_BOOK = "order book simulated";

export const COMPLETE_SET_BOUGHT = "complete set bought";
export const ORDER_BOOK_ORDER_COMPLETE = "order creation complete";
export const ORDER_BOOK_OUTCOME_COMPLETE = "outcome creation complete";

export const CANCELLING_ORDER = "cancelling order";

export const DAY = "days";
export const WEEK = "week";
export const MONTH = "month";
// for add-transactions.js and transactions.jsx
export const ALL = "all";
export const PUBLIC_TRADE = "publicTrade";
export const OPEN_ORDER = "OpenOrder";
export const MARKET_CREATION = "MarketCreation";
export const TRADE = "Trade";
export const POSITION = "Position";
export const REPORTING = "Reporting";
export const COMPLETE_SETS_SOLD = "CompleteSetsSold";

// Other
export const TRANSFER_FUNDS = "transfer_funds";
export const SENT_CASH = "sent_cash";
export const SENT_ETHER = "sent_ether";
export const SMALL = "small";
export const NORMAL = "normal";
export const LARGE = "large";

// Trade/order labels
export const BID = "bid";
export const ASK = "ask";
export const MATCH_BID = "match_bid";
export const MATCH_ASK = "match_ask";

export const VOLUME_ETH_SHARES = [
  {
    value: ETH,
    label: ETH
  },
  {
    value: SHARES,
    label: SHARES
  }
];

// Account Summary - Your Overview
export const YOUR_OVERVIEW_TITLE = "Your Overview";
export const PROFIT_LOSS_CHART_TITLE = "Profit and Loss (DAI)";
export const AVAILABLE_TRADING_BALANCE = "Available Trading Balance";
export const TOTAL_FROZEN_FUNDS = "Total Frozen Funds";
export const REP_BALANCE = "REP Balance";
export const REP_STAKED = "REP Staked";
export const TOTAL_ACCOUNT_VALUE_IN_ETH = "Total Account Value (DAI)";

// Account Summary - Augur Status
export const AUGUR_STATUS_TITLE = "Augur Status";
export const SYNCING_TITLE = "Syncing market Data";
export const SYNCED = "Synced";
export const SYNCING = "Syncing";
export const MANY_BLOCKS_BEHIND = "(many blocks behind)";
export const SYNC_MESSAGE_SYNCED = "Market Data is up to date.";
export const SYNC_MESSAGE_SYNCING =
  "Market data such as price and orderbooks may be out of date.";
export const SYNC_MESSAGE_BLOCKSBEHIND =
  "Market data such as price and orderbooks may be considerably out of date.";
export const SYNC_BENIND = "Blocks behind";
export const SYNC_PROCESSED = "Blocks Processed";

// Account Summary - Notifications
export const NOTIFICATIONS_TITLE = "Notifications";
export const NOTIFICATIONS_LABEL = "notifications";
export const NEW = "New";
export const RESOLVED_MARKETS_OPEN_ORDERS_TITLE =
  "Open Orders in Resolved Market";
export const REPORTING_ENDS_SOON_TITLE = "Reporting Ends Soon";
export const FINALIZE_MARKET_TITLE = "Finalize Market";
export const SELL_COMPLETE_SETS_TITLE = "Sell Complete Sets";
export const UNSIGNED_ORDERS_TITLE = "Unsigned Orders";
export const CLAIM_REPORTING_FEES_TITLE = "Claim Stake and Fees";
export const PROCEEDS_TO_CLAIM_TITLE = "Claim Proceeds";
export const OPEN_ORDERS_RESOLVED_MARKET = "resolvedMarketsOpenOrders";
export const REPORT_ON_MARKET = "reportOnMarkets";
export const FINALIZE_MARKET = "finalizeMarkets";
export const MARKET_IN_DISPUTE = "marketsInDispute";
export const SELL_COMPLETE_SET = "completeSetPositions";
export const CLAIM_REPORTING_FEES = "claimReportingFees";
export const UNSIGNED_ORDERS = "unsignedOrders";
export const PROCEEDS_TO_CLAIM = "proceedsToClaim";
export const PROCEEDS_TO_CLAIM_ON_HOLD = "proceedsToClaimOnHold";

export const NOTIFICATION_TYPES = {
  [OPEN_ORDERS_RESOLVED_MARKET]: OPEN_ORDERS_RESOLVED_MARKET,
  [REPORT_ON_MARKET]: REPORT_ON_MARKET,
  [FINALIZE_MARKET]: FINALIZE_MARKET,
  [MARKET_IN_DISPUTE]: MARKET_IN_DISPUTE,
  [SELL_COMPLETE_SET]: SELL_COMPLETE_SET,
  [CLAIM_REPORTING_FEES]: CLAIM_REPORTING_FEES,
  [UNSIGNED_ORDERS]: UNSIGNED_ORDERS,
  [PROCEEDS_TO_CLAIM]: PROCEEDS_TO_CLAIM,
  [PROCEEDS_TO_CLAIM_ON_HOLD]: PROCEEDS_TO_CLAIM_ON_HOLD,
};

// Account View - Timeframe selection options
// # Timeframe readable names
export const TIMEFRAMES = {
  DAY: "24 hr",
  WEEK: "1 Week",
  MONTH: "1 Month",
  ALL: "All Time"
};

export const TIMEFRAME_OPTIONS = [
  { label: TIMEFRAMES.DAY, periodInterval: 86400, id: 0 },
  { label: TIMEFRAMES.WEEK, periodInterval: 604800, id: 1 },
  { label: TIMEFRAMES.MONTH, periodInterval: 2592000, id: 2 },
  { label: TIMEFRAMES.ALL, periodInterval: 0, id: 3 }
];

// Pending Queue Types
export const CLAIM_STAKE_FEES = "CLAIM_STAKE_FEES";
export const CLAIM_PROCEEDS = "CLAIM_PROCEEDS";
// Pending Queue SINGLE TYPE
export const CLAIM_FEE_WINDOWS = "CLAIM_FEE_WINDOWS";

// Media Queries
export const SMALL_MOBILE = "(max-width: 900px)"; // matches @breakpoint-mobile-mid
export const TABLET = "(min-width: 901px) and (max-width: 1280px)";
export const DESKTOP = "(min-width:1281px) and (max-width: 2000px)";
export const LARGE_DESKTOP = "(min-width: 2001px)";
// temp tablet breakpoint until trading pg additional breakpoints are implemented
export const TEMP_TABLET = "(max-width: 1280px)";

// Sort variables
export const END_TIME = "endTime";


// Table Column types
export const PLAIN = "PLAIN";
export const TEXT = "TEXT";
export const POSITION_TYPE = "POSITION_TYPE";
export const VALUE = "VALUE";
export const CANCEL_TEXT_BUTTON = "CANCEL_TEXT_BUTTON";
export const MOVEMENT_LABEL = "MOVEMENT_LABEL";

export const COLUMN_TYPES = {
  [TEXT]: TEXT,
  [POSITION_TYPE]: POSITION_TYPE,
  [VALUE]: VALUE,
  [CANCEL_TEXT_BUTTON]: CANCEL_TEXT_BUTTON,
  [MOVEMENT_LABEL]: MOVEMENT_LABEL,
};

