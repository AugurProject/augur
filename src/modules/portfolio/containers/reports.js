import { connect } from 'react-redux'
import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'

import { updateModal } from 'modules/modal/actions/update-modal'
import getReportingFees from 'modules/portfolio/actions/get-reporting-fees'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  universe: state.universe,
  reporter: getValue(state, 'loginAccount.address'),
})

const mapDispatchToProps = dispatch => ({
  getReportingFees: (universe, reporter, callback) => dispatch(getReportingFees(universe, reporter, callback)),
  updateModal: modal => dispatch(updateModal(modal)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioReports)
