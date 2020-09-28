import { useReducer } from 'react';
import {
  APP_STATUS_ACTIONS,
  DEFAULT_APP_STATUS,
  THEME,
  ODDS,
  TIME_FORMAT,
  IS_HELP_MENU_OPEN,
  IS_CONNECTION_TRAY_OPEN,
  IS_ODDS_MENU_OPEN,
  IS_ALERTS_MENU_OPEN,
  IS_MOBILE,
  Ox_ENABLED,
  ETH_TO_DAI_RATE,
  REP_TO_DAI_RATE,
  USDT_TO_DAI_RATE,
  USDC_TO_DAI_RATE,
  Ox_STATUS,
  RESTORED_ACCOUNT,
  IS_LOGGED,
  IS_CONNECTED,
  IS_RECONNECTION_PAUSED,
  CAN_HOTLOAD,
  ENV,
  GAS_PRICE_INFO,
  MOBILE_MENU_STATE,
  CURRENT_BASE_PATH,
  BLOCKCHAIN,
  CATEGORY_STATS,
  FILTER_SORT_OPTIONS,
  MODAL,
  UNIVERSE,
  LOGIN_ACCOUNT,
  DEFAULT_LOGIN_ACCOUNT_STATE,
  FAVORITES,
  NOTIFICATIONS,
  ALERTS,
  PENDING_QUEUE,
  USER_OPEN_ORDERS,
  FILLED_ORDERS,
  ACCOUNT_POSITIONS,
  ANALYTICS,
  DRAFTS,
  NEW_MARKET,
  MARKETS_LIST,
  INITIALIZED_3BOX,
} from 'modules/app/store/constants';
import { EMPTY_STATE } from 'modules/create-market/constants';
import { ZERO, NEW_ORDER_GAS_ESTIMATE, THEMES } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { LiquidityOrder } from 'modules/types';
import { formatDai, formatShares } from 'utils/format-number';
import { track, MODAL_CLOSED } from 'services/analytics/helpers';
const {
  SET_THEME,
  SET_ODDS,
  SET_TIME_FORMAT,
  SET_INITIALIZED_3BOX,
  SET_IS_ODDS_MENU_OPEN,
  SET_IS_HELP_MENU_OPEN,
  SET_IS_CONNECTION_TRAY_OPEN,
  SET_IS_ALERTS_MENU_OPEN,
  CLOSE_APP_MENUS,
  SET_IS_MOBILE,
  SET_Ox_ENABLED,
  SET_ETH_TO_DAI_RATE,
  SET_REP_TO_DAI_RATE,
  SET_USDT_TO_DAI_RATE,
  SET_USDC_TO_DAI_RATE,
  UPDATE_DAI_RATES,
  SET_Ox_STATUS,
  SET_RESTORED_ACCOUNT,
  SET_IS_LOGGED,
  SET_IS_CONNECTED,
  SET_IS_RECONNECTION_PAUSED,
  SET_CAN_HOTLOAD,
  SET_ENV,
  UPDATE_GAS_PRICE_INFO,
  SET_MOBILE_MENU_STATE,
  SET_CURRENT_BASE_PATH,
  UPDATE_BLOCKCHAIN,
  SET_CATEGORY_STATS,
  UPDATE_FILTER_SORT_OPTIONS,
  SET_MODAL,
  CLOSE_MODAL,
  UPDATE_UNIVERSE,
  SWITCH_UNIVERSE,
  UPDATE_LOGIN_ACCOUNT,
  CLEAR_LOGIN_ACCOUNT,
  LOAD_FAVORITES,
  TOGGLE_FAVORITE,
  UPDATE_NOTIFICATIONS,
  ADD_ALERT,
  UPDATE_ALERT,
  REMOVE_ALERT,
  CLEAR_ALERTS,
  ADD_PENDING_DATA,
  REMOVE_PENDING_DATA,
  UPDATE_PENDING_DATA_BY_HASH,
  REFRESH_USER_OPEN_ORDERS,
  UPDATE_USER_FILLED_ORDERS,
  UPDATE_ACCOUNT_POSITIONS_DATA,
  ADD_ANALYTIC,
  REMOVE_ANALYTIC,
  ADD_UPDATE_DRAFT,
  REMOVE_DRAFT,
  LOAD_DRAFTS,
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  REMOVE_ALL_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET,
  UPDATE_MARKETS_LIST,
  SET_BETSLIP_MINIMIZED,
} = APP_STATUS_ACTIONS;

