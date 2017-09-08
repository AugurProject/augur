import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import App from 'modules/app/container'
import asyncComponent from 'modules/common/components/async-component'
import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'
import makePath from 'modules/routes/helpers/make-path'

import * as VIEWS from 'modules/routes/constants/views'

const Topics = asyncComponent({
  moduleName: 'Topics',
  loader: () => import(/* webpackChunkName: 'topics' */ 'modules/topics/container')
    .then(module => module.default)
})
const Markets = asyncComponent({
  moduleName: 'Markets',
  loader: () => import(/* webpackChunkName: 'markets' */ 'modules/markets/container')
    .then(module => module.default)
})
const AuthLander = asyncComponent({
  moduleName: 'AuthLander',
  loader: () => import(/* webpackChunkName: 'auth' */ 'modules/auth/containers/auth-lander')
    .then(module => module.default)
})
const Signup = asyncComponent({
  moduleName: 'Signup',
  loader: () => import(/* webpackChunkName: 'signup' */ 'modules/auth/containers/auth-signup')
    .then(module => module.default)
})
const Login = asyncComponent({
  moduleName: 'Login',
  loader: () => import(/* webpackChunkName: 'login' */ 'modules/auth/containers/auth-login')
    .then(module => module.default)
})
const Account = asyncComponent({
  moduleName: 'Account',
  loader: () => import(/* webpackChunkName: 'account' */ 'modules/account/container')
    .then(module => module.default)
})
const Transactions = asyncComponent({
  moduleName: 'Transactions',
  loader: () => import(/* webpackChunkName: 'transactions' */ 'modules/transactions/container')
    .then(module => module.default)
})
const Market = asyncComponent({
  moduleName: 'Market',
  loader: () => import(/* webpackChunkName: 'market' */ 'modules/market/container')
    .then(module => module.default)
})
const Portfolio = asyncComponent({
  moduleName: 'Portfolio',
  loader: () => import(/* webpackChunkName: 'portfolio' */ 'modules/portfolio/containers/portfolio')
    .then(module => module.default)
})
const CreateMarket = asyncComponent({
  moduleName: 'CreateMarket',
  loader: () => import(/* webpackChunkName: 'create-market' */ 'modules/create-market/container')
    .then(module => module.default)
})
const StyleSandbox = asyncComponent({
  moduleName: 'StyleSandbox',
  loader: () => import(/* webpackChunkName: 'style-sandbox' */ 'modules/style-sandbox/components/style-sandbox/style-sandbox')
    .then(module => module.default)
})

const Routes = p => (
  <App>
    <Switch>
      <Route exact path={makePath(VIEWS.DEFAULT_VIEW)} component={Topics} />
      <Route path={makePath(VIEWS.MARKETS)} component={Markets} />
      <Route path={makePath(VIEWS.MARKET)} component={Market} />
      <Route path={makePath(VIEWS.AUTHENTICATION)} component={AuthLander} />
      <Route path={makePath(VIEWS.SIGNUP)} component={Signup} />
      <Route path={makePath(VIEWS.LOGIN)} component={Login} />
      <Route path={makePath(VIEWS.STYLE_SANDBOX)} component={StyleSandbox} />
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
)

export default Routes
