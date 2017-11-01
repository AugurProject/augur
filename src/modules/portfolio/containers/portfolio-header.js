import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import PortfolioHeader from 'modules/portfolio/components/portfolio-header/portfolio-header'

const PortfolioHeaderContainer = withRouter(connect()(PortfolioHeader))

export default PortfolioHeaderContainer
