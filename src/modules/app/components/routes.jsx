import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import App from 'modules/app/container';
// NOTE --  the respective routes are imported within the switch statement so that
//          webpack can properly code split the views into independently loadable chunks
export default class Routes extends Component {
  static propTypes = {
    activeView: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired
  }

import loadAsyncComponent from 'modules/common/components/async-component';
import AuthenticatedRoute from 'modules/auth/components/authenticated-route';
import makePath from 'modules/app/helpers/make-path';

import * as VIEWS from 'modules/app/constants/views';

const Topics = loadAsyncComponent({
  moduleName: 'Topics',
  loader: () => import(/* webpackChunkName: 'topics' */ 'modules/topics/container')
    .then(module => module.default)
});
const Markets = loadAsyncComponent({
  moduleName: 'Markets',
  loader: () => import(/* webpackChunkName: 'markets' */ 'modules/markets/container')
    .then(module => module.default)
});
const Authentication = loadAsyncComponent({
  moduleName: 'Authentication',
  loader: () => import(/* webpackChunkName: 'auth' */ 'modules/auth/container')
    .then(module => module.default)
});
const Account = loadAsyncComponent({
  moduleName: 'Account',
  loader: () => import(/* webpackChunkName: 'account' */ 'modules/account/container')
    .then(module => module.default)
});
const Transactions = loadAsyncComponent({
  moduleName: 'Transactions',
  loader: () => import(/* webpackChunkName: 'transactions' */ 'modules/transactions/container')
    .then(module => module.default)
});
const Market = loadAsyncComponent({
  moduleName: 'Market',
  loader: () => import(/* webpackChunkName: 'market' */ 'modules/market/container')
    .then(module => module.default)
});
const Portfolio = loadAsyncComponent({
  moduleName: 'Portfolio',
  loader: () => import(/* webpackChunkName: 'portfolio' */ 'modules/portfolio/containers/portfolio')
    .then(module => module.default)
});
const CreateMarket = loadAsyncComponent({
  moduleName: 'CreateMarket',
  loader: () => import(/* webpackChunkName: 'create-market' */ 'modules/create-market/container')
    .then(module => module.default)
});

const Routes = p => (
  <App>
    <Switch>
      <Route exact path={makePath(VIEWS.DEFAULT_VIEW)} component={Topics} />
      <Route path={makePath(VIEWS.MARKETS)} component={Markets} />
      <Route path={makePath(VIEWS.MARKET)} component={Market} />
      <Route path={makePath(VIEWS.AUTHENTICATION)} component={Authentication} />
      <AuthenticatedRoute path={makePath(VIEWS.FAVORITES)} component={Markets} />
      <AuthenticatedRoute path={makePath(VIEWS.MY_POSITIONS)} component={Portfolio} />
      <AuthenticatedRoute path={makePath(VIEWS.MY_MARKETS)} component={Portfolio} />
      <AuthenticatedRoute path={makePath(VIEWS.MY_REPORTS)} component={Portfolio} />
      <AuthenticatedRoute path={makePath(VIEWS.ACCOUNT)} component={Account} />
      <AuthenticatedRoute path={makePath(VIEWS.TRANSACTIONS)} component={Transactions} />
      <AuthenticatedRoute path={makePath(VIEWS.CREATE_MARKET)} component={CreateMarket} />
      <Redirect to={makePath(VIEWS.TOPICS)} />
    </Switch>
  </App>
);

export default Routes;
