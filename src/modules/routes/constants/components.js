import asyncComponent from 'modules/common/components/async-component'

// NOTE -- Webpack code splits at each of these imports to reduce the initial load time.

export const Categories = asyncComponent({
  moduleName: 'Categories',
  loader: () => import(/* webpackChunkName: 'categories' */ 'modules/categories/container')
    .then(module => module.default),
})

export const Markets = asyncComponent({
  moduleName: 'Markets',
  loader: () => import(/* webpackChunkName: 'markets' */ 'modules/markets/container')
    .then(module => module.default),
})

export const Account = asyncComponent({
  moduleName: 'Account',
  loader: () => import(/* webpackChunkName: 'account' */ 'modules/account/components/account-view/account-view')
    .then(module => module.default),
})

export const Auth = asyncComponent({
  moduleName: 'Auth',
  loader: () => import(/* webpackChunkName: 'auth' */ 'modules/auth/components/auth/auth')
    .then(module => module.default),
})

export const AuthLander = asyncComponent({
  moduleName: 'AuthLander',
  loader: () => import(/* webpackChunkName: 'auth-lander' */ 'modules/auth/containers/lander')
    .then(module => module.default),
})

export const AuthConnect = asyncComponent({
  moduleName: 'AuthConnect',
  loader: () => import(/* webpackChunkName: 'auth-connect' */ 'modules/auth/containers/connect')
    .then(module => module.default),
})

export const AuthCreate = asyncComponent({
  moduleName: 'AuthCreate',
  loader: () => import(/* webpackChunkName: 'auth-create' */ 'modules/auth/containers/create')
    .then(module => module.default),
})

export const Connect = asyncComponent({
  moduleName: 'Connect',
  loader: () => import(/* webpackChunkName: 'connect' */ 'modules/auth/containers/connect')
    .then(module => module.default),
})

export const Create = asyncComponent({
  moduleName: 'Create',
  loader: () => import(/* webpackChunkName: 'create' */ 'modules/auth/containers/create')
    .then(module => module.default),
})

export const Market = asyncComponent({
  moduleName: 'Market',
  loader: () => import(/* webpackChunkName: 'market' */ 'modules/market/containers/market-view')
    .then(module => module.default),
})

export const Portfolio = asyncComponent({
  moduleName: 'Portfolio',
  loader: () => import(/* webpackChunkName: 'portfolio' */ 'modules/portfolio/components/portfolio-view/portfolio-view')
    .then(module => module.default),
})

export const CreateMarket = asyncComponent({
  moduleName: 'CreateMarket',
  loader: () => import(/* webpackChunkName: 'create-market' */ 'modules/create-market/containers/create-market')
    .then(module => module.default),
})

export const Reporting = asyncComponent({
  moduleName: 'Reporting',
  loader: () => import(/* webpackChunkName: 'reporting' */ 'modules/reporting/components/reporting-view/reporting-view')
    .then(module => module.default),
})

export const Report = asyncComponent({
  moduleName: 'Report',
  loader: () => import(/* webpackChunkName: 'report' */ 'modules/reporting/containers/reporting-report')
    .then(module => module.default),
})

export const Dispute = asyncComponent({
  moduleName: 'Dispute',
  loader: () => import(/* webpackChunkName: 'report' */ 'modules/reporting/containers/reporting-dispute')
    .then(module => module.default),
})

export const MigrateRep = asyncComponent({
  moduleName: 'MigrateRep',
  loader: () => import(/* webpackChunkName: 'report' */ 'modules/forking/containers/migrate-rep')
    .then(module => module.default),
})
