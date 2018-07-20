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
  const PAGINATION_COUNT = 5
  const loginAccount = selectLoginAccount(state)
  const disputeOutcomes = marketDisputeOutcomes() || {}
  const disputableMarkets = disputeMarkets() || []
  const upcomingDisputableMarkets = awaitingDisputeMarkets() || []

  return ({
    isLogged: state.isLogged,
    isConnected: state.connection.isConnected && state.universe.id != null,
    doesUserHaveRep: (loginAccount.rep.value > 0),
    markets: disputableMarkets,
    showPagination: disputableMarkets.length > PAGINATION_COUNT,
    disputableMarketsLength: disputableMarkets.length,
    pageinationCount: PAGINATION_COUNT,
    upcomingMarkets: upcomingDisputableMarkets,
    upcomingMarketsCount: upcomingDisputableMarkets.length,
    showUpcomingPagination: upcomingDisputableMarkets.length > PAGINATION_COUNT,
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
  loadMarkets: (loadMarketIds) => {
    dispatch(loadMarkets((err, marketIds) => {
      if (err) return logError(err)
      dispatch(loadMarketsInfoIfNotLoaded(loadMarketIds, (err, data) => {
        if (err) return logError(err)
        dispatch(loadMarketsDisputeInfo(loadMarketIds))
      }))
    }))
  },
})

const ReportingDisputeContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportingDisputeMarkets))

export default ReportingDisputeContainer
