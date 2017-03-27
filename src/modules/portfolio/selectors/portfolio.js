import memoizerific from 'memoizerific';

import portfolioNavItems from 'modules/portfolio/selectors/portfolio-nav-items';
import selectPortfolioTotals from 'modules/portfolio/selectors/portfolio-totals';
import selectLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions';
import selectOpenOrders from 'modules/user-open-orders/selectors/open-orders';

export default function () {
  const navItems = portfolioNavItems();
  const totals = selectPortfolioTotals();

  const positions = selectLoginAccountPositions();
  const openOrders = selectOpenOrders();

  return {
    navItems,
    totals,
    positionsMarkets: selectPositionsMarkets(positions, openOrders)
  };
}

const selectPositionsMarkets = memoizerific(1)((positions, openOrders) => Array.from(new Set([...positions.markets, ...openOrders])));
