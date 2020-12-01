import {
  THEMES,
  ODDS_TYPE,
  DEFAULT_FALLBACK_GAS_AVERAGE,
  DEFAULT_FALLBACK_GAS_FAST,
  DEFAULT_FALLBACK_GAS_SAFELOW,
  MOBILE_MENU_STATES,
  MARKET_OPEN,
  MARKET_SORT_PARAMS,
  MAX_FEE_02_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
  DAY,
  ZERO,
  TIME_FORMATS,
  MARKET_CARD_FORMATS,
  FILTER_ALL,
  PAGINATION_COUNT,
  DEFAULT_MARKET_OFFSET,
  SPORTS_GROUP_TYPES,
} from 'modules/common/constants';
import { MARKETS } from 'modules/routes/constants/views';
import {
  DEFAULT_SDK_CONFIGURATION,
  SDKConfiguration,
} from '@augurproject/utils';
import { formatGasCostGwei } from 'utils/format-number';
import {
  GasPriceInfo,
  Blockchain,
  FilterSortOptions,
  INVALID_OPTIONS,
  Universe,
  LoginAccount,
  MarketsList,
} from 'modules/types';
import * as moment from 'moment';
import { TemplateFilters } from '@augurproject/sdk-lite';
import { EMPTY_STATE } from 'modules/create-market/constants';

export const THEME = 'theme';
export const ODDS = 'oddsType';
export const TIME_FORMAT = 'timeFormat';
export const IS_MOBILE = 'isMobile';
export const IS_ODDS_MENU_OPEN = 'isOddsMenuOpen';
export const IS_HELP_MENU_OPEN = 'isHelpMenuOpen';
export const IS_CONNECTION_TRAY_OPEN = 'isConnectionTrayOpen';
export const IS_ALERTS_MENU_OPEN = 'isAlertsMenuOpen';
export const IS_PRODUCT_SWITCHER_OPEN = 'isProductSwitcherOpen';
export const MENU_CHANGE = 'menuChange';
export const Ox_ENABLED = 'zeroXEnabled';
export const ETH_TO_DAI_RATE = 'ethToDaiRate';
export const REP_TO_DAI_RATE = 'repToDaiRate';
export const USDT_TO_DAI_RATE = 'usdtToDaiRate';
export const USDC_TO_DAI_RATE = 'usdcToDaiRate';
export const Ox_STATUS = 'zeroXStatus';
export const RESTORED_ACCOUNT = 'restoredAccount';
export const IS_LOGGED = 'isLogged';
export const IS_CONNECTED = 'isConnected';
export const IS_RECONNECTION_PAUSED = 'isReconnectionPaused';
export const CAN_HOTLOAD = 'canHotload';
export const ENV = 'env';
export const GAS_PRICE_INFO = 'gasPriceInfo';
export const MOBILE_MENU_STATE = 'mobileMenuState';
export const CURRENT_BASE_PATH = 'currentBasePath';
export const BLOCKCHAIN = 'blockchain';
export const CATEGORY_STATS = 'categoryStats';
export const FILTER_SORT_OPTIONS = 'filterSortOptions';
export const MODAL = 'modal';
export const UNIVERSE = 'universe';
export const LOGIN_ACCOUNT = 'loginAccount';
export const FAVORITES = 'favorites';
export const NOTIFICATIONS = 'notifications';
export const ALERTS = 'alerts';
export const PENDING_ORDERS = 'pendingOrders';
export const PENDING_LIQUIDITY_ORDERS = 'pendingLiquidityOrders';
export const PENDING_QUEUE = 'pendingQueue';
export const USER_OPEN_ORDERS = 'userOpenOrders';
export const FILLED_ORDERS = 'filledOrders';
export const ACCOUNT_POSITIONS = 'accountPositions';
export const ANALYTICS = 'analytics';
export const DRAFTS = 'drafts';
export const INITIALIZED_3BOX = 'initialized3box';
export const NEW_MARKET = 'newMarket';
export const MARKETS_LIST = 'marketsList';

export const DEFAULT_PENDING_ORDERS = {
  [PENDING_ORDERS]: {},
  [PENDING_LIQUIDITY_ORDERS]: {},
};

