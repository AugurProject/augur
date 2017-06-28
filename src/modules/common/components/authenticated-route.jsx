import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { AUTHENTICATION } from 'modules/app/constants/views';

import makePath from 'modules/app/helpers/make-path';

const AuthenticatedRoute = ({ component: Component, ...props }) => (
  <Route
    {...props}
    render={props => (
      props.isLogged ?
        <Component {...props} /> :
        <Redirect to={makePath(AUTHENTICATION)} />
    )}
  />
);

AuthenticatedRoute.propTypes = {
  // component: PropTypes.node,
  isLogged: PropTypes.bool.isRequired
};

export default AuthenticatedRoute;
