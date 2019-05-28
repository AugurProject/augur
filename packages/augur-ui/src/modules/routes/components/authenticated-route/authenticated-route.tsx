import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import makePath from "modules/routes/helpers/make-path";

import { DEFAULT_VIEW } from "modules/routes/constants/views";

const AuthenticatedRoute = ({ component: Component, isLogged, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLogged ? (
        <Component {...props} />
      ) : (
        <Redirect push to={makePath(DEFAULT_VIEW)} />
      )
    }
  />
);

AuthenticatedRoute.propTypes = {
  component: PropTypes.any.isRequired, // TODO
  isLogged: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged
});

export default connect(mapStateToProps)(AuthenticatedRoute);