export const STUBBED_PENDING_ORDERS_ACTIONS = {
  addLiquidity: ({ liquidityOrders, txParamHash }) => {},
  updateLiquidity: ({ order, updates, txParamHash, outcomeId }) => {},
  removeLiquidity: ({ txParamHash, outcomeId, orderId }) => {},
  clearLiquidity: () => {},
  loadLiquidity: pendingLiquidityOrders => {},
  clearAllMarketLiquidity: ({ txParamHash }) => {},
  updateLiquidityHash: ({ txParamHash, txHash }) => {},
  updateLiquidityStatus: ({
    txParamHash,
    outcomeId,
    type,
    price,
    eventName,
  }) => {},
  updateSuccessfulLiquidity: ({ txParamHash, outcomeId, type, price }) => {},
  updatePendingOrder: (marketId, order) => {},
  removePendingOrder: (marketId, orderId) => {},
};

export const PENDING_ORDERS_ACTIONS = {
  UPDATE_PENDING_ORDER: 'UPDATE_PENDING_ORDER',
  REMOVE_PENDING_ORDER: 'REMOVE_PENDING_ORDER',
  UPDATE_LIQUIDITY_ORDER: 'UPDATE_LIQUIDITY_ORDER',
  ADD_MARKET_LIQUIDITY_ORDERS: 'ADD_MARKET_LIQUIDITY_ORDERS',
  REMOVE_LIQUIDITY_ORDER: 'REMOVE_LIQUIDITY_ORDER',
  CLEAR_LIQUIDITY_ORDERS: 'CLEAR_LIQUIDITY_ORDERS',
  LOAD_PENDING_LIQUIDITY_ORDERS: 'LOAD_PENDING_LIQUIDITY_ORDERS',
  CLEAR_ALL_MARKET_ORDERS: 'CLEAR_ALL_MARKET_ORDERS',
  UPDATE_TX_PARAM_HASH_TX_HASH: 'UPDATE_TX_PARAM_HASH_TX_HASH',
  UPDATE_LIQUIDITY_ORDER_STATUS: 'UPDATE_LIQUIDITY_ORDER_STATUS',
  DELETE_SUCCESSFUL_LIQUIDITY_ORDER: 'DELETE_SUCCESSFUL_LIQUIDITY_ORDER',
};

export const DEFAULT_LOGIN_ACCOUNT_STATE: LoginAccount = {
  balances: {
    eth: '0',
    rep: '0',
    dai: '0',
    legacyRep: '0',
    attoRep: '0',
    legacyAttoRep: '0',
    signerBalances: {
      eth: null,
      rep: '0',
      dai: '0',
      legacyRep: '0',
    },
  },
  reporting: {
    profitLoss: ZERO,
    profitAmount: ZERO,
    reporting: null,
    disputing: null,
    participationTokens: null,
  },
  currentOnboardingStep: 0,
  tradingApproved: false,
  totalOpenOrdersFrozenFunds: '0',
  tradingPositionsTotal: {
    unrealizedRevenue24hChangePercent: '0',
  },
  settings: {
    showInvalidMarketsBannerFeesOrLiquiditySpread: true,
    showInvalidMarketsBannerHideOrShow: true,
    marketTypeFilter: FILTER_ALL,
    templateFilter: TemplateFilters.templateOnly,
    maxFee: MAX_FEE_02_PERCENT,
    maxLiquiditySpread: MAX_SPREAD_ALL_SPREADS,
    includeInvalidMarkets: INVALID_OPTIONS.Hide,
    marketFilter: null,
    sortBy: null,
  },
  timeframeData: {
    positions: 0,
    numberOfTrades: 0,
    marketsCreated: 0,
    marketsTraded: 0,
    successfulDisputes: 0,
    redeemedPositions: 0,
  },
};

