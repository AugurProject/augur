import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import makePath from 'modules/routes/helpers/make-path.ts';
import MarketsView from 'modules/markets/markets-view';
import MarketView from 'modules/market/market-view';
import {
  MARKETS,
  MARKET,
  PORTFOLIO,
} from 'modules/constants.ts';
import PortfolioView from 'modules/portfolio/portfolio-view';

const Routes = p => {
  return (
    <Switch>
      <Route path={makePath(PORTFOLIO)} component={PortfolioView} />
      <Route path={makePath(MARKETS)} component={MarketsView} />
      <Route path={makePath(MARKET)} component={MarketView} />
      <Redirect to={makePath(MARKETS)} />
    </Switch>
  );
};

export default withRouter(Routes);
