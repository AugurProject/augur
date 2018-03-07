import { connect } from 'react-redux'

import ReportingHeader from 'modules/reporting/components/reporting-header/reporting-header'

import { loadReportingWindowBounds } from 'modules/reporting/actions/load-reporting-window-bounds'

const mapStateToProps = state => ({
  reportingWindowStats: state.reportingWindowStats,
  isMobile: state.isMobile,
})

const mapDispatchToProps = dispatch => ({
  loadReportingWindowStake: () => { /* TODO */ },
  loadReportingWindowBounds: () => dispatch(loadReportingWindowBounds()),
})

const mergeProps = (sP, dP, oP) => ({
  ...oP,
  ...sP,
  ...dP,
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportingHeader)
