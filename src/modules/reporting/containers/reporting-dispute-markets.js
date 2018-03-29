import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDisputeMarkets from 'modules/reporting/components/reporting-dispute-markets/reporting-dispute-markets'
import makePath from 'src/modules/routes/helpers/make-path'
import { ACCOUNT_DEPOSIT } from 'src/modules/routes/constants/views'
import { selectLoginAccount } from 'src/modules/auth/selectors/login-account'
import disputeMarkets from 'modules/reporting/selectors/select-dispute-markets'
import awaitingDisputeMarkets from 'modules/reporting/selectors/select-awaiting-dispute-markets'
import loadMarkets from 'modules/markets/actions/load-markets'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { loadMarketsDisputeInfo } from 'modules/markets/actions/load-markets-dispute-info'
import marketDisputeOutcomes from 'modules/reporting/selectors/select-market-dispute-outcomes'
import logError from 'utils/log-error'

const mapStateToProps = (state, { history }) => {

  const loginAccount = selectLoginAccount(state)
  const disputableMarkets = disputeMarkets() || []
  const upcomingDisputableMarkets = awaitingDisputeMarkets() || []
  const disputeOutcomes = marketDisputeOutcomes() || {}

  return ({
    isLogged: state.isLogged,
    isConnected: state.connection.isConnected && state.universe.id != null,
    isMarketsLoaded: state.hasLoadedMarkets,
    doesUserHaveRep: (loginAccount.rep.value > 0),
    markets: disputableMarkets,
    upcomingMarkets: upcomingDisputableMarkets,
    marketsCount: disputableMarkets.length,
    upcomingMarketsCount: upcomingDisputableMarkets.length,
    isMobile: state.isMobile,
    navigateToAccountDepositHandler: () => history.push(makePath(ACCOUNT_DEPOSIT)),
    outcomes: disputeOutcomes,
    account: loginAccount.address,
    isForking: state.universe.isForking,
    forkEndTime: state.universe.forkEndTime,
    currentTime: state.blockchain.currentAugurTimestamp,
  })
}

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadMarkets((err, marketIds) => {
    if (err) return logError(err)
    dispatch(loadMarketsInfo(marketIds))
    dispatch(loadMarketsDisputeInfo(marketIds))
  })),
})

const ReportingDisputeContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportingDisputeMarkets))

export default ReportingDisputeContainer
