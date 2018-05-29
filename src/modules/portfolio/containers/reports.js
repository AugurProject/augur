import { connect } from 'react-redux'
import { selectCurrentTimestamp } from 'src/select-state'

import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'
import { updateModal } from 'modules/modal/actions/update-modal'
import { getReportingFees } from 'modules/portfolio/actions/get-reporting-fees'
import { getWinningBalance } from 'modules/portfolio/actions/get-winning-balance'
import { selectMarket } from 'modules/market/selectors/market'
import { sendFinalizeMarket } from 'modules/market/actions/finalize-market'

const mapStateToProps = (state) => {
  const forkedMarket = state.universe.isForking ? selectMarket(state.universe.forkingMarket) : null
  return {
    currentTimestamp: selectCurrentTimestamp(state),
    forkedMarket,
    isLogged: state.isLogged,
    reportingFees: state.reportingWindowStats.reportingFees,
  }
}

const mapDispatchToProps = dispatch => ({
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
  getReportingFees: callback => dispatch(getReportingFees(callback)),
  getWinningBalances: marketIds => dispatch(getWinningBalance(marketIds)),
  updateModal: modal => dispatch(updateModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioReports)