const DEFAULT_ENV: SDKConfiguration = JSON.parse(
  JSON.stringify(DEFAULT_SDK_CONFIGURATION)
);
const DEFAULT_GAS_PRICE_INFO: GasPriceInfo = {
  userDefinedGasPrice: null,
  average: formatGasCostGwei(DEFAULT_FALLBACK_GAS_AVERAGE, {}).value,
  fast: formatGasCostGwei(DEFAULT_FALLBACK_GAS_FAST, {}).value,
  safeLow: formatGasCostGwei(DEFAULT_FALLBACK_GAS_SAFELOW, {}).value,
};
const DEFAULT_BLOCKCHAIN: Blockchain = {
  currentBlockNumber: 0,
  currentAugurTimestamp: moment().unix(), // default to user's time until new block comes in
  lastSyncedBlockNumber: 0,
  blocksBehindCurrent: 0,
  percentSynced: '0',
};
const DEFAULT_UNIVERSE_STATE: Universe = {
  children: null,
  id: null,
  creationTimestamp: 0,
  parentUniverseId: null,
  forkingInfo: null,
  outcomeName: '',
  usersRep: '0',
  totalRepSupply: '0',
  totalOpenInterest: '0',
  numberOfMarkets: 0,
  warpSyncHash: undefined,
  disputeWindow: {
    address: null,
    startTime: 0,
    endTime: 0,
    purchased: '0',
    fees: '0',
  },
  timeframeData: {
    activeUsers: 0,
    openInterest: ZERO,
    marketsCreated: 0,
    numberOfTrades: 0,
    disputedMarkets: 0,
    volume: ZERO,
    amountStaked: ZERO,
  },
};
export const MARKET_FILTER = 'marketFilter';
export const MARKET_SORT = 'sortBy';
export const MARKET_MAX_FEES = 'maxFee';
export const MARKET_MAX_SPREAD = 'maxLiquiditySpread';
export const MARKET_SHOW_INVALID = 'includeInvalidMarkets';
export const MARKET_TYPE_FILTER = 'marketTypeFilter';
export const TRANSACTION_PERIOD = 'transactionPeriod';
export const TEMPLATE_FILTER = 'templateFilter';
export const MARKET_LIMIT = 'limit';
export const MARKET_OFFSET = 'offset';
const DEFAULT_FILTER_SORT_OPTIONS: FilterSortOptions = {
  [MARKET_FILTER]: MARKET_OPEN,
  [MARKET_SORT]: MARKET_SORT_PARAMS.RECENTLY_TRADED,
  [MARKET_MAX_FEES]: MAX_FEE_02_PERCENT,
  [MARKET_MAX_SPREAD]: MAX_SPREAD_ALL_SPREADS,
  [MARKET_SHOW_INVALID]: INVALID_OPTIONS.Hide,
  [MARKET_TYPE_FILTER]: FILTER_ALL,
  [TRANSACTION_PERIOD]: DAY,
  [TEMPLATE_FILTER]: FILTER_ALL,
  [MARKET_LIMIT]: PAGINATION_COUNT,
  [MARKET_OFFSET]: DEFAULT_MARKET_OFFSET,
};

const DEFAULT_MARKETS_LIST_STATE: MarketsList = {
  isSearching: true,
  meta: null,
  allCategoriesMeta: null,
  selectedCategories: [],
  selectedCategory: null,
  marketCardFormat: MARKET_CARD_FORMATS.CLASSIC,
  isSearchInPlace: false,
  sportsGroupTypeFilter: SPORTS_GROUP_TYPES.DAILY,
};

export const DEFAULT_APP_STATUS = {
  [THEME]: THEMES.TRADING,
  [ODDS]: ODDS_TYPE.DECIMAL,
  [TIME_FORMAT]: TIME_FORMATS.TWENTY_FOUR,
  [IS_MOBILE]: false,
  [IS_HELP_MENU_OPEN]: false,
  [IS_CONNECTION_TRAY_OPEN]: false,
  [IS_ODDS_MENU_OPEN]: false,
  [IS_ALERTS_MENU_OPEN]: false,
  [IS_PRODUCT_SWITCHER_OPEN]: false,
  [Ox_ENABLED]: false,
  [ETH_TO_DAI_RATE]: null,
  [REP_TO_DAI_RATE]: null,
  [USDC_TO_DAI_RATE]: null,
  [USDT_TO_DAI_RATE]: null,
  [Ox_STATUS]: null,
  [RESTORED_ACCOUNT]: false,
  [IS_LOGGED]: false,
  [IS_CONNECTED]: false,
  [IS_RECONNECTION_PAUSED]: false,
  [INITIALIZED_3BOX]: {},
  [CAN_HOTLOAD]: false,
  [ENV]: DEFAULT_ENV,
  [GAS_PRICE_INFO]: DEFAULT_GAS_PRICE_INFO,
  [MOBILE_MENU_STATE]: MOBILE_MENU_STATES.CLOSED,
  [CURRENT_BASE_PATH]: MARKETS,
  [BLOCKCHAIN]: DEFAULT_BLOCKCHAIN,
  [CATEGORY_STATS]: {},
  [FILTER_SORT_OPTIONS]: DEFAULT_FILTER_SORT_OPTIONS,
  [MODAL]: {},
  [UNIVERSE]: DEFAULT_UNIVERSE_STATE,
  [LOGIN_ACCOUNT]: DEFAULT_LOGIN_ACCOUNT_STATE,
  [FAVORITES]: {},
  [NOTIFICATIONS]: [],
  [ALERTS]: [],
  [PENDING_QUEUE]: {},
  [USER_OPEN_ORDERS]: {},
  [FILLED_ORDERS]: {},
  [ACCOUNT_POSITIONS]: {},
  [ANALYTICS]: {},
  [DRAFTS]: {},
  [NEW_MARKET]: { ...EMPTY_STATE },
  [MARKETS_LIST]: DEFAULT_MARKETS_LIST_STATE,
  betslipMinimized: true,
};

