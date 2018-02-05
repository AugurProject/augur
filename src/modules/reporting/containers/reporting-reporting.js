import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingReporting from 'modules/reporting/components/reporting-reporting/reporting-reporting'

// const mapStateToProps = state => ({})

// const mapDispatchToProps = dispatch => ({})

const Reporting = withRouter(connect()(ReportingReporting))

export default Reporting
