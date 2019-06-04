import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import makePath from "modules/routes/helpers/make-path";

import { DEFAULT_VIEW } from "modules/routes/constants/views";

interface AuthenticatedRouteProps {
  component: any;
  isLogged: boolean;
}

const AuthenticatedRoute = ({ component: Component, isLogged, ...rest }: AuthenticatedRouteProps) => (
  <Route
    {...rest}
    render={(props) =>
      isLogged ? (
        <Component {...props} />
      ) : (
        <Redirect push to={makePath(DEFAULT_VIEW, false)} />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  isLogged: state.authStatus.isLogged,
});

export default connect(mapStateToProps)(AuthenticatedRoute);
