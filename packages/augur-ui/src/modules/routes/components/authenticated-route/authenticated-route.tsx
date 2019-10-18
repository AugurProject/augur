import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import makePath from "modules/routes/helpers/make-path";

import { DEFAULT_VIEW } from "modules/routes/constants/views";

interface AuthenticatedRouteProps {
  component: any;
  isLogged: boolean;
  restoredAccount: boolean;
}

const AuthenticatedRoute = ({ component: Component, isLogged, restoredAccount, ...rest }: AuthenticatedRouteProps) => (
  <Route
    {...rest}
    render={(props) =>
      isLogged || restoredAccount? (
        <Component {...props} />
      ) : (
        <Redirect push to={makePath(DEFAULT_VIEW, false)} />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  isLogged: state.authStatus.isLogged,
  restoredAccount: state.authStatus.restoredAccount,
});

export default connect(mapStateToProps)(AuthenticatedRoute);
