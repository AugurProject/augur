import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDisputeMarkets from 'modules/reporting/components/reporting-dispute-markets/reporting-dispute-markets'
import { loadReporting } from 'src/modules/reporting/actions/load-reporting'
import { selectMarketsToReport } from 'src/modules/reporting/selectors'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  markets: selectMarketsToReport(state),
})

const mapDispatchToProps = dispatch => ({
  loadReporting: () => dispatch(loadReporting()),
})

const ReportingReportingContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportingDisputeMarkets))

export default ReportingReportingContainer
