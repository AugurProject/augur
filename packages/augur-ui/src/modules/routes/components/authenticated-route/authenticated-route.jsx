import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import { Redirect } from "modules/common/containers/sticky-params-components";

import makePath from "modules/routes/helpers/make-path";

import { AUTHENTICATION } from "modules/routes/constants/views";

const AuthenticatedRoute = ({ component: Component, isLogged, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLogged ? (
        <Component {...props} />
      ) : (
        <Redirect push to={makePath(AUTHENTICATION)} />
      )
    }
  />
);

AuthenticatedRoute.propTypes = {
  component: PropTypes.any, // TODO
  isLogged: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isLogged: state.isLogged
});

export default connect(mapStateToProps)(AuthenticatedRoute);
