import { connect } from 'react-redux'
import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'

import loadClaimableFees from 'modules/portfolio/actions/load-claimable-fees'

const mapStateToProps = (state) => {
  const name = ''
  return {
    data: name,
    markets: [],
  }
}

const mapDispatchToProps = dispatch => ({
  claimableFees: () => dispatch(loadClaimableFees()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioReports)
