import { compose } from "redux";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import App from "modules/app/components/app";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import { selectInfoAlertsAndSeenCount } from "modules/alerts/selectors/alerts";
import {
  IS_MOBILE,
  IS_MOBILE_SMALL,
  updateAppStatus,
  IS_HELP_MENU_OPEN
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
import { updateAuthStatus, IS_CONNECTION_TRAY_OPEN } from "modules/auth/actions/auth-status";
import { MODAL_GLOBAL_CHAT, MODAL_MIGRATE_REP } from 'modules/common/constants';

const mapStateToProps = state => {
  const { alerts } = selectInfoAlertsAndSeenCount(state);

  const v1RepBalance = state.loginAccount.balances;
  const showMigrateRepButton = v1RepBalance.legacyAttoRep > 0;

  return {
    blockchain: state.blockchain,
    categories: state.categories,
    connection: state.connection,
    env: state.env,
    isLogged: state.authStatus.isLogged,
    restoredAccount: state.authStatus.restoredAccount,
    isMobile: state.appStatus.isMobile,
    isMobileSmall: state.appStatus.isMobileSmall,
    isHelpMenuOpen: state.appStatus.isHelpMenuOpen,
    loginAccount: state.loginAccount,
    modal: state.modal,
    toasts: alerts.filter(alert => alert.toast && !alert.seen),
    universe: state.universe,
    url: state.url,
    useWeb3Transport: isGlobalWeb3(),
    sidebarStatus: state.sidebarStatus,
    isConnectionTrayOpen: state.authStatus.isConnectionTrayOpen,
    showMigrateRepButton,
  }
};

const mapDispatchToProps = dispatch => ({
  initAugur: (history, overrides, cb) =>
    dispatch(initAugur(history, overrides, cb)),
  updateIsMobile: isMobile => dispatch(updateAppStatus(IS_MOBILE, isMobile)),
  updateHelpMenuState: isHelpMenuOpen => dispatch(updateAppStatus(IS_HELP_MENU_OPEN, isHelpMenuOpen)),
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
  updateConnectionTray: value =>
  dispatch(updateAuthStatus(IS_CONNECTION_TRAY_OPEN, value)),
  showGlobalChat: () => dispatch(updateModal({type: MODAL_GLOBAL_CHAT})),
  updateHelpMenuState: (isHelpMenuOpen) => dispatch(updateAppStatus(IS_HELP_MENU_OPEN, isHelpMenuOpen)),
  migrateV1Rep: () => dispatch(updateModal({ type: MODAL_MIGRATE_REP })),
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
