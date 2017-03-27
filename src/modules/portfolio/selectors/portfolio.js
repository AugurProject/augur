import portfolioNavItems from 'modules/portfolio/selectors/portfolio-nav-items';
import selectPortfolioTotals from 'modules/portfolio/selectors/portfolio-totals';

export default function () {
  const navItems = portfolioNavItems();
  const totals = selectPortfolioTotals();

  return {
    navItems,
    totals
  };
}
