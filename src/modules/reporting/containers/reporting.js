import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingView from 'modules/reporting/components/reporting-view/reporting-view'

const mapStateToProps = state => ({
  marketsReporting: [{name: 'hello'}]
})

const Reporting = withRouter(connect(mapStateToProps)(ReportingView))

export default Reporting
