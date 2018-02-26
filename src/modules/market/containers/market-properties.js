import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { determineMarketLinkType } from 'modules/market/helpers/determine-market-link-type'
import MarketProperties from 'modules/market/components/market-properties/market-properties'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  isMobile: state.isMobile,
  loginAccount: state.loginAccount,
})

const mapDispatchToProps = dispatch => ({

})

const mergeProps = (sP, dP, oP) => {
  console.log(sP.linkType);
  console.log(oP);
  console.log(oP.linkType);
  const linkType = oP.linkType || selectMarketLinkType(oP.id, sP.loginAccount)
  console.log(linkType);

  return {
    ...sP,
    ...dP,
    ...oP,
    linkType,
  }
}

const MarketTradingContainer = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketProperties))

export default MarketTradingContainer
