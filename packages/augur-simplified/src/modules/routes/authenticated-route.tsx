import React from 'react';
import { Route } from 'react-router-dom';

interface AuthenticatedRouteProps {
  component: any;
  path: string;
}

const AuthenticatedRoute = ({
  component: Component,
  ...rest
}: AuthenticatedRouteProps) => {
  return (
    <Route
      {...rest}
      render={props =>
        <Component {...props} />
      }
    />
  );
};

export default AuthenticatedRoute;
