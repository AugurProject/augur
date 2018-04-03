import { connect } from 'react-redux'
import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'

import { updateModal } from 'modules/modal/actions/update-modal'
import loadClaimableFees from 'modules/portfolio/actions/load-claimable-fees'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  loadClaimableFees: () => dispatch(loadClaimableFees()),
  updateModal: modal => dispatch(updateModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioReports)
