import { connect } from 'react-redux'
import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'

import { updateModal } from 'modules/modal/actions/update-modal'
import claimReportingFeesForkedMarket from 'modules/portfolio/actions/claim-reporting-fees-forked-market'
import getReportingFees from 'modules/portfolio/actions/get-reporting-fees'

import { selectCurrentTimestamp } from 'src/select-state'
import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status'
import { selectMarket } from 'modules/market/selectors/market'
import { TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import { sendFinalizeMarket } from 'modules/market/actions/finalize-market'

import getValue from 'utils/get-value'

const mapStateToProps = (state) => {
  // const forkingMarket = selectMarket('0xbcde24abef27b2e537b8ded8139c7991de308607')
  const forkingMarket = state.universe.isForking ? selectMarket(state.universe.forkingMarket) : null
  return {
    closePositionStatus: getClosePositionStatus(),
    currentTimestamp: selectCurrentTimestamp(state),
    forkingMarket,
    // forkThreshold: state.universe.forkThreshold,
    // isForkingMarket: state.universe.isForking,
    isForkingMarket: state.universe.isForking,
    // isMobile: state.isMobile,
    linkType: TYPE_CLAIM_PROCEEDS,
    // outcomes: forkingMarket.outcomes || [],
    reporter: getValue(state, 'loginAccount.address'),
    universe: state.universe,
  }
}

const mapDispatchToProps = dispatch => ({
  claimReportingFeesForkedMarket: (universe, reporter, callback) => dispatch(claimReportingFeesForkedMarket(universe, reporter, callback)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
  getReportingFees: (universe, reporter, callback) => dispatch(getReportingFees(universe, reporter, callback)),
  updateModal: modal => dispatch(updateModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioReports)
