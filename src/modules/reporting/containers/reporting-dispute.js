import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDispute from 'modules/reporting/components/reporting-dispute/reporting-dispute'

const mapStateToProps = state => ({
  markets: [],
  marketsCount: 0,
  isMobile: state.isMobile,
})

const mapDispatchToProps = dispatch => ({

})

const ReportingDisputeContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportingDispute))

export default ReportingDisputeContainer
