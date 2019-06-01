import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import AuthenticatedRoute from "modules/routes/components/authenticated-route/authenticated-route";
import makePath from "modules/routes/helpers/make-path";

import * as VIEWS from "modules/routes/constants/views";
import * as COMPONENTS from "modules/routes/constants/components";

// NOTE --  Routes are declarative, meaning ONLY top level views should be declared here.
//          Sub-views should be declared as needed at their respective inclusion points.

// TODO -- due to side-bar matching constraints, the below does not conform to the above.
const Routes = (p) => (
  <Switch>
    <Route path={makePath(VIEWS.MARKETS, false)} component={COMPONENTS.Markets} />
    <Route path={makePath(VIEWS.MARKET, false)} component={COMPONENTS.Market} />
    <AuthenticatedRoute
      path={makePath(VIEWS.DISPUTE, false)}
      component={COMPONENTS.Dispute}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.REPORT, false)}
      component={COMPONENTS.Report}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.MIGRATE_REP, false)}
      component={COMPONENTS.MigrateRep}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.MY_POSITIONS, false)}
      component={COMPONENTS.Portfolio}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.REPORTING_REPORTS, false)}
      component={COMPONENTS.Reporting}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT, false)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT_DEPOSIT, false)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT_WITHDRAW, false)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT_REP_FAUCET, false)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT_UNIVERSES, false)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.CREATE_MARKET, false)}
      component={COMPONENTS.CreateMarket}
    />
    <Route
      path={makePath(VIEWS.REPORTING_DISPUTE_MARKETS, false)}
      component={COMPONENTS.Reporting}
    />
    <Route
      path={makePath(VIEWS.REPORTING_REPORT_MARKETS, false)}
      component={COMPONENTS.Reporting}
    />
    <Route
      path={makePath(VIEWS.REPORTING_RESOLVED_MARKETS, false)}
      component={COMPONENTS.Reporting}
    />
    <Redirect to={makePath(VIEWS.MARKETS, false)} />
  </Switch>
);

export default Routes;
