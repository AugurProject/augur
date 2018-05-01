import { connect } from 'react-redux'

import ReportingHeader from 'modules/reporting/components/reporting-header/reporting-header'

import { loadReportingWindowBounds } from 'modules/reporting/actions/load-reporting-window-bounds'

import { updateModal } from 'modules/modal/actions/update-modal'

const mapStateToProps = state => ({
  reportingWindowStats: state.reportingWindowStats,
  isMobile: state.isMobile,
  repBalance: state.loginAccount.rep,
  forkingMarket: state.universe.forkingMarket,
  currentTime: state.blockchain.currentAugurTimestamp,
})

const mapDispatchToProps = dispatch => ({
  loadReportingWindowStake: () => { /* TODO */ },
  loadReportingWindowBounds: () => dispatch(loadReportingWindowBounds()),
  updateModal: modal => dispatch(updateModal(modal)),
})

const mergeProps = (sP, dP, oP) => ({
  ...oP,
  ...sP,
  ...dP,
})
console.log('hi')
export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportingHeader)
