import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import portfolioNavs from 'modules/portfolio/components/portfolio-navs'

import getPortfolioNavItems from 'modules/portfolio/selectors/portfolio-nav-items'

const mapStateToProps = state => ({
  portfolioNavItems: getPortfolioNavItems()
})

const portfolioNav = withRouter(connect(mapStateToProps)(portfolioNavs))

export default portfolioNav
