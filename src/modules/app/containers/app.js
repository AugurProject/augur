import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import App from 'modules/app/components/app/app'

import { selectNotificationsAndSeenCount } from 'modules/notifications/selectors/notifications'
import { selectMarketsHeader } from 'modules/markets/selectors/markets-header'
import { selectCoreStats } from 'modules/account/selectors/core-stats'
import { selectCategories } from 'modules/categories/selectors/categories'
import portfolio from 'modules/portfolio/selectors/portfolio'
import { updateIsMobile, updateIsMobileSmall } from 'modules/app/actions/update-is-mobile'
import getAllMarkets from 'modules/markets/selectors/markets-all'
import { initAugur } from 'modules/app/actions/init-augur'

const mapStateToProps = state => ({
  url: state.url,
  loginAccount: state.loginAccount,
  marketsHeader: selectMarketsHeader(state),
  portfolio: portfolio(),
  notifications: selectNotificationsAndSeenCount(state),
  coreStats: selectCoreStats(state),
  isLogged: state.isLogged,
  isMobile: state.isMobile,
  isMobileSmall: state.isMobileSmall,
  markets: getAllMarkets(),
  marketsFilteredSorted: state.marketsFilteredSorted,
  categories: selectCategories(state),
  selectedCategory: state.selectedCategory,
  modal: state.modal,
})

const mapDispatchToProps = dispatch => ({
  updateIsMobile: isMobile => dispatch(updateIsMobile(isMobile)),
  updateIsMobileSmall: isMobileSmall => dispatch(updateIsMobileSmall(isMobileSmall)),
  initAugur: history => dispatch(initAugur(history)),
})

const AppContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(App))

export default AppContainer
