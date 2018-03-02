import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingResolved from 'modules/reporting/components/reporting-resolved/reporting-resolved'
import { selectMarketsToReport } from 'src/modules/reporting/selectors'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  markets: selectMarketsToReport(state),
})

const mapDispatchToProps = dispatch => ({
  loadReporting: () => dispatch(loadReporting()),
})

const ReportingResolvedContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportingResolved))

export default ReportingResolvedContainer
