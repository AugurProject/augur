import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import makePath from './helpers/make-path.ts';
import Markets from '../markets/markets';
import {
  MARKETS
} from '../constants.ts';

const Routes = p => {
  return (
    <Switch>
      <Route path={makePath(MARKETS)} component={Markets} />
      <Redirect to={makePath(MARKETS)} />
    </Switch>
  );
};

export default withRouter(Routes);
