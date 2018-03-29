import { connect } from 'react-redux'
import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'

import { selectLoginAccount } from 'modules/auth/selectors/login-account'
import { updateModal } from 'modules/modal/actions/update-modal'
import loadClaimableFees from 'modules/portfolio/actions/load-claimable-fees'
import claimReportingFees from 'modules/portfolio/actions/claim-reporting-fees'

const mapStateToProps = (state) => {
  const name = ''
  const loginAccount = selectLoginAccount(state)
  return {
    recipient: loginAccount.address,
    data: name,
    markets: [],
  }
}

const mapDispatchToProps = dispatch => ({
  loadClaimableFees: () => dispatch(loadClaimableFees()),
  claimReportingFees: (options, callback) => dispatch(claimReportingFees(options, callback)),
  updateModal: modal => dispatch(updateModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioReports)
