import getPortfolioNavItems from 'modules/portfolio/selectors/portfolio-nav-items';
import getPortfolioTotals from 'modules/portfolio/selectors/portfolio-totals';

export default function () {
  return {
    navItems: getPortfolioNavItems(),
    totals: getPortfolioTotals()
  };
}
