import { connect } from 'react-redux';
import portfolioCoreStats from 'modules/portfolio/components/portfolio-core-stats';

// NOTE -- The following is mostly a half-step towards the ultimate implementation of reselect (defering work until the full-app refactor)
import portfolioNavItems from 'modules/portfolio/selectors/portfolio-nav-items';

const mapStateToProps = state => ({
  portfolioStats: portfolioNavItems()
});

const portfolioCoreStats = connect(mapStateToProps)(nav);

export default portfolioCoreStats;
