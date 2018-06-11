import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import App from 'modules/app/components/app/app'
import { sendFinalizeMarket } from 'modules/market/actions/finalize-market'
import { selectNotificationsAndSeenCount } from 'modules/notifications/selectors/notifications'
import { selectMarketsHeader } from 'modules/markets/selectors/markets-header'
import { selectCoreStats } from 'modules/account/selectors/core-stats'
import { selectCategories } from 'modules/categories/selectors/categories'
import portfolio from 'modules/portfolio/selectors/portfolio'
import { updateIsMobile, updateIsMobileSmall } from 'modules/app/actions/update-is-mobile'
import getAllMarkets from 'modules/markets/selectors/markets-all'
import { initAugur } from 'modules/app/actions/init-augur'
import { updateModal } from 'modules/modal/actions/update-modal'
import { isLoading } from 'modules/app/selectors/is-loading'
import { updateIsAnimating } from 'modules/app/actions/update-is-animating'
import {
  selectBlockchainState,
  selectConnectionState,
  selectIsLogged,
  selectIsMobile,
  selectIsMobileSmall,
  selectIsAnimating,
  selectLoginAccountState,
  selectModal,
  selectUniverseState,
  selectUrlState,
} from 'src/select-state'

const mapStateToProps = state => ({
  blockchain: selectBlockchainState(state),
  categories: selectCategories(state),
  connection: selectConnectionState(state),
  coreStats: selectCoreStats(state),
  isLoading: isLoading(state.marketLoading),
  isLogged: selectIsLogged(state),
  isMobile: selectIsMobile(state),
  isMobileSmall: selectIsMobileSmall(state),
  isAnimating: selectIsAnimating(state),
  loginAccount: selectLoginAccountState(state),
  markets: getAllMarkets(),
  marketsHeader: selectMarketsHeader(state),
  modal: selectModal(state),
  notifications: selectNotificationsAndSeenCount(state),
  portfolio: portfolio(),
  universe: selectUniverseState(state),
  url: selectUrlState(state),
})

const mapDispatchToProps = dispatch => ({
  initAugur: (history, cb) => dispatch(initAugur(history, cb)),
  updateIsMobile: isMobile => dispatch(updateIsMobile(isMobile)),
  updateIsMobileSmall: isMobileSmall => dispatch(updateIsMobileSmall(isMobileSmall)),
  updateIsAnimating: isAnimating => dispatch(updateIsAnimating(isAnimating)),
  updateModal: modal => dispatch(updateModal(modal)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
})

const AppContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(App))

export default AppContainer
