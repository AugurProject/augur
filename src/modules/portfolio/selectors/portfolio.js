import memoizerific from 'memoizerific';

import portfolioNavItems from 'modules/portfolio/selectors/portfolio-nav-items';
import selectPortfolioTotals from 'modules/portfolio/selectors/portfolio-totals';
import selectLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions';
import selectLoginAccountMarkets from 'modules/my-markets/selectors/login-account-markets';
import selectLoginAccountReports from 'modules/my-reports/selectors/login-account-reports';
import selectOpenOrders from 'modules/user-open-orders/selectors/open-orders';

export default function () {
  const navItems = portfolioNavItems();
  const markets = selectLoginAccountMarkets();
  const reports = selectLoginAccountReports();
  const totals = selectPortfolioTotals();

  const positions = selectLoginAccountPositions();
  const openOrders = selectOpenOrders();

  return {
    navItems,
    markets,
    reports,
    totals,
    positionsMarkets: selectPositionsMarkets(positions, openOrders)
  };
}

const selectPositionsMarkets = memoizerific(1)((positions, openOrders) => Array.from(new Set([...positions.markets, ...openOrders])));
