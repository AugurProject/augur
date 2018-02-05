import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDispute from 'modules/reporting/components/reporting-dispute/reporting-dispute'

// const mapStateToProps = state => ({})

// const mapDispatchToProps = dispatch => ({})

const Dispute = withRouter(connect()(ReportingDispute))

export default Dispute