export const setHTMLTheme = theme =>
  document.documentElement.setAttribute(THEME, theme);

export const getHTMLTheme = () => document.documentElement.getAttribute(THEME);

const recalculateCumulativeShares = orders => {
  let counterBids = 0;
  let counterAsks = 0;
  const bids = orders
    .filter(a => a.type === 'sell')
    .sort((a, b) => Number(a.price) - Number(b.price))
    .map(order => {
      counterBids = counterBids + Number(order.shares);
      order.cumulativeShares = String(counterBids);
      return order;
    });

  const asks = orders
    .filter(a => a.type === 'buy')
    .sort((a, b) => Number(b.price) - Number(a.price))
    .map(order => {
      counterAsks = counterAsks + Number(order.shares);
      order.cumulativeShares = String(counterAsks);
      return order;
    });
  return [...bids, ...asks];
};

const calculateLiquidity = orderBook => {
  let initialLiquidityDai = ZERO;
  let initialLiquidityGas = ZERO;
  Object.keys(orderBook).map(id => {
    orderBook[id].map((order: LiquidityOrder) => {
      initialLiquidityDai = initialLiquidityDai.plus(order.orderEstimate);
      initialLiquidityGas = createBigNumber(initialLiquidityGas).plus(
        NEW_ORDER_GAS_ESTIMATE
      );
    });
  });
  return { initialLiquidityDai, initialLiquidityGas };
};

