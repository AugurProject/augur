import { compose } from "redux";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import App from "modules/app/components/app/app";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import { selectInfoAlertsAndSeenCount } from "modules/alerts/selectors/alerts";
import { selectCoreStats } from "modules/account/selectors/core-stats";
import {
  IS_ANIMATING,
  IS_MOBILE,
  IS_MOBILE_SMALL,
  updateAppStatus
} from "modules/app/actions/update-app-status";
import { initAugur } from "modules/app/actions/init-augur";
import { updateModal } from "modules/modal/actions/update-modal";
import {
  selectBlockchainState,
  selectCategoriesState,
  selectConnectionState,
  selectEnvState,
  selectIsLogged,
  selectIsMobile,
  selectIsMobileSmall,
  selectIsAnimating,
  selectLoginAccountState,
  selectModal,
  selectUniverseState,
  selectUrlState,
  selectSidebarStatus
} from "src/select-state";
import { RewriteUrlParams } from "src/modules/app/hocs/rewrite-url-params";
import { windowRef } from "src/utils/window-ref";
import isGlobalWeb3 from "modules/auth/helpers/is-global-web3";
import { logout } from "modules/auth/actions/logout";
import {
  updateCurrentBasePath,
  updateCurrentInnerNavType,
  updateMobileMenuState,
  updateIsAlertVisible,
  updateSidebarStatus
} from "modules/app/actions/update-sidebar-status";

const mapStateToProps = state => ({
  blockchain: selectBlockchainState(state),
  categories: selectCategoriesState(state),
  connection: selectConnectionState(state),
  coreStats: selectCoreStats(state),
  env: selectEnvState(state),
  isLogged: selectIsLogged(state),
  isMobile: selectIsMobile(state),
  isMobileSmall: selectIsMobileSmall(state),
  isAnimating: selectIsAnimating(state),
  loginAccount: selectLoginAccountState(state),
  modal: selectModal(state),
  alerts: selectInfoAlertsAndSeenCount(state),
  universe: selectUniverseState(state),
  url: selectUrlState(state),
  useWeb3Transport: isGlobalWeb3(),
  sidebarStatus: selectSidebarStatus(state)
});

const mapDispatchToProps = dispatch => ({
  initAugur: (history, overrides, cb) =>
    dispatch(initAugur(history, overrides, cb)),
  updateIsMobile: isMobile => dispatch(updateAppStatus(IS_MOBILE, isMobile)),
  updateIsMobileSmall: isMobileSmall =>
    dispatch(updateAppStatus(IS_MOBILE_SMALL, isMobileSmall)),
  updateIsAnimating: isAnimating =>
    dispatch(updateAppStatus(IS_ANIMATING, isAnimating)),
  updateModal: modal => dispatch(updateModal(modal)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
  logout: () => dispatch(logout()),
  updateCurrentBasePath: data => dispatch(updateCurrentBasePath(data)),
  updateCurrentInnerNavType: data => dispatch(updateCurrentInnerNavType(data)),
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
  updateIsAlertVisible: data => dispatch(updateIsAlertVisible(data)),
  updateSidebarStatus: data => dispatch(updateSidebarStatus(data))
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
