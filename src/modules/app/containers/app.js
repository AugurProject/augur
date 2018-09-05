import { compose } from "redux";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import App from "modules/app/components/app/app";
import { sendFinalizeMarket } from "modules/market/actions/finalize-market";
import { selectInfoNotificationsAndSeenCount } from "modules/notifications/selectors/notifications";
import { selectMarketsHeader } from "modules/markets/selectors/markets-header";
import { selectCoreStats } from "modules/account/selectors/core-stats";
import { selectCategories } from "modules/categories/selectors/categories";
import portfolio from "modules/positions/selectors/portfolio";
import {
  updateIsMobile,
  updateIsMobileSmall
} from "modules/app/actions/update-is-mobile";
import getAllMarkets from "modules/markets/selectors/markets-all";
import { initAugur } from "modules/app/actions/init-augur";
import { updateModal } from "modules/modal/actions/update-modal";
import { isLoading } from "modules/app/selectors/is-loading";
import { updateIsAnimating } from "modules/app/actions/update-is-animating";
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
  markets: getAllMarkets(),
  marketsHeader: selectMarketsHeader(state),
  modal: selectModal(state),
  notifications: selectInfoNotificationsAndSeenCount(state),
  portfolio: portfolio(),
  universe: selectUniverseState(state),
  url: selectUrlState(state)
});

const mapDispatchToProps = dispatch => ({
  initAugur: (history, overrides, cb) =>
    dispatch(initAugur(history, overrides, cb)),
  updateIsMobile: isMobile => dispatch(updateIsMobile(isMobile)),
  updateIsMobileSmall: isMobileSmall =>
    dispatch(updateIsMobileSmall(isMobileSmall)),
  updateIsAnimating: isAnimating => dispatch(updateIsAnimating(isAnimating)),
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
