import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDisputeMarkets from 'modules/reporting/components/reporting-dispute-markets/reporting-dispute-markets'
import makePath from 'src/modules/routes/helpers/make-path'
import { ACCOUNT_DEPOSIT } from 'src/modules/routes/constants/views'
import { selectLoginAccount } from 'src/modules/auth/selectors/login-account'
import disputeMarkets from 'modules/reporting/selectors/select-dispute-markets'
import awaitingDisputeMarkets from 'modules/reporting/selectors/select-awaiting-dispute-markets'
import loadMarkets from 'modules/markets/actions/load-markets'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'
import { loadMarketsDisputeInfo } from 'modules/markets/actions/load-markets-dispute-info'
import marketDisputeOutcomes from 'modules/reporting/selectors/select-market-dispute-outcomes'
import logError from 'utils/log-error'

const mapStateToProps = (state, { history }) => {

  const loginAccount = selectLoginAccount(state)
  const disputeOutcomes = marketDisputeOutcomes() || {}
  const disputableMarkets = disputeMarkets() || []
  const upcomingDisputableMarkets = awaitingDisputeMarkets() || []

  return ({
    isLogged: state.isLogged,
    isConnected: state.connection.isConnected && state.universe.id != null,
    doesUserHaveRep: (loginAccount.rep.value > 0),
    markets: disputableMarkets,
    upcomingMarkets: upcomingDisputableMarkets,
    upcomingMarketsCount: upcomingDisputableMarkets.length,
    isMobile: state.isMobile,
    navigateToAccountDepositHandler: () => history.push(makePath(ACCOUNT_DEPOSIT)),
    outcomes: disputeOutcomes,
    account: loginAccount.address,
    isForking: state.universe.isForking,
    forkEndTime: state.universe.forkEndTime,
    forkingMarketId: state.universe.forkingMarket,
  })
}

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadMarkets((err, marketIds) => {
    if (err) return logError(err)
    dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, data) => {
      if (err) return logError(err)
      dispatch(loadMarketsDisputeInfo(marketIds))
    }))
  })),
})

const ReportingDisputeContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportingDisputeMarkets))

export default ReportingDisputeContainer
