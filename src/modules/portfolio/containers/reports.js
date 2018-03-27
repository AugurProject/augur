import { connect } from 'react-redux'
import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'

import { selectLoginAccount } from 'modules/auth/selectors/login-account'
import { updateModal } from 'modules/modal/actions/update-modal'
import loadClaimableFees from 'modules/portfolio/actions/load-claimable-fees'

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
  claimableFees: () => dispatch(loadClaimableFees()),
  updateModal: modal => dispatch(updateModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioReports)
