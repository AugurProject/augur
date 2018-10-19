import { compose } from "redux";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import App from "modules/app/components/app/app";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import { selectInfoNotificationsAndSeenCount } from "modules/notifications/selectors/notifications";
import { selectCoreStats } from "modules/account/selectors/core-stats";
import { selectCategories } from "modules/categories/selectors/categories";
import portfolioTotals from "modules/positions/selectors/portfolio-totals";
import {
  IS_ANIMATING,
  IS_MOBILE,
  IS_MOBILE_SMALL,
  updateAppStatus
} from "modules/app/actions/update-app-status";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { initAugur } from "modules/app/actions/init-augur";
import { updateModal } from "modules/modal/actions/update-modal";
import { isLoading } from "modules/markets/selectors/is-loading";
import {
  selectBlockchainState,
  selectConnectionState,
  selectEnvState,
  selectIsLogged,
  selectIsMobile,
  selectIsMobileSmall,
  selectIsAnimating,
  selectLoginAccountState,
  selectModal,
  selectUniverseState,
  selectUrlState
} from "src/select-state";
import { RewriteUrlParams } from "src/modules/app/hocs/rewrite-url-params";
import { windowRef } from "src/utils/window-ref";
import isGlobalWeb3 from "modules/auth/helpers/is-global-web3";

const mapStateToProps = state => ({
  blockchain: selectBlockchainState(state),
  categories: selectCategories(state),
  connection: selectConnectionState(state),
  coreStats: selectCoreStats(state),
  isLoading: isLoading(state.marketLoading),
  env: selectEnvState(state),
  isLogged: selectIsLogged(state),
  isMobile: selectIsMobile(state),
  isMobileSmall: selectIsMobileSmall(state),
  isAnimating: selectIsAnimating(state),
  loginAccount: selectLoginAccountState(state),
  markets: selectMarkets(state),
  modal: selectModal(state),
  notifications: selectInfoNotificationsAndSeenCount(state),
  portfolio: portfolioTotals(state),
  universe: selectUniverseState(state),
  url: selectUrlState(state),
  useWeb3Transport: isGlobalWeb3()
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
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId))
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
