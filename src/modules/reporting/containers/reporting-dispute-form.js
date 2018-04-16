import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDisputeForm from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form'
import { getDisputeInfo } from 'modules/reporting/actions/get-dispute-info'
import { addUpdateAccountDispute } from 'modules/reporting/actions/update-account-disputes'

const mapStateToProps = (state, ownProps) => ({
  isLogged: state.isLogged,
  universe: state.universe.id,
  disputeThresholdForFork: state.universe.disputeThresholdForFork,
  market: ownProps.market,
  isMobile: state.isMobile,
  accountDisputeState: state.accountDisputes,
})

const mapDispatchToProps = dispatch => ({
  getDisputeInfo: (marketId, callback) => dispatch(getDisputeInfo(marketId, callback)),
  addUpdateAccountDispute: data => dispatch(addUpdateAccountDispute(data)),
})


const mergeProps = (sP, dP, oP) => {
  const accountDisputeData = sP.accountDisputeState[sP.market.id]

  return {
    ...oP,
    ...sP,
    accountDisputeData,
    getDisputeInfo: (marketId, callback) => dP.getDisputeInfo(marketId, callback),
    addUpdateAccountDispute: data => dP.addUpdateAccountDispute(data),
  }
}

const Reporting = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportingDisputeForm))

export default Reporting
