import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { selectCurrentTimestampInSeconds } from 'src/select-state'
import { determineMarketLinkType } from 'modules/market/helpers/determine-market-link-type'
import MarketPortfolioCard from 'modules/market/components/market-portfolio-card/market-portfolio-card'
import { selectMarket } from 'modules/market/selectors/market'
import { sendFinalizeMarket } from 'modules/market/actions/finalize-market'
import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status'
import { getWinningBalance } from 'modules/portfolio/actions/get-winning-balance'

const mapStateToProps = (state, ownProps) => ({
  currentTimestamp: selectCurrentTimestampInSeconds(state),
  linkType: ownProps.linkType || determineMarketLinkType(selectMarket(ownProps.market.id), state.loginAccount),
  closePositionStatus: getClosePositionStatus(),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getWinningBalances: marketIds => dispatch(getWinningBalance(marketIds)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
})

const MarketPortfolioCardContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketPortfolioCard))

export default MarketPortfolioCardContainer
