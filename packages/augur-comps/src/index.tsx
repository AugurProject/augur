import './assets/styles/shared.less';
import * as _ContractCalls from './utils/contract-calls';
import addCommasToNumber from './utils/add-commas-to-number';
import { isMobileBrowser, isMobileBrowserTall } from './utils/common-functions';
import * as _Constants from './utils/constants';
import { createBigNumber } from './utils/create-big-number';
import * as DateUtils from './utils/date-utils';
import * as Formatter from './utils/format-number';
import getPrecision from './utils/get-number-precision';
import logError from './utils/log-error';
import * as _Types from './utils/types';
import { windowRef } from './utils/window-ref';
import * as _Icons from './components/common/icons';
import * as _Inputs from './components/common/inputs';
import * as _MarketCard from './components/market-card/market-card';
import _Logo, { LinkLogo } from './components/common/logo';
import * as _Labels from './components/common/labels';
import * as _Buttons from './components/common/buttons';
import * as _Selections from './components/common/selection';
import * as _Pagination from './components/common/pagination';
import { ConnectAccountProvider as _ConnectAccountProvider } from './components/ConnectAccount/connect-account-provider';
import { ConnectAccount as _ConnectAccount } from './components/ConnectAccount/index';
import * as _ConnectHooks from './components/ConnectAccount/hooks';
import * as _ConnectConstants from './components/ConnectAccount/constants';
import * as _ConnectConnectors from './components/ConnectAccount/connectors';
import * as _ConnectUtils from './components/ConnectAccount/utils';
import { Loader as _Loader } from './components/ConnectAccount/components/Loader/index';
import { AccountDetails as _AccountDetails } from './components/ConnectAccount/components/AccountDetails/index';
import _SEO from './components/common/seo';
import * as Links from './utils/links/links';
import _parsePath from './utils/links/parse-path';
import _parseQuery from './utils/links/parse-query';
import _makePath from './utils/links/make-path';
import _makeQuery from './utils/links/make-query';
import _parseStringToArray from './utils/links/parse-string-to-array';
import { CATEGORIES_ICON_MAP as _CATEGORIES_ICON_MAP } from './components/common/category-icons-map';
import _GraphDataStore, {
  useGraphDataStore,
  GraphDataStore,
} from './stores/graph-data';
import _UserDataStore, { useUserStore, UserStore } from './stores/user';
import _AppStatusStore, { useAppStatusStore, AppStatusStore } from './stores/app-status';
import * as _StoreConstants from './stores/constants';
import * as _ProcessData from './stores/process-data';
import { useLocalStorage } from './stores/local-storage';
import {
  useCanExitCashPosition,
  useCanEnterCashPosition,
  useUserBalances,
  useFinalizeUserTransactions,
  useScrollToTopOnMount,
  getSavedUserInfo,
  getRelatedMarkets,
  getCurrentAmms,
  middleware,
  dispatchMiddleware,
  keyedObjToArray,
  keyedObjToKeyArray,
  arrayToKeyedObject,
  arrayToKeyedObjectByProp,
  useApprovalStatus,
} from './stores/utils';
import * as _ApprovalHooks from './stores/use-approval-callback';
import * as _GraphClient from './apollo/client';
import ModalConnectWallet from './components/modal/modal-connect-wallet';
import { ToggleSwitch, BuySellToggleSwitch } from './components/common/toggle-switch';

export const ContractCalls = _ContractCalls;
export const GraphClient = _GraphClient;
export const Stores = {
  AppStatus: _AppStatusStore,
  GraphData: _GraphDataStore,
  User: _UserDataStore,
  ConnectAccount: {
    ConnectAccountProvider: _ConnectAccountProvider,
  },
  Hooks: {
    useAppStatusStore,
    useUserStore,
    useGraphDataStore,
    useCanExitCashPosition,
    useCanEnterCashPosition,
    useUserBalances,
    useFinalizeUserTransactions,
    useScrollToTopOnMount,
    useLocalStorage,
    useApprovalStatus,
    ..._ApprovalHooks,
  },
  Utils: {
    ..._ProcessData,
    getSavedUserInfo,
    getRelatedMarkets,
    getCurrentAmms,
    middleware,
    dispatchMiddleware,
    keyedObjToArray,
    keyedObjToKeyArray,
    arrayToKeyedObject,
    arrayToKeyedObjectByProp,
  },
  Constants: _StoreConstants
};

export const ConnectAccount = {
  ConnectAccount: _ConnectAccount,
  ConnectAccountProvider: _ConnectAccountProvider,
  hooks: _ConnectHooks,
  constants: _ConnectConstants,
  connectors: _ConnectConnectors,
  Loader: _Loader,
  AccountDetails: _AccountDetails,
  utils: _ConnectUtils,
};
export const PARA_CONFIG = _StoreConstants.PARA_CONFIG;
export const Constants = {..._Constants, PARA_CONFIG };
const PathUtils = {
  parsePath: _parsePath,
  parseQuery: _parseQuery,
  makePath: _makePath,
  makeQuery: _makeQuery,
  parseStringToArray: _parseStringToArray,
};
export const Utils = {
  addCommasToNumber,
  isMobileBrowser,
  isMobileBrowserTall,
  createBigNumber,
  DateUtils,
  Formatter,
  getPrecision,
  logError,
  PathUtils,
  windowRef,
};
export const PaginationComps = _Pagination;
export const Types = _Types;
export const MarketCardComps = _MarketCard;
export const Logo = _Logo;
export const ButtonComps = _Buttons;
export const LabelComps = _Labels;
export const InputComps = _Inputs;
export const SelectionComps = _Selections;
export const Icons = {
  ..._Icons,
  CATEGORIES_ICON_MAP: _CATEGORIES_ICON_MAP,
};
export const ApprovalHooks = _ApprovalHooks;
export const ProcessData = _ProcessData;
export const SEO = _SEO;
// export extremely commonly used functions as top level non-default exports:
export {
  useAppStatusStore,
  AppStatusStore,
  useLocalStorage,
  useUserStore,
  UserStore,
  useCanExitCashPosition,
  useCanEnterCashPosition,
  useUserBalances,
  useFinalizeUserTransactions,
  useScrollToTopOnMount,
  useGraphDataStore,
  useApprovalStatus,
  GraphDataStore,
  createBigNumber,
  Formatter,
  DateUtils,
  PathUtils,
  Links,
  windowRef,
  LinkLogo,
};
export const Components = {
  ButtonComps,
  ConnectAccount,
  InputComps,
  LabelComps,
  Links,
  Logo,
  LinkLogo,
  Icons,
  MarketCardComps,
  PaginationComps,
  SEO,
  SelectionComps,
  ToggleSwitch,
  BuySellToggleSwitch
};
export const Modals = {
  ModalConnectWallet
};
// create default object
const AugurComps = {
  Components,
  Constants,
  ContractCalls,
  GraphClient,
  Icons,
  Stores,
  Types,
  Utils,
  Modals
};

export default AugurComps;