export function AppStatusReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_THEME: {
      updatedState[THEME] = action.theme;
      updatedState.betslipMinimized = true;
      break;
    }
    case SET_ODDS: {
      updatedState[ODDS] = action.odds;
      break;
    }
    case SET_TIME_FORMAT: {
      updatedState[TIME_FORMAT] = action.timeFormat;
      break;
    }
    case SET_IS_ODDS_MENU_OPEN: {
      updatedState[IS_ODDS_MENU_OPEN] = action.isOpen;
      updatedState[IS_HELP_MENU_OPEN] = false;
      updatedState[IS_CONNECTION_TRAY_OPEN] = false;
      updatedState[IS_ALERTS_MENU_OPEN] = false;
      break;
    }
    case SET_IS_HELP_MENU_OPEN: {
      updatedState[IS_ODDS_MENU_OPEN] = false;
      updatedState[IS_HELP_MENU_OPEN] = action.isOpen;
      updatedState[IS_CONNECTION_TRAY_OPEN] = false;
      updatedState[IS_ALERTS_MENU_OPEN] = false;
      break;
    }
    case SET_IS_CONNECTION_TRAY_OPEN: {
      updatedState[IS_ODDS_MENU_OPEN] = false;
      updatedState[IS_HELP_MENU_OPEN] = false;
      updatedState[IS_CONNECTION_TRAY_OPEN] = action.isOpen;
      updatedState[IS_ALERTS_MENU_OPEN] = false;
      break;
    }
    case SET_IS_ALERTS_MENU_OPEN: {
      updatedState[IS_ODDS_MENU_OPEN] = false;
      updatedState[IS_HELP_MENU_OPEN] = false;
      updatedState[IS_CONNECTION_TRAY_OPEN] = false;
      updatedState[IS_ALERTS_MENU_OPEN] = action.isOpen;
      break;
    }
    case CLOSE_APP_MENUS: {
      updatedState[IS_ODDS_MENU_OPEN] = false;
      updatedState[IS_HELP_MENU_OPEN] = false;
      updatedState[IS_CONNECTION_TRAY_OPEN] = false;
      updatedState[IS_ALERTS_MENU_OPEN] = false;
      break;
    }
    case SET_IS_MOBILE: {
      updatedState[IS_MOBILE] = action.isMobile;
      break;
    }
    case SET_Ox_ENABLED: {
      updatedState[Ox_ENABLED] = action.isOxEnabled;
      break;
    }
    case SET_ETH_TO_DAI_RATE: {
      updatedState[ETH_TO_DAI_RATE] = action.ethToDaiRate;
      break;
    }
    case SET_REP_TO_DAI_RATE: {
      updatedState[REP_TO_DAI_RATE] = action.repToDaiRate;
      break;
    }
    case SET_USDT_TO_DAI_RATE: {
      updatedState[USDT_TO_DAI_RATE] = action.usdtToDaiRate;
      break;
    }
    case SET_USDC_TO_DAI_RATE: {
      updatedState[USDC_TO_DAI_RATE] = action.usdcToDaiRate;
      break;
    }
    case UPDATE_DAI_RATES: {
      updatedState[ETH_TO_DAI_RATE] =
        action.ethToDaiRate || updatedState[ETH_TO_DAI_RATE];
      updatedState[REP_TO_DAI_RATE] =
        action.repToDaiRate || updatedState[REP_TO_DAI_RATE];
      updatedState[USDT_TO_DAI_RATE] =
        action.usdtToDaiRate || updatedState[USDT_TO_DAI_RATE];
      updatedState[USDC_TO_DAI_RATE] =
        action.usdcToDaiRate || updatedState[USDC_TO_DAI_RATE];
      break;
    }
    case SET_Ox_STATUS: {
      updatedState[Ox_STATUS] = action.OxStatus;
      break;
    }
    case SET_RESTORED_ACCOUNT: {
      updatedState[RESTORED_ACCOUNT] = action.restoredAccount;
      break;
    }
    case SET_IS_LOGGED: {
      updatedState[IS_LOGGED] = action.isLogged;
      break;
    }
    case SET_IS_CONNECTED: {
      updatedState[IS_CONNECTED] = action.isConnected;
      break;
    }
    case SET_IS_RECONNECTION_PAUSED: {
      updatedState[IS_RECONNECTION_PAUSED] = action.isReconnectionPaused;
      break;
    }
    case SET_CAN_HOTLOAD: {
      updatedState[CAN_HOTLOAD] = action.canHotload;
      break;
    }
    case SET_ENV: {
      updatedState[ENV] = action.env;
      break;
    }
    case SET_INITIALIZED_3BOX: {
      updatedState[INITIALIZED_3BOX] = action.initialized3Box;
      break;
    }
    case UPDATE_GAS_PRICE_INFO: {
      updatedState[GAS_PRICE_INFO] = {
        ...updatedState[GAS_PRICE_INFO],
        ...action.gasPriceInfo,
      };
      break;
    }
    case SET_CURRENT_BASE_PATH: {
      updatedState[CURRENT_BASE_PATH] = action.currentBasePath;
      break;
    }
    case SET_MOBILE_MENU_STATE: {
      updatedState[MOBILE_MENU_STATE] = action.mobileMenuState;
      break;
    }
    case UPDATE_BLOCKCHAIN: {
      updatedState[BLOCKCHAIN] = {
        ...updatedState[BLOCKCHAIN],
        ...action.blockchain,
      };
      break;
    }
    case SET_CATEGORY_STATS: {
      updatedState[CATEGORY_STATS] = action.categoryStats;
      break;
    }
    case UPDATE_FILTER_SORT_OPTIONS: {
      updatedState[FILTER_SORT_OPTIONS] = {
        ...updatedState[FILTER_SORT_OPTIONS],
        ...action.filterSortOptions,
      };
      if (updatedState[IS_LOGGED]) {
        updatedState[LOGIN_ACCOUNT].settings = {
          ...updatedState[LOGIN_ACCOUNT].settings,
          ...action.filterSortOptions,
        };
        delete updatedState[LOGIN_ACCOUNT].settings.limit;
        delete updatedState[LOGIN_ACCOUNT].settings.offset;
      }
      break;
    }
    case SET_MODAL: {
      updatedState[MODAL] = action.modal;
      break;
    }
    case CLOSE_MODAL: {
      const { type } = updatedState[MODAL];
      if (type) {
        track(`${type} - ${MODAL_CLOSED}`, {
          type,
        });
      }
      updatedState[MODAL] = {};
      break;
    }
    case UPDATE_UNIVERSE: {
      updatedState[UNIVERSE] = {
        ...updatedState[UNIVERSE],
        ...action.universe,
      };
      break;
    }
    case SWITCH_UNIVERSE: {
      delete updatedState[UNIVERSE].forkingInfo;
      delete updatedState[UNIVERSE].disputeWindow;
      delete updatedState[LOGIN_ACCOUNT].reporting;
      delete updatedState[LOGIN_ACCOUNT].allowance;
      delete updatedState[LOGIN_ACCOUNT].tradingPositionsTotal;
      break;
    }
    case UPDATE_LOGIN_ACCOUNT: {
      updatedState[LOGIN_ACCOUNT] = {
        ...updatedState[LOGIN_ACCOUNT],
        ...action.loginAccount,
      };
      break;
    }
    case CLEAR_LOGIN_ACCOUNT: {
      updatedState[LOGIN_ACCOUNT] = { ...DEFAULT_LOGIN_ACCOUNT_STATE };
      updatedState[FAVORITES] = {};
      updatedState[NOTIFICATIONS] = [];
      updatedState[ALERTS] = [];
      updatedState[PENDING_QUEUE] = {};
      updatedState[USER_OPEN_ORDERS] = {};
      updatedState[ACCOUNT_POSITIONS] = {};
      updatedState[MOBILE_MENU_STATE] = 0;
      updatedState[IS_LOGGED] = false;
      updatedState[RESTORED_ACCOUNT] = false;
      updatedState[IS_CONNECTION_TRAY_OPEN] = false;
      break;
    }
    case LOAD_FAVORITES: {
      updatedState[FAVORITES] = { ...action.favorites };
      break;
    }
    case TOGGLE_FAVORITE: {
      const { marketId } = action;
      const { currentAugurTimestamp: timestamp } = updatedState[BLOCKCHAIN];
      const newFavorites = {
        ...updatedState[FAVORITES],
      };
      if (newFavorites[marketId]) {
        delete newFavorites[marketId];
      } else {
        newFavorites[marketId] = timestamp;
      }
      updatedState[FAVORITES] = newFavorites;
      break;
    }
    case UPDATE_NOTIFICATIONS: {
      const notifications = updatedState[NOTIFICATIONS];
      const ids = action.notifications.map(n => n.id);
      const filtered = notifications.filter(n => !ids.includes(n.id));
      updatedState[NOTIFICATIONS] = [...filtered, ...action.notifications];
      break;
    }
    case ADD_ALERT: {
      const { alert: newAlert } = action;
      if (!newAlert.name || newAlert.name === '') {
        break;
      }
      updatedState[ALERTS] = [...updatedState[ALERTS], newAlert];
      break;
    }
    case UPDATE_ALERT: {
      const { alert: newAlert, id } = action;
      let updatedAlerts = updatedState[ALERTS].map((alert, i) => {
        if (
          alert.uniqueId !== id ||
          newAlert.name.toUpperCase() !== alert.name.toUpperCase()
        ) {
          return alert;
        }

        return Object.assign(alert, newAlert);
      });
      updatedState[ALERTS] = updatedAlerts;
      break;
    }
    case REMOVE_ALERT: {
      updatedState[ALERTS] = updatedState[ALERTS].filter(
        (alert, i) =>
          alert.uniqueId !== action.id ||
          action.name.toUpperCase() !== alert.name.toUpperCase()
      );
      break;
    }
    case CLEAR_ALERTS: {
      updatedState[ALERTS] = updatedState[ALERTS].filter(
        it => it.level !== action.level
      );
      break;
    }

    case SET_BETSLIP_MINIMIZED: {
      updatedState.betslipMinimized = action.betslipMinimized;
      break;
    }
    case ADD_PENDING_DATA: {
      const { pendingId, queueName, status, blockNumber, hash, info } = action;
      updatedState[PENDING_QUEUE] = {
        ...updatedState[PENDING_QUEUE],
        [queueName]: {
          ...updatedState[PENDING_QUEUE][queueName],
          [pendingId]: {
            status,
            data: info,
            hash,
            blockNumber,
          },
        },
      };
      break;
    }
    case UPDATE_PENDING_DATA_BY_HASH: {
      const { oldHash, newHash, queueName, blockNumber, status } = action;
      if (updatedState[PENDING_QUEUE][queueName]) {
        const queue = updatedState[PENDING_QUEUE][queueName];
        Object.keys(queue).forEach(o => {
          const item = queue[o];
          if (item.hash === oldHash || item.hash === newHash) {
            item.hash = newHash;
            item.blockNumber = blockNumber;
            item.status = status;
          }
        });
        updatedState[PENDING_QUEUE][queueName] = {
          ...updatedState[PENDING_QUEUE][queueName],
          ...queue,
        };
      }
      break;
    }
    case REMOVE_PENDING_DATA: {
      const { pendingId, queueName, hash } = action;
      if (updatedState[PENDING_QUEUE][queueName]) {
        if (hash) {
          // remove by hash
          const queue = updatedState[PENDING_QUEUE][queueName];
          updatedState[PENDING_QUEUE][queueName] = Object.keys(queue).reduce(
            (p, o) => (queue[o].hash !== hash ? { ...p, [o]: queue[o] } : p),
            {}
          );
        }

        if (pendingId && updatedState[PENDING_QUEUE][queueName][pendingId]) {
          // remove by pendingId
          delete updatedState[PENDING_QUEUE][queueName][pendingId];
        }

        if (Object.keys(updatedState[PENDING_QUEUE][queueName]).length === 0) {
          // remove queue name if it's empty:
          delete updatedState[PENDING_QUEUE][queueName];
        }
      }
      break;
    }
    case REFRESH_USER_OPEN_ORDERS: {
      updatedState[USER_OPEN_ORDERS] = { ...action.userOpenOrders };
      break;
    }
    case UPDATE_USER_FILLED_ORDERS: {
      updatedState[FILLED_ORDERS] = {
        ...updatedState[FILLED_ORDERS],
        ...action.userFilledOrders,
      };
      break;
    }
    case UPDATE_ACCOUNT_POSITIONS_DATA: {
      const { positionData, marketId } = action;
      if (positionData) {
        if (marketId) {
          updatedState[ACCOUNT_POSITIONS] = {
            ...updatedState[ACCOUNT_POSITIONS],
            [marketId]: {
              ...positionData[marketId],
            },
          };
        }
        updatedState[ACCOUNT_POSITIONS] = {
          ...updatedState[ACCOUNT_POSITIONS],
          ...positionData,
        };
      }
      break;
    }
    case ADD_ANALYTIC: {
      updatedState[ANALYTICS] = {
        ...updatedState[ANALYTICS],
        [action.id]: action.analytic,
      };
      break;
    }
    case REMOVE_ANALYTIC: {
      delete updatedState[ANALYTICS][action.id];
      break;
    }
    case ADD_UPDATE_DRAFT: {
      updatedState[DRAFTS] = {
        ...updatedState[DRAFTS],
        [action.key]: action.draft,
      };
      break;
    }
    case REMOVE_DRAFT: {
      delete updatedState[DRAFTS][action.key];
      break;
    }
    case LOAD_DRAFTS: {
      updatedState[DRAFTS] = action.drafts;
      break;
    }
    case ADD_ORDER_TO_NEW_MARKET: {
      const orderToAdd = action.order;
      const {
        quantity,
        price,
        type,
        orderEstimate,
        outcomeName,
        outcomeId,
      } = orderToAdd;
      const existingOrders =
        updatedState[NEW_MARKET].orderBook[outcomeId] || [];

      let orderAdded = false;

      const updatedOrders: LiquidityOrder[] = existingOrders.map(
        (order: LiquidityOrder) => {
          const orderInfo = Object.assign({}, order);
          if (
            createBigNumber(order.price).eq(createBigNumber(price)) &&
            order.type === type
          ) {
            orderInfo.quantity = createBigNumber(order.quantity).plus(
              createBigNumber(quantity)
            );
            (orderInfo.orderEstimate = createBigNumber(
              order.orderEstimate
            ).plus(createBigNumber(orderEstimate))),
              (orderInfo.shares = orderInfo.quantity);
            orderInfo.mySize = orderInfo.quantity;
            orderInfo.cumulativeShares = orderInfo.quantity;
            orderAdded = true;
            return orderInfo;
          }
          return order;
        }
      );

      if (!orderAdded) {
        updatedOrders.push({
          outcomeName,
          outcomeId,
          type,
          price,
          quantity,
          shares: quantity,
          mySize: quantity,
          cumulativeShares: quantity,
          orderEstimate: createBigNumber(orderEstimate),
          avgPrice: formatDai(price),
          unmatchedShares: formatShares(quantity),
          sharesEscrowed: formatShares(quantity),
          tokensEscrowed: formatDai(createBigNumber(orderEstimate)),
          id: updatedOrders.length,
        } as any);
      }

      const newUpdatedOrders = recalculateCumulativeShares(updatedOrders);
      const orderBook = {
        ...updatedState[NEW_MARKET].orderBook,
        [outcomeId]: newUpdatedOrders,
      };

      const { initialLiquidityDai, initialLiquidityGas } = calculateLiquidity(
        orderBook
      );

      updatedState[NEW_MARKET] = {
        ...updatedState[NEW_MARKET],
        initialLiquidityDai,
        initialLiquidityGas,
        orderBook,
      };
      break;
    }
    case REMOVE_ORDER_FROM_NEW_MARKET: {
      const { outcome, orderId } = action.order;
      const updatedOrders = updatedState[NEW_MARKET].orderBook[outcome].filter(
        order => order.id !== orderId
      );
      const updatedOutcomeUpdatedShares = recalculateCumulativeShares(
        updatedOrders
      );
      const orderBook = {
        ...updatedState[NEW_MARKET].orderBook,
        [outcome]: updatedOutcomeUpdatedShares,
      };

      const { initialLiquidityDai, initialLiquidityGas } = calculateLiquidity(
        orderBook
      );

      updatedState[NEW_MARKET] = {
        ...updatedState[NEW_MARKET],
        initialLiquidityDai,
        initialLiquidityGas,
        orderBook,
      };
      break;
    }
    case UPDATE_NEW_MARKET: {
      updatedState[NEW_MARKET] = {
        ...updatedState[NEW_MARKET],
        ...action.newMarketData,
      };
      break;
    }
    case REMOVE_ALL_ORDER_FROM_NEW_MARKET: {
      updatedState[NEW_MARKET] = {
        ...updatedState[NEW_MARKET],
        initialLiquidityDai: ZERO,
        initialLiquidityGas: ZERO,
        orderBook: {},
      };
      break;
    }
    case CLEAR_NEW_MARKET: {
      updatedState[NEW_MARKET] = { ...EMPTY_STATE };
      break;
    }
    case UPDATE_MARKETS_LIST: {
      updatedState[MARKETS_LIST] = {
        ...updatedState[MARKETS_LIST],
        ...action.data,
      };
      break;
    }
    default:
      console.error(`Error: ${action.type} not caught by App Status reducer.`);
  }
  // console.log('appStatus update:', action.type, updatedState, action);
  window.appStatus = updatedState;
  window.stores.appStatus = updatedState;
  return updatedState;
}

