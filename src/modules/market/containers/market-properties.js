import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { determineMarketLinkType } from 'modules/market/helpers/determine-market-link-type'
import MarketProperties from 'modules/market/components/market-properties/market-properties'
import { selectMarket } from 'modules/market/selectors/market'

const mapStateToProps = (state, ownProps) => ({
  isLogged: state.isLogged,
  isMobile: state.isMobile,
  loginAccount: state.loginAccount,
  linkType: ownProps.linkType || determineMarketLinkType(selectMarket(ownProps.id), state.loginAccount),
})

const MarketTradingContainer = withRouter(connect(mapStateToProps)(MarketProperties))

export default MarketTradingContainer
