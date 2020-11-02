import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import makePath from 'modules/routes/helpers/make-path';

import { DEFAULT_VIEW } from 'modules/routes/constants/views';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface AuthenticatedRouteProps {
  component: any;
  path: string;
}

const AuthenticatedRoute = ({
  component: Component,
  ...rest
}: AuthenticatedRouteProps) => {
  const { isLogged, restoredAccount } = useAppStatusStore();
  return (
    <Route
      {...rest}
      render={props =>
        isLogged || restoredAccount ? (
          <Component {...props} />
        ) : (
          <Redirect push to={makePath(DEFAULT_VIEW, false)} />
        )
      }
    />
  );
};

export default AuthenticatedRoute;
