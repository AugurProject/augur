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
export const AuthLander = asyncComponent({
  moduleName: 'AuthLander',
  loader: () => import(/* webpackChunkName: 'auth' */ 'modules/auth/containers/auth-lander')
    .then(module => module.default)
})

export const Signup = asyncComponent({
  moduleName: 'Signup',
  loader: () => import(/* webpackChunkName: 'signup' */ 'modules/auth/containers/auth-signup')
    .then(module => module.default)
})

export const Login = asyncComponent({
  moduleName: 'Login',
  loader: () => import(/* webpackChunkName: 'login' */ 'modules/auth/containers/auth-login')
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

export const StyleSandbox = asyncComponent({
  moduleName: 'StyleSandbox',
  loader: () => import(/* webpackChunkName: 'style-sandbox' */ 'modules/style-sandbox/components/style-sandbox/style-sandbox')
    .then(module => module.default)
})
