import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { determineMarketLinkType } from 'modules/market/helpers/determine-market-link-type'
import MarketProperties from 'modules/market/components/market-properties/market-properties'
import { selectMarket } from 'modules/market/selectors/market'
import { updateModal } from 'modules/modal/actions/update-modal'

const mapStateToProps = (state, ownProps) => ({
  isLogged: state.isLogged,
  isMobile: state.isMobile,
  loginAccount: state.loginAccount,
  linkType: ownProps.linkType || determineMarketLinkType(selectMarket(ownProps.id), state.loginAccount),
  isForking: state.universe.isForking,
  isForkingMarketFinalized: state.universe.isForkingMarketFinalized,
  forkingMarket: state.universe.forkingMarket,
})

const mapDispatchToProps = dispatch => ({
  updateModal: modal => dispatch(updateModal(modal)),
})

const MarketPropertiesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketProperties))

export default MarketPropertiesContainer