export const useAppStatus = (defaultState = DEFAULT_APP_STATUS) => {
  // if the URL was passed with a t value, update defaultState.
  const HTMLtheme = document.documentElement.getAttribute(THEME);
  if (HTMLtheme && THEMES[HTMLtheme]) {
    defaultState.theme = document.documentElement.getAttribute(THEME);
  }
  const [state, dispatch] = useReducer(AppStatusReducer, defaultState);
  setHTMLTheme(state.theme);
  window.appStatus = state;
  window.stores.appStatus = state;
  return {
    ...state,
    actions: {
      setTheme: theme => {
        setHTMLTheme(theme);
        dispatch({ type: SET_THEME, theme });
      },
      setOdds: odds => dispatch({ type: SET_ODDS, odds }),
      setTimeFormat: timeFormat =>
        dispatch({ type: SET_TIME_FORMAT, timeFormat }),
      setIsOddsMenuOpen: isOpen =>
        dispatch({ type: SET_IS_ODDS_MENU_OPEN, isOpen }),
      setIsHelpMenuOpen: isOpen =>
        dispatch({ type: SET_IS_HELP_MENU_OPEN, isOpen }),
      setIsConnectionTrayOpen: isOpen =>
        dispatch({ type: SET_IS_CONNECTION_TRAY_OPEN, isOpen }),
      setIsAlertsMenuOpen: isOpen =>
        dispatch({ type: SET_IS_ALERTS_MENU_OPEN, isOpen }),
      closeAppMenus: () => dispatch({ type: CLOSE_APP_MENUS }),
      setIsMobile: isMobile => dispatch({ type: SET_IS_MOBILE, isMobile }),
      setOxEnabled: isOxEnabled =>
        dispatch({ type: SET_Ox_ENABLED, isOxEnabled }),
      updateDaiRates: rates => dispatch({ type: UPDATE_DAI_RATES, ...rates }),
      setEthToDaiRate: ethToDaiRate =>
        dispatch({ type: SET_ETH_TO_DAI_RATE, ethToDaiRate }),
      setRepToDaiRate: repToDaiRate =>
        dispatch({ type: SET_REP_TO_DAI_RATE, repToDaiRate }),
      setUsdtToDaiRate: usdtToDaiRate =>
        dispatch({ type: SET_USDT_TO_DAI_RATE, usdtToDaiRate }),
      setUsdcToDaiRate: usdcToDaiRate =>
        dispatch({ type: SET_USDC_TO_DAI_RATE, usdcToDaiRate }),
      setOxStatus: OxStatus => dispatch({ type: SET_Ox_STATUS, OxStatus }),
      setRestoredAccount: restoredAccount =>
        dispatch({ type: SET_RESTORED_ACCOUNT, restoredAccount }),
      setIsLogged: isLogged => dispatch({ type: SET_IS_LOGGED, isLogged }),
      setIsConnected: isConnected =>
        dispatch({ type: SET_IS_CONNECTED, isConnected }),
      setIsReconnectionPaused: isReconnectionPaused =>
        dispatch({ type: SET_IS_RECONNECTION_PAUSED, isReconnectionPaused }),
      setCanHotload: canHotload =>
        dispatch({ type: SET_CAN_HOTLOAD, canHotload }),
      setEnv: env => dispatch({ type: SET_ENV, env }),
      updateGasPriceInfo: gasPriceInfo =>
        dispatch({ type: UPDATE_GAS_PRICE_INFO, gasPriceInfo }),
      setMobileMenuState: mobileMenuState =>
        dispatch({ type: SET_MOBILE_MENU_STATE, mobileMenuState }),
      setCurrentBasePath: currentBasePath =>
        dispatch({ type: SET_CURRENT_BASE_PATH, currentBasePath }),
      updateBlockchain: blockchain =>
        dispatch({ type: UPDATE_BLOCKCHAIN, blockchain }),
      setCategoryStats: categoryStats =>
        dispatch({ type: SET_CATEGORY_STATS, categoryStats }),
      updateFilterSortOptions: filterSortOptions =>
        dispatch({ type: UPDATE_FILTER_SORT_OPTIONS, filterSortOptions }),
      setModal: modal => dispatch({ type: SET_MODAL, modal }),
      closeModal: () => dispatch({ type: CLOSE_MODAL }),
      updateUniverse: universe => dispatch({ type: UPDATE_UNIVERSE, universe }),
      switchUniverse: () => dispatch({ type: SWITCH_UNIVERSE }),
      updateLoginAccount: loginAccount =>
        dispatch({ type: UPDATE_LOGIN_ACCOUNT, loginAccount }),
      clearLoginAccount: () => dispatch({ type: CLEAR_LOGIN_ACCOUNT }),
      loadFavorites: favorites => dispatch({ type: LOAD_FAVORITES, favorites }),
      toggleFavorite: marketId => dispatch({ type: TOGGLE_FAVORITE, marketId }),
      updateNotifications: notifications =>
        dispatch({ type: UPDATE_NOTIFICATIONS, notifications }),
      addAlert: alert => dispatch({ type: ADD_ALERT, alert }),
      updateAlert: (id, alert) => dispatch({ type: UPDATE_ALERT, alert, id }),
      removeAlert: (id, name) => dispatch({ type: REMOVE_ALERT, id, name }),
      clearAlerts: level => dispatch({ type: CLEAR_ALERTS, level }),
      setInitialized3Box: initialized3Box =>
        dispatch({ type: SET_INITIALIZED_3BOX, initialized3Box }),
      addPendingData: (pendingId, queueName, status, blockNumber, hash, info) =>
        dispatch({
          type: ADD_PENDING_DATA,
          pendingId,
          queueName,
          status,
          blockNumber,
          hash,
          info,
        }),
      addPendingDataByHash: ({
        oldHash,
        newHash,
        queueName,
        blockNumber,
        status,
      }) =>
        dispatch({
          type: UPDATE_PENDING_DATA_BY_HASH,
          oldHash,
          newHash,
          status,
          blockNumber,
          queueName,
        }),
      setBetslipMinimized: betslipMinimized =>
        dispatch({ type: SET_BETSLIP_MINIMIZED, betslipMinimized }),
      removePendingData: ({ pendingId, queueName, hash }) =>
        dispatch({ type: REMOVE_PENDING_DATA, pendingId, queueName, hash }),
      refreshUserOpenOrders: userOpenOrders =>
        dispatch({ type: REFRESH_USER_OPEN_ORDERS, userOpenOrders }),
      updateUserFilledOrders: (account, userFilledOrders) =>
        dispatch({
          type: UPDATE_USER_FILLED_ORDERS,
          account,
          userFilledOrders,
        }),
      updateAccountPositions: ({ positionData, marketId }) =>
        dispatch({
          type: UPDATE_ACCOUNT_POSITIONS_DATA,
          positionData,
          marketId,
        }),
      addAnalytic: (id, analytic) =>
        dispatch({ type: ADD_ANALYTIC, id, analytic }),
      removeAnalytic: id => dispatch({ type: REMOVE_ANALYTIC, id }),
      addUpdateDraft: (key, draft) =>
        dispatch({ type: ADD_UPDATE_DRAFT, key, draft }),
      removeDraft: key => dispatch({ type: REMOVE_DRAFT, key }),
      loadDrafts: drafts => dispatch({ type: LOAD_DRAFTS, drafts }),
      addOrderToNewMarket: order =>
        dispatch({ type: ADD_ORDER_TO_NEW_MARKET, order }),
      removeOrderFromNewMarket: order =>
        dispatch({ type: REMOVE_ORDER_FROM_NEW_MARKET, order }),
      updateNewMarket: newMarketData =>
        dispatch({ type: UPDATE_NEW_MARKET, newMarketData }),
      removeAllOrdersFromNewMarket: () =>
        dispatch({ type: REMOVE_ALL_ORDER_FROM_NEW_MARKET }),
      clearNewMarket: () => dispatch({ type: CLEAR_NEW_MARKET }),
      updateMarketsList: data => dispatch({ type: UPDATE_MARKETS_LIST, data }),
    },
  };
};
