import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDispute from 'modules/reporting/components/reporting-dispute/reporting-dispute'
import makePath from 'src/modules/routes/helpers/make-path'
import { ACCOUNT_DEPOSIT } from 'src/modules/routes/constants/views'
import { selectLoginAccount } from 'src/modules/auth/selectors/login-account'
import disputeMarkets from 'modules/reporting/selectors/select-dispute-markets'
import loadMarkets from 'modules/markets/actions/load-markets'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import logError from 'utils/log-error'

const mapStateToProps = (state, { history }) => {

  const loginAccount = selectLoginAccount(state)
  const disputableMarkets = disputeMarkets() || []

  return ({
    isLogged: state.isLogged,
    isConnected: state.connection.isConnected && state.universe.id != null,
    isMarketsLoaded: state.hasLoadedMarkets,
    doesUserHaveRep: (loginAccount.rep.value > 0),
    markets: disputableMarkets,
    marketsCount: disputableMarkets.length,
    isMobile: state.isMobile,
    disputeRound: 1,
    navigateToAccountDepositHandler: () => history.push(makePath(ACCOUNT_DEPOSIT)),
  })
}

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadMarkets((err, marketIds) => {
    if (err) return logError(err)
    dispatch(loadMarketsInfo(marketIds))
  })),
})

const ReportingDisputeContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportingDispute))

export default ReportingDisputeContainer
