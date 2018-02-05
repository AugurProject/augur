import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingReporting from 'modules/reporting/components/reporting-reporting/reporting-reporting'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

const ReportingReportingContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportingReporting))

export default ReportingReportingContainer
