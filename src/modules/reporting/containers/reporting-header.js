import { connect } from 'react-redux'

import ReportingHeader from 'modules/reporting/components/reporting-header/reporting-header'

import { loadReportingWindowBounds } from 'modules/reporting/actions/load-reporting-window-bounds'
import { sendFinalizeMarket } from 'modules/market/actions/finalize-market'
import { updateModal } from 'modules/modal/actions/update-modal'

const mapStateToProps = state => ({
  reportingWindowStats: state.reportingWindowStats,
  isMobile: state.isMobile,
  repBalance: state.loginAccount.rep || '0',
  universe: state.universe,
  forkingMarket: state.universe.forkingMarket,
  currentTime: state.blockchain.currentAugurTimestamp,
  doesUserHaveRep: state.loginAccount.rep > 0,
  forkReputationGoal: state.universe.forkReputationGoal,
  isForkingMarketFinalized: state.universe.isForkingMarketFinalized,
})

const mapDispatchToProps = dispatch => ({
  loadReportingWindowStake: () => { /* TODO */ },
  loadReportingWindowBounds: () => dispatch(loadReportingWindowBounds()),
  updateModal: modal => dispatch(updateModal(modal)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
})

const mergeProps = (sP, dP, oP) => ({
  ...oP,
  ...sP,
  ...dP,
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportingHeader)
