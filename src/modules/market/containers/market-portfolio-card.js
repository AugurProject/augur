import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { determineMarketLinkType } from 'modules/market/helpers/determine-market-link-type'
import MarketPortfolioCard from 'modules/market/components/market-portfolio-card/market-portfolio-card'
import { selectMarket } from 'modules/market/selectors/market'
import { finalizeMarket } from 'modules/market/actions/finalize-market'
import { calculateOutstandingReturns } from 'modules/market/helpers/calculate-outstanding-returns'

const mapStateToProps = (state, ownProps) => ({
  linkType: ownProps.linkType || determineMarketLinkType(selectMarket(ownProps.market.id), state.loginAccount),
  outstandingReturns: calculateOutstandingReturns(ownProps.market.id, state.accountPositions), // check if it is a claim type
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  finalizeMarket: marketId => dispatch(finalizeMarket(marketId)), // should this be switched to augurjs one?
})

const MarketPortfolioCardContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketPortfolioCard))

export default MarketPortfolioCardContainer
