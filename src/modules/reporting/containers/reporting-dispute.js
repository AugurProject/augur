import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDispute from 'modules/reporting/components/reporting-dispute/reporting-dispute'
import makePath from 'src/modules/routes/helpers/make-path'
import { ACCOUNT_DEPOSIT } from 'src/modules/routes/constants/views'
import { selectLoginAccount } from 'src/modules/auth/selectors/login-account'
import disputeMarkets from 'modules/reporting/selectors/select-dispute-markets'

const mapStateToProps = (state, { history }) => {
  const loginAccount = selectLoginAccount(state)
  const disputableMarkets = disputeMarkets() || []

  return ({
    doesUserHaveRep: (loginAccount.rep.value > 0),
    markets: disputableMarkets,
    marketsCount: disputableMarkets.length,
    isMobile: state.isMobile,
    navigateToAccountDepositHandler: () => history.push(makePath(ACCOUNT_DEPOSIT)),
  })
}

const mapDispatchToProps = dispatch => ({})

const ReportingDisputeContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportingDispute))

export default ReportingDisputeContainer