export const APP_STATUS_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_INITIALIZED_3BOX: 'SET_INITIALIZED_3BOX',
  SET_ODDS: 'SET_ODDS',
  SET_TIME_FORMAT: 'SET_TIME_FORMAT',
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  SET_IS_ODDS_MENU_OPEN: 'SET_IS_ODDS_MENU_OPEN',
  SET_IS_HELP_MENU_OPEN: 'SET_IS_HELP_MENU_OPEN',
  SET_IS_CONNECTION_TRAY_OPEN: 'SET_IS_CONNECTION_TRAY_OPEN',
  SET_IS_ALERTS_MENU_OPEN: 'SET_IS_ALERTS_MENU_OPEN',
  SET_IS_PRODUCT_SWITCHER_OPEN: 'SET_IS_PRODUCT_SWITCHER_OPEN',
  CLOSE_APP_MENUS: 'CLOSE_APP_MENUS',
  SET_Ox_ENABLED: 'SET_Ox_ENABLED',
  UPDATE_DAI_RATES: 'UPDATE_DAI_RATES',
  SET_ETH_TO_DAI_RATE: 'SET_ETH_TO_DAI_RATE',
  SET_REP_TO_DAI_RATE: 'SET_REP_TO_DAI_RATE',
  SET_USDC_TO_DAI_RATE: 'SET_USDC_TO_DAI_RATE',
  SET_USDT_TO_DAI_RATE: 'SET_USDT_TO_DAI_RATE',
  SET_Ox_STATUS: 'SET_Ox_STATUS',
  SET_RESTORED_ACCOUNT: 'SET_RESTORED_ACCOUNT',
  SET_IS_LOGGED: 'SET_IS_LOGGED',
  SET_IS_CONNECTED: 'SET_IS_CONNECTED',
  SET_IS_RECONNECTION_PAUSED: 'SET_IS_RECONNECTION_PAUSED',
  SET_CAN_HOTLOAD: 'SET_CAN_HOTLOAD',
  SET_ENV: 'SET_ENV',
  UPDATE_GAS_PRICE_INFO: 'UPDATE_GAS_PRICE_INFO',
  SET_MOBILE_MENU_STATE: 'SET_MOBILE_MENU_STATE',
  SET_CURRENT_BASE_PATH: 'SET_CURRENT_BASE_PATH',
  UPDATE_BLOCKCHAIN: 'UPDATE_BLOCKCHAIN',
  SET_CATEGORY_STATS: 'SET_CATEGORY_STATS',
  UPDATE_FILTER_SORT_OPTIONS: 'UPDATE_FILTER_SORT_OPTIONS',
  SET_MODAL: 'SET_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  UPDATE_UNIVERSE: 'UPDATE_UNIVERSE',
  SWITCH_UNIVERSE: 'SWITCH_UNIVERSE',
  UPDATE_LOGIN_ACCOUNT: 'UPDATE_LOGIN_ACCOUNT',
  CLEAR_LOGIN_ACCOUNT: 'CLEAR_LOGIN_ACCOUNT',
  LOAD_FAVORITES: 'LOAD_FAVORITES',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  UPDATE_NOTIFICATIONS: 'UPDATE_NOTIFICATIONS',
  ADD_ALERT: 'ADD_ALERT',
  LOAD_ALERTS: 'LOAD_ALERTS',
  UPDATE_ALERT: 'UPDATE_ALERT',
  REMOVE_ALERT: 'REMOVE_ALERT',
  CLEAR_ALERTS: 'CLEAR_ALERTS',
  ADD_PENDING_DATA: 'ADD_PENDING_DATA',
  UPDATE_PENDING_DATA_BY_HASH: 'UPDATE_PENDING_DATA_BY_HASH',
  REMOVE_PENDING_DATA: 'REMOVE_PENDING_DATA',
  REFRESH_USER_OPEN_ORDERS: 'REFRESH_USER_OPEN_ORDERS',
  UPDATE_USER_FILLED_ORDERS: 'UPDATE_USER_FILLED_ORDERS',
  UPDATE_ACCOUNT_POSITIONS_DATA: 'UPDATE_ACCOUNT_POSITIONS_DATA',
  ADD_ANALYTIC: 'ADD_ANALYTIC',
  REMOVE_ANALYTIC: 'REMOVE_ANALYTIC',
  ADD_UPDATE_DRAFT: 'ADD_UPDATE_DRAFT',
  REMOVE_DRAFT: 'REMOVE_DRAFT',
  LOAD_DRAFTS: 'LOAD_DRAFTS',
  ADD_ORDER_TO_NEW_MARKET: 'ADD_ORDER_TO_NEW_MARKET',
  REMOVE_ORDER_FROM_NEW_MARKET: 'REMOVE_ORDER_FROM_NEW_MARKET',
  REMOVE_ALL_ORDER_FROM_NEW_MARKET: 'REMOVE_ALL_ORDER_FROM_NEW_MARKET',
  UPDATE_NEW_MARKET: 'UPDATE_NEW_MARKET',
  CLEAR_NEW_MARKET: 'CLEAR_NEW_MARKET',
  UPDATE_MARKETS_LIST: 'UPDATE_MARKETS_LIST',
  SET_BETSLIP_MINIMIZED: 'SET_BETSLIP_MINIMIZED',
};

