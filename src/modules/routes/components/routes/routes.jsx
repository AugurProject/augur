import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'
import UnauthenticatedRoute from 'modules/routes/components/unauthenticated-route/unauthenticated-route'
import makePath from 'modules/routes/helpers/make-path'

import * as VIEWS from 'modules/routes/constants/views'
import * as COMPONENTS from 'modules/routes/constants/components'


// NOTE --  Routes are declarative, meaning ONLY top level views should be declared here.
//          Sub-views should be declared as needed at their respective inclusion points.

// TODO -- due to side-bar matching constraints, the below does not conform to the above.
const Routes = p => (
  <Switch>
    <Route exact path={makePath(VIEWS.DEFAULT_VIEW)} component={COMPONENTS.Categories} />
    <Route path={makePath(VIEWS.MARKETS)} component={COMPONENTS.Markets} />
    <Route path={makePath(VIEWS.MARKET)} component={COMPONENTS.Market} />
    <Route path={makePath(VIEWS.CONNECT)} component={COMPONENTS.Connect} />
    <Route path={makePath(VIEWS.CREATE)} component={COMPONENTS.Create} />
    <AuthenticatedRoute path={makePath(VIEWS.DISPUTE)} component={COMPONENTS.Dispute} />
    <AuthenticatedRoute path={makePath(VIEWS.REPORT)} component={COMPONENTS.Report} />
    <AuthenticatedRoute path={makePath(VIEWS.MIGRATE_REP)} component={COMPONENTS.MigrateRep} />
    <AuthenticatedRoute path={makePath(VIEWS.MY_POSITIONS)} component={COMPONENTS.Portfolio} />
    <AuthenticatedRoute path={makePath(VIEWS.MY_MARKETS)} component={COMPONENTS.Portfolio} />
    <AuthenticatedRoute path={makePath(VIEWS.FAVORITES)} component={COMPONENTS.Portfolio} />
    <AuthenticatedRoute path={makePath(VIEWS.PORTFOLIO_TRANSACTIONS)} component={COMPONENTS.Portfolio} />
    <AuthenticatedRoute path={makePath(VIEWS.PORTFOLIO_REPORTS)} component={COMPONENTS.Portfolio} />
    <AuthenticatedRoute path={makePath(VIEWS.ACCOUNT)} component={COMPONENTS.Account} />
    <AuthenticatedRoute path={makePath(VIEWS.ACCOUNT_DEPOSIT)} component={COMPONENTS.Account} />
    <AuthenticatedRoute path={makePath(VIEWS.ACCOUNT_WITHDRAW)} component={COMPONENTS.Account} />
    <AuthenticatedRoute path={makePath(VIEWS.ACCOUNT_REP_FAUCET)} component={COMPONENTS.Account} />
    <AuthenticatedRoute path={makePath(VIEWS.ACCOUNT_UNIVERSES)} component={COMPONENTS.Account} />
    <AuthenticatedRoute path={makePath(VIEWS.CREATE_MARKET)} component={COMPONENTS.CreateMarket} />
    <AuthenticatedRoute path={makePath(VIEWS.REPORTING_DISPUTE_MARKETS)} component={COMPONENTS.Reporting} />
    <AuthenticatedRoute path={makePath(VIEWS.REPORTING_REPORT_MARKETS)} component={COMPONENTS.Reporting} />
    <AuthenticatedRoute path={makePath(VIEWS.REPORTING_RESOLVED_MARKETS)} component={COMPONENTS.Reporting} />
    <UnauthenticatedRoute path={makePath(VIEWS.AUTHENTICATION)} component={COMPONENTS.Auth} />
    <Redirect to={makePath(VIEWS.CATEGORIES)} />
  </Switch>
)

export default Routes
