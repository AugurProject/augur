import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PortfolioReports from 'modules/portfolio/components/portfolio-reports/portfolio-reports'

const mapStateToProps = (state) => {
  const name = ''
  return {
    data: name,
    markets: [],
  }
}

const mapDispatchToProps = dispatch => ({

})

const ReportListContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(PortfolioReports))

export default ReportListContainer
