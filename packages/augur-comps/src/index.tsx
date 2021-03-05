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
import * as _MarketCard from './components/market-card/market-card';
import _Logo from './components/common/logo';
import * as _Labels from './components/common/labels';
import * as _Buttons from './components/common/buttons';
import { ConnectAccountProvider as _ConnectAccountProvider } from './components/ConnectAccount/connect-account-provider';
import { ConnectAccount as _ConnectAccount } from './components/ConnectAccount/index';
import * as _ConnectHooks from './components/ConnectAccount/hooks';
import * as _ConnectConstants from './components/ConnectAccount/constants';
import * as _ConnectConnectors from './components/ConnectAccount/connectors';
import * as _ConnectUtils from './components/ConnectAccount/utils';
import { Loader as _Loader } from './components/ConnectAccount/components/Loader/index';
import { AccountDetails as _AccountDetails } from './components/ConnectAccount/components/AccountDetails/index';
import _parsePath from './utils/routes/parse-path';
import _parseQuery from './utils/routes/parse-query';
import _makePath from './utils/routes/make-path';
import _makeQuery from './utils/routes/make-query';
import _parseStringToArray from './utils/routes/parse-string-to-array';
import { CATEGORIES_ICON_MAP as _CATEGORIES_ICON_MAP } from './components/common/category-icons-map';
import _GraphDataStore, {
  useGraphDataStore,
  GraphDataStore,
} from './stores/graph-data';
import _UserDataStore, { useUserStore, UserStore } from './stores/user';
import {
  useGraphHeartbeat,
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
} from './stores/utils';
import * as _ApprovalHooks from './stores/use-approval-callback';
export const Stores = {
  GraphData: _GraphDataStore,
  User: _UserDataStore,
  ConnectAccount: {
    ConnectAccountProvider: _ConnectAccountProvider,
  },
  Hooks: {
    useGraphHeartbeat,
    useCanExitCashPosition,
    useCanEnterCashPosition,
    useUserBalances,
    useFinalizeUserTransactions,
    useScrollToTopOnMount,
    ..._ApprovalHooks,
  },
  Utils: {
    getSavedUserInfo,
    getRelatedMarkets,
    getCurrentAmms,
    middleware,
    dispatchMiddleware,
    keyedObjToArray,
    keyedObjToKeyArray,
    arrayToKeyedObject,
    arrayToKeyedObjectByProp,
  }
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
export const Constants = _Constants;
export const Utils = {
  addCommasToNumber,
  isMobileBrowser,
  isMobileBrowserTall,
  createBigNumber,
  DateUtils,
  Formatter,
  getPrecision,
  logError,
  windowRef,
};
export const Routes = {
  parsePath: _parsePath,
  parseQuery: _parseQuery,
  makePath: _makePath,
  makeQuery: _makeQuery,
  parseStringToArray: _parseStringToArray,
};
export const Types = _Types;
export const MarketCardComps = _MarketCard;
export const Logo = _Logo;
export const ButtonComps = _Buttons;
export const LabelComps = _Labels;
export const Icons = {
  ..._Icons,
  CATEGORIES_ICON_MAP: _CATEGORIES_ICON_MAP,
};
export const ApprovalHooks = _ApprovalHooks;

// export extremely commonly used functions as top level non-default exports:
export {
  useGraphHeartbeat,
  useUserStore,
  UserStore,
  useCanExitCashPosition,
  useCanEnterCashPosition,
  useUserBalances,
  useFinalizeUserTransactions,
  useScrollToTopOnMount,
  useGraphDataStore,
  GraphDataStore,
  createBigNumber,
  Formatter,
  DateUtils,
  windowRef,
};
export const Components = {
  ButtonComps,
  ConnectAccount,
  LabelComps,
  Logo,
  MarketCardComps,
};
// create default object
const AugurComps = {
  Components,
  Constants,
  Icons,
  Routes,
  Stores,
  Types,
  Utils,
};

export default AugurComps;
