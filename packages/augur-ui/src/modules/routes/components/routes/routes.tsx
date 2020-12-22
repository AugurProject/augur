import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route';
import makePath from 'modules/routes/helpers/make-path';

import * as VIEWS from 'modules/routes/constants/views';
import * as COMPONENTS from 'modules/routes/constants/components';

import { withPageAnalytic } from 'services/analytics';
import { isLocalHost } from 'utils/is-localhost';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';

const Routes = p => {
  const { env: { ui }, theme } = useAppStatusStore();
  const marketCreationEnabled = ui?.marketCreationEnabled || true; // TODO adjust when v2.json is updated post merge
  const reportingEnabled = ui?.reportingEnabled;

  return (
    <Switch>
      <Route path={makePath(VIEWS.MARKETS)} component={COMPONENTS.Markets} />
      <Route
          path={makePath(VIEWS.MARKET)}
          component={theme === THEMES.SPORTS ? COMPONENTS.BettingMarket : COMPONENTS.Market}
        />
      <Route
        path={makePath(VIEWS.LANDING_PAGE)}
        component={COMPONENTS.MarketsLandingPage}
      />

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
      {marketCreationEnabled && <AuthenticatedRoute
        path={makePath(VIEWS.CREATE_MARKET)}
        component={COMPONENTS.CreateMarket}
      />}
      {reportingEnabled && <Route
        path={makePath(VIEWS.DISPUTING)}
        component={COMPONENTS.Disputing}
      />}
      {reportingEnabled && <Route
        path={makePath(VIEWS.REPORTING)}
        component={COMPONENTS.Reporting}
      />}
      <Redirect to={makePath(VIEWS.MARKETS)} />
    </Switch>
  );
};

export default isLocalHost()
  ? withRouter(Routes)
  : withRouter(withPageAnalytic(Routes));
