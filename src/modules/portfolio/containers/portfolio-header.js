import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import PortfolioHeader from 'modules/portfolio/components/portfolio-header/portfolio-header'
import { triggerTransactionsExport } from 'modules/transactions/actions/trigger-transactions-export'

const mapDispatchToProps = dispatch => ({
  triggerTransactionsExport: () => dispatch(triggerTransactionsExport()),
})

const PortfolioHeaderContainer = withRouter(connect(null, mapDispatchToProps)(PortfolioHeader))

export default PortfolioHeaderContainer
