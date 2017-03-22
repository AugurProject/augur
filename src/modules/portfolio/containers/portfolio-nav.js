// NOTE --  The following is mostly a half-step towards the ultimate implementation
//          of reselect (deferring work until the full-app refactor)

import { connect } from 'react-redux';
import portfolioNavs from 'modules/portfolio/components/portfolio-navs';

import portfolioNavItems from 'modules/portfolio/selectors/portfolio-nav-items';

const mapStateToProps = state => ({
  activeView: state.activeView,
  portfolioNavItems: portfolioNavItems()
});

const portfolioNav = connect(mapStateToProps)(portfolioNavs);

export default portfolioNav;
