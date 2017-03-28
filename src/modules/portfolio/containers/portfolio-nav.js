import { connect } from 'react-redux';
import portfolioNavs from 'modules/portfolio/components/portfolio-navs';

import getPortfolioNavItems from 'modules/portfolio/selectors/portfolio-nav-items';

const mapStateToProps = state => ({
  activeView: state.activeView,
  portfolioNavItems: getPortfolioNavItems()
});

const portfolioNav = connect(mapStateToProps)(portfolioNavs);

export default portfolioNav;
