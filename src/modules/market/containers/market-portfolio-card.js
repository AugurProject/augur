import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { determineMarketLinkType } from 'modules/market/helpers/determine-market-link-type'
import MarketPortfolioCard from 'modules/market/components/market-portfolio-card/market-portfolio-card'
import { selectMarket } from 'modules/market/selectors/market'
import { finalizeMarket } from 'modules/market/actions/finalize-market'

const mapStateToProps = (state, ownProps) => ({
  linkType: ownProps.linkType || determineMarketLinkType(selectMarket(ownProps.market.id), state.loginAccount),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	finalizeMarket: marketId => dispatch(finalizeMarket(marketId)),
})

const MarketPortfolioCardContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketPortfolioCard))

export default MarketPortfolioCardContainer
