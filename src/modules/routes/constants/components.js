import asyncComponent from 'modules/common/components/async-component'

// NOTE -- Webpack code splits at each of these imports to reduce the initial load time.

export const Topics = asyncComponent({
  moduleName: 'Topics',
  loader: () => import(/* webpackChunkName: 'topics' */ 'modules/topics/container')
    .then(module => module.default)
})

export const Markets = asyncComponent({
  moduleName: 'Markets',
  loader: () => import(/* webpackChunkName: 'markets' */ 'modules/markets/container')
    .then(module => module.default)
})

export const Auth = asyncComponent({
  moduleName: 'Auth',
  loader: () => import(/* webpackChunkName: 'auth' */ 'modules/auth/components/auth/auth')
    .then(module => module.default)
})

export const AuthLander = asyncComponent({
  moduleName: 'AuthLander',
  loader: () => import(/* webpackChunkName: 'auth-lander' */ 'modules/auth/containers/lander')
    .then(module => module.default)
})

export const AuthConnect = asyncComponent({
  moduleName: 'AuthConnect',
  loader: () => import(/* webpackChunkName: 'auth-connect' */ 'modules/auth/containers/connect')
    .then(module => module.default)
})

export const AuthCreate = asyncComponent({
  moduleName: 'AuthCreate',
  loader: () => import(/* webpackChunkName: 'auth-create' */ 'modules/auth/containers/create')
    .then(module => module.default)
})

export const Connect = asyncComponent({
  moduleName: 'Connect',
  loader: () => import(/* webpackChunkName: 'connect' */ 'modules/auth/containers/connect')
    .then(module => module.default)
})

export const Create = asyncComponent({
  moduleName: 'Create',
  loader: () => import(/* webpackChunkName: 'create' */ 'modules/auth/containers/create')
    .then(module => module.default)
})

export const Account = asyncComponent({
  moduleName: 'Account',
  loader: () => import(/* webpackChunkName: 'account' */ 'modules/account/container')
    .then(module => module.default)
})

export const Transactions = asyncComponent({
  moduleName: 'Transactions',
  loader: () => import(/* webpackChunkName: 'transactions' */ 'modules/transactions/container')
    .then(module => module.default)
})

export const Market = asyncComponent({
  moduleName: 'Market',
  loader: () => import(/* webpackChunkName: 'market' */ 'modules/market/container')
    .then(module => module.default)
})

export const Portfolio = asyncComponent({
  moduleName: 'Portfolio',
  loader: () => import(/* webpackChunkName: 'portfolio' */ 'modules/portfolio/containers/portfolio')
    .then(module => module.default)
})

export const CreateMarket = asyncComponent({
  moduleName: 'CreateMarket',
  loader: () => import(/* webpackChunkName: 'create-market' */ 'modules/create-market/container')
    .then(module => module.default)
})
