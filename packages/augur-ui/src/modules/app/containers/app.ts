import { compose } from "redux";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import App from "modules/app/components/app";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import { selectInfoAlertsAndSeenCount } from "modules/alerts/selectors/alerts";
import { selectNotifications } from "modules/notifications/selectors/notification-state";
import {
  IS_MOBILE,
  IS_MOBILE_SMALL,
  updateAppStatus,
  WALLET_STATUS,
} from "modules/app/actions/update-app-status";
import { initAugur } from "modules/app/actions/init-augur";
import { updateModal } from "modules/modal/actions/update-modal";
import { RewriteUrlParams } from "modules/app/hocs/rewrite-url-params";
import { windowRef } from "utils/window-ref";
import isGlobalWeb3 from "modules/auth/helpers/is-global-web3";
import { logout } from "modules/auth/actions/logout";
import {
  updateCurrentBasePath,
  updateCurrentInnerNavType,
  updateMobileMenuState,
  updateIsAlertVisible,
  updateSidebarStatus
} from "modules/app/actions/update-sidebar-status";
import { updateSelectedCategories } from "modules/markets-list/actions/update-markets-list";
import { MODAL_GLOBAL_CHAT, MODAL_MIGRATE_REP, WALLET_STATUS_VALUES, TRANSACTIONS, MIGRATE_FROM_LEG_REP_TOKEN } from 'modules/common/constants';
import { saveAffiliateAddress } from "modules/account/actions/login-account";
import { createFundedGsnWallet } from "modules/auth/actions/update-sdk";
import { AppState } from "appStore";

const mapStateToProps = (state: AppState) => {
  const { appStatus, loginAccount, pendingQueue } = state;
  const { balances } = loginAccount;
  const walletStatus = appStatus[WALLET_STATUS];
  const { alerts } = selectInfoAlertsAndSeenCount(state);
  const notifications = selectNotifications(state);
  const walletBalances = loginAccount.balances;
  const pending =
    pendingQueue[TRANSACTIONS] &&
    pendingQueue[TRANSACTIONS][MIGRATE_FROM_LEG_REP_TOKEN];
  const showCreateAccountButton =
    walletStatus === WALLET_STATUS_VALUES.WAITING_FOR_FUNDING ||
    walletStatus === WALLET_STATUS_VALUES.FUNDED_NEED_CREATE;
  const showMigrateRepButton =
    !!balances.legacyRep || !!balances.legacyRepNonSafe || !!pending;

  return {
    notifications,
    blockchain: state.blockchain,
    connection: state.connection,
    env: state.env,
    isLogged: state.authStatus.isLogged,
    restoredAccount: state.authStatus.restoredAccount,
    isMobile: state.appStatus.isMobile,
    oddsType: state.appStatus.odds,
    isMobileSmall: state.appStatus.isMobileSmall,
    loginAccount,
    modal: state.modal,
    toasts: alerts.filter(alert => alert.toast && !alert.seen),
    universe: state.universe,
    useWeb3Transport: isGlobalWeb3(),
    sidebarStatus: state.sidebarStatus,
    walletBalances,
    showCreateAccountButton,
    showMigrateRepButton,
  }
};

const mapDispatchToProps = dispatch => ({
  initAugur: (history, overrides, cb) =>
    dispatch(initAugur(history, overrides, cb)),
  updateIsMobile: isMobile => dispatch(updateAppStatus(IS_MOBILE, isMobile)),
  updateIsMobileSmall: isMobileSmall => dispatch(updateAppStatus(IS_MOBILE_SMALL, isMobileSmall)),
  updateModal: modal => dispatch(updateModal(modal)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
  logout: () => dispatch(logout()),
  updateCurrentBasePath: data => dispatch(updateCurrentBasePath(data)),
  updateCurrentInnerNavType: data => dispatch(updateCurrentInnerNavType(data)),
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
  updateIsAlertVisible: data => dispatch(updateIsAlertVisible(data)),
  updateSidebarStatus: data => dispatch(updateSidebarStatus(data)),
  updateSelectedCategories: (category) => dispatch(updateSelectedCategories(category)),
  showGlobalChat: () => dispatch(updateModal({type: MODAL_GLOBAL_CHAT})),
  migrateV1Rep: () => dispatch(updateModal({ type: MODAL_MIGRATE_REP })),
  saveAffilateAddress: address => dispatch(saveAffiliateAddress(address)),
  createFundedGsnWallet: () => dispatch(createFundedGsnWallet()),
});

const AppContainer = compose(
  withRouter,
  RewriteUrlParams(windowRef),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);

export default AppContainer;
