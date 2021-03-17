import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { Utils } from '@augurproject/augur-comps';
import MarketsView from '../markets/markets-view';
import MarketView from '../market/market-view';
import {
  MARKETS,
  MARKET,
  PORTFOLIO,
} from '../constants';
import PortfolioView from '../portfolio/portfolio-view';
const { PathUtils: { makePath } } = Utils;

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
