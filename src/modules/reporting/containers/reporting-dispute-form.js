import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDisputeForm from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form'
import { addUpdateAccountDispute } from 'modules/reporting/actions/update-account-disputes'
import marketDisputeOutcomes from 'modules/reporting/selectors/select-market-dispute-outcomes'
import { loadMarketsDisputeInfo } from 'modules/markets/actions/load-markets-dispute-info'

const mapStateToProps = (state, ownProps) => {
  const disputeOutcomes = marketDisputeOutcomes() || {}

  return ({
    isLogged: state.isLogged,
    universe: state.universe.id,
    forkThreshold: state.universe.forkThreshold,
    outcomes: disputeOutcomes[ownProps.market.id],
    market: ownProps.market,
    isMobile: state.isMobile,
    accountDisputeState: state.accountDisputes,
  })
}

const mapDispatchToProps = dispatch => ({
  loadMarketsDisputeInfo: (marketId, callback) => dispatch(loadMarketsDisputeInfo([marketId], callback)),
  addUpdateAccountDispute: data => dispatch(addUpdateAccountDispute(data)),
})


const mergeProps = (sP, dP, oP) => {
  const accountDisputeData = sP.accountDisputeState[sP.market.id]

  return {
    ...oP,
    ...sP,
    accountDisputeData,
    loadMarketsDisputeInfo: (marketId, callback) => dP.loadMarketsDisputeInfo([marketId], callback),
    addUpdateAccountDispute: data => dP.addUpdateAccountDispute(data),
  }
}

const Reporting = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportingDisputeForm))

export default Reporting