export const STUBBED_APP_STATUS_ACTIONS = {
  setBetslipMinimized: (betslipMinimized) => {},
  setTheme: theme => {},
  setOdds: odds => {},
  setTimeFormat: timeFormat => {},
  setIsOddsMenuOpen: isOpen => {},
  setIsHelpMenuOpen: isOpen => {},
  setIsConnectionTrayOpen: isOpen => {},
  setIsAlertsMenuOpen: isOpen => {},
  setIsProductSwitcherOpen: isOpen => {},
  closeAppMenus: () => {},
  setIsMobile: isMobile => {},
  setOxEnabled: isOxEnabled => {},
  updateDaiRates: rates => {},
  setEthToDaiRate: ethToDaiRate => {},
  setRepToDaiRate: repToDaiRate => {},
  setUsdcToDaiRate: repToDaiRate => {},
  setUsdtToDaiRate: repToDaiRate => {},
  setOxStatus: OxStatus => {},
  setRestoredAccount: restoredAccount => {},
  setIsLogged: isLogged => {},
  setIsConnected: isConnected => {},
  setIsReconnectionPaused: isReconnectionPaused => {},
  setCanHotload: canHotload => {},
  setEnv: env => {},
  updateGasPriceInfo: gasPriceInfo => {},
  setMobileMenuState: mobileMenuState => {},
  setCurrentBasePath: currentBasePath => {},
  updateBlockchain: blockchain => {},
  setCategoryStats: categoryStats => {},
  updateFilterSortOptions: filterSortOptions => {},
  setModal: modal => {},
  closeModal: () => {},
  updateUniverse: universe => {},
  switchUniverse: () => {},
  updateLoginAccount: loginAccount => {},
  clearLoginAccount: () => {},
  loadFavorites: favorites => {},
  toggleFavorite: marketId => {},
  updateNotifications: notificiations => {},
  addAlert: alert => {},
  loadAlerts: alerts => {},
  updateAlert: (id, alert) => {},
  removeAlert: (id, name) => {},
  clearAlerts: level => {},
  setInitialized3Box: initialize3box => {},
  addPendingData: (
    pendingId,
    queueName,
    status,
    blockNumber,
    hash,
    info,
  ) => {},
  addPendingDataByHash: ({
    oldHash,
    newHash,
    queueName,
    blockNumber,
    status,
  }) => {},
  removePendingData: ({ hash, queueName, pendingId }) => {},
  refreshUserOpenOrders: userOpenOrders => {},
  updateUserFilledOrders: (account, userFilledOrders) => {},
  updateAccountPositions: ({ positionData, marketId }) => {},
  addAnalytic: (id, analytic) => {},
  removeAnalytic: id => {},
  addUpdateDraft: (key, draft) => {},
  removeDraft: key => {},
  loadDrafts: drafts => {},
  addOrderToNewMarket: order => {},
  removeOrderFromNewMarket: order => {},
  updateNewMarket: newMarketData => {},
  removeAllOrdersFromNewMarket: () => {},
  clearNewMarket: () => {},
  updateMarketsList: data => {},
};
