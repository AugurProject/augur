import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import AuthenticatedRoute from "modules/routes/components/authenticated-route/authenticated-route";
import makePath from "modules/routes/helpers/make-path";

import * as VIEWS from "modules/routes/constants/views";
import * as COMPONENTS from "modules/routes/constants/components";

// NOTE --  Routes are declarative, meaning ONLY top level views should be declared here.
//          Sub-views should be declared as needed at their respective inclusion points.

// TODO -- due to side-bar matching constraints, the below does not conform to the above.
const Routes = p => (
  <Switch>
    <Route path={makePath(VIEWS.MARKETS)} component={COMPONENTS.Markets} />
    <Route path={makePath(VIEWS.MARKET)} component={COMPONENTS.Market} />
    <AuthenticatedRoute
      path={makePath(VIEWS.DISPUTE)}
      component={COMPONENTS.Dispute}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.REPORT)}
      component={COMPONENTS.Report}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.MIGRATE_REP)}
      component={COMPONENTS.MigrateRep}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.MY_POSITIONS)}
      component={COMPONENTS.Portfolio}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.REPORTING_REPORTS)}
      component={COMPONENTS.Reporting}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT_DEPOSIT)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT_WITHDRAW)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT_REP_FAUCET)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.ACCOUNT_UNIVERSES)}
      component={COMPONENTS.Account}
    />
    <AuthenticatedRoute
      path={makePath(VIEWS.CREATE_MARKET)}
      component={COMPONENTS.CreateMarket}
    />
    <Route
      path={makePath(VIEWS.REPORTING_DISPUTE_MARKETS)}
      component={COMPONENTS.Reporting}
    />
    <Route
      path={makePath(VIEWS.REPORTING_REPORT_MARKETS)}
      component={COMPONENTS.Reporting}
    />
    <Route
      path={makePath(VIEWS.REPORTING_RESOLVED_MARKETS)}
      component={COMPONENTS.Reporting}
    />
    <Redirect to={makePath(VIEWS.MARKETS)} />
  </Switch>
);

export default Routes;
