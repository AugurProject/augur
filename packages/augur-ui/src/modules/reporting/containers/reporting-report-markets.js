import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingReportMarkets from 'modules/reporting/components/reporting-report-markets/reporting-report-markets'
import { loadReporting } from 'src/modules/reporting/actions/load-reporting'
import { selectMarketsToReport } from 'src/modules/reporting/selectors/select-markets-to-report'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  markets: selectMarketsToReport(state),
})

const mapDispatchToProps = dispatch => ({
  loadReporting: () => dispatch(loadReporting()),
})

const ReportingReportingContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportingReportMarkets))

export default ReportingReportingContainer
