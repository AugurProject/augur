import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { determineMarketLinkType } from 'modules/market/helpers/determine-market-link-type'
import MarketProperties from 'modules/market/components/market-properties/market-properties'
import { selectMarket } from 'modules/market/selectors/market'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  isMobile: state.isMobile,
  loginAccount: state.loginAccount,
})

const mapDispatchToProps = dispatch => ({

})

const mergeProps = (sP, dP, oP) => {
  const linkType = oP.linkType || determineMarketLinkType(selectMarket(oP.id), sP.loginAccount)

  return {
    ...sP,
    ...dP,
    ...oP,
    linkType,
  }
}

const MarketTradingContainer = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketProperties))

export default MarketTradingContainer
