import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import PortfolioHeader from 'modules/portfolio/components/portfolio-header/portfolio-header'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
})

const PortfolioHeaderContainer = withRouter(connect(mapStateToProps)(PortfolioHeader))

export default PortfolioHeaderContainer
