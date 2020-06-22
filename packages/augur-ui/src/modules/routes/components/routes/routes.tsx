import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route';
import makePath from 'modules/routes/helpers/make-path';

import * as VIEWS from 'modules/routes/constants/views';
import * as COMPONENTS from 'modules/routes/constants/components';

import { withPageAnalytic } from 'services/analytics';
import { isLocalHost } from 'utils/is-localhost';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { connect } from 'react-redux';
import { page } from 'services/analytics/helpers';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { THEMES } from 'modules/common/constants';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  page: (eventName, payload) => page(eventName, payload),
});

const Routes = p => {
  const { theme } = useAppStatusStore();

  return (
    <Switch>
      <Route path={makePath(VIEWS.MARKETS)} component={COMPONENTS.Markets} />
      {theme === THEMES.SPORTS ? (
        <Route
          path={makePath(VIEWS.MARKET)}
          component={COMPONENTS.BettingMarket}
        />
      ) : (
        <Route path={makePath(VIEWS.MARKET)} component={COMPONENTS.Market} />
      )}
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
      <Redirect to={makePath(VIEWS.MARKETS)} />
    </Switch>
  );
};

export default isLocalHost()
  ? withRouter(Routes)
  : withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withPageAnalytic(Routes))
    );
