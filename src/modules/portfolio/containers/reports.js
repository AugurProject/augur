import { connect } from 'react-redux'
import { selectCurrentTimestamp } from 'src/select-state'

import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'
import { updateModal } from 'modules/modal/actions/update-modal'
import claimReportingFeesForkedMarket from 'modules/portfolio/actions/claim-reporting-fees-forked-market'
import getReportingFees from 'modules/portfolio/actions/get-reporting-fees'
import { getWinningBalance } from 'modules/portfolio/actions/get-winning-balance'
import { selectMarket } from 'modules/market/selectors/market'
import { sendFinalizeMarket } from 'modules/market/actions/finalize-market'

import getValue from 'utils/get-value'

const mapStateToProps = (state) => {
  const forkedMarket = state.universe.isForking ? selectMarket(state.universe.forkingMarket) : null
  return {
    currentTimestamp: selectCurrentTimestamp(state),
    forkedMarket,
    isLogged: state.isLogged,
    reporter: getValue(state, 'loginAccount.address'),
    universe: state.universe,
  }
}

const mapDispatchToProps = dispatch => ({
  claimReportingFeesForkedMarket: (universe, reporter, callback) => dispatch(claimReportingFeesForkedMarket(universe, reporter, callback)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
  getReportingFees: (universe, reporter, callback) => dispatch(getReportingFees(universe, reporter, callback)),
  getWinningBalances: marketIds => dispatch(getWinningBalance(marketIds)),
  updateModal: modal => dispatch(updateModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioReports)
