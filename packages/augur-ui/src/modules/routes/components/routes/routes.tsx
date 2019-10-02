import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route';
import makePath from 'modules/routes/helpers/make-path';

import * as VIEWS from 'modules/routes/constants/views';
import * as COMPONENTS from 'modules/routes/constants/components';


const getLoggedInAccountFromLocalStorage = () => {
  let loggedInAccount = null;
  if (window.localStorage && window.localStorage.getItem) {
    loggedInAccount = window.localStorage.getItem('loggedInAccount');
  }
  return loggedInAccount;
}

const Routes = (p) => {
  const loggedInAccount = getLoggedInAccountFromLocalStorage();

  return (
    <Switch>
      <Route path={makePath(VIEWS.MARKETS)} component={COMPONENTS.Markets} />
      <Route path={makePath(VIEWS.MARKET)} component={COMPONENTS.Market} />
      <Route path={makePath(VIEWS.LANDING_PAGE)} component={COMPONENTS.MarketsLandingPage} />

      <AuthenticatedRoute
        path={makePath(VIEWS.MY_POSITIONS)}
        component={COMPONENTS.Portfolio}
      />
      <AuthenticatedRoute
        path={makePath(VIEWS.ACCOUNT_SUMMARY)}
        component={COMPONENTS.Account}
      />
      <AuthenticatedRoute
        path={makePath(VIEWS.TRANSACTIONS)}
        component={COMPONENTS.Account}
      />
      <AuthenticatedRoute
        path={makePath(VIEWS.CREATE_MARKET)}
        component={COMPONENTS.CreateMarket}
      />
      <Route
        path={makePath(VIEWS.DISPUTING)}
        component={COMPONENTS.Disputing}
      />
      <Route
        path={makePath(VIEWS.REPORTING)}
        component={COMPONENTS.Reporting}
      />
      <Redirect to={p.isLogged || loggedInAccount ? makePath(VIEWS.MARKETS) : makePath(VIEWS.LANDING_PAGE)} />
    </Switch>
  );
}
export default Routes;
