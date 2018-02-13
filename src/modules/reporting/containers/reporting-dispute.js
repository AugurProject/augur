import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDispute from 'modules/reporting/components/reporting-dispute/reporting-dispute'
import makePath from 'src/modules/routes/helpers/make-path'
import { ACCOUNT_DEPOSIT } from 'src/modules/routes/constants/views'
import { selectLoginAccount } from 'src/modules/auth/selectors/login-account'

const mapStateToProps = (state, { history }) => {
  const loginAccount = selectLoginAccount(state)
  return ({
    doesUserHasRep: (loginAccount.rep.value > 0),
    markets: [],
    marketsCount: 0,
    isMobile: state.isMobile,
    navigateToAccountDepositHandler: () => history.push(makePath(ACCOUNT_DEPOSIT)),
  })
}

const mapDispatchToProps = dispatch => ({})

const ReportingDisputeContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportingDispute))

export default ReportingDisputeContainer
