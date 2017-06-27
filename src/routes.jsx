import React from 'react';
import { Route, Link } from 'react-router-dom';

import asyncComponent from 'modules/app/helpers/async-component';

import App from 'modules/app/components/app';

const Topics = asyncComponent({
  moduleName: 'Topics',
  loader: () => import(/* webpackChunkName: 'topics' */ 'modules/topics/container')
    .then(module => module.default)
});
const Markets = asyncComponent({
  moduleName: 'Markets',
  loader: () => import(/* webpackChunkName: 'markets' */ 'modules/markets/container')
    .then(module => module.default)
});

// import(/* webpackChunkName: [request] */ `${component}`)
//   .then(module => this.setState({ Component: module.default }))
//   .catch(err => asyncModuleLoadError(component, err));

// import PropTypes from 'prop-types';
// import { ACCOUNT, CREATE_MARKET, TRANSACTIONS, M, MARKETS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, AUTHENTICATION } from 'modules/app/constants/views';
// import { shouldComponentUpdateOnStateChangeOnly } from 'utils/should-component-update-pure';
//
// import Topics from 'modules/topics/container';

// NOTE --  the respective routes are imported within the switch statement so that
//          webpack can properly code split the views into independently loadable chunks
// export default class Routes extends Component {
//   static propTypes = {
//     activeView: PropTypes.oneOfType([
//       PropTypes.number,
//       PropTypes.string
//     ]).isRequired,
//     setSidebarAllowed: PropTypes.func.isRequired
//   };
//
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       currentView: null
//     };
//
//     this.shouldComponentUpdate = shouldComponentUpdateOnStateChangeOnly;
//     this.handleRouting = this.handleRouting.bind(this);
//   }
//
//   componentWillMount() {
//     this.handleRouting(this.props);
//   }
//
//   componentWillReceiveProps(nextProps) {
//     this.handleRouting(nextProps);
//   }
//
//   handleRouting(p) {
//     let activeView = p.activeView;
//     if (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10))) {
//       activeView = MARKETS;
//     }
//
//     if (activeView === MARKETS) {
//       p.setSidebarAllowed(true);
//     } else {
//       p.setSidebarAllowed(false);
//     }
//
//     // NOTE -- I personally hate the use of a 'magic comment' inside the import args, but it is what it is
//     switch (activeView) {
//       case AUTHENTICATION:
//         return import(/* webpackChunkName: 'auth' */ 'modules/auth/container')
//           .then(module => this.setState({ currentView: <module.default /> }))
//           .catch(err => asyncModuleLoadError('auth', err));
//       case ACCOUNT:
//         return import(/* webpackChunkName: 'account' */ 'modules/account/container')
//           .then(module => this.setState({ currentView: <module.default /> }))
//           .catch(err => asyncModuleLoadError('account', err));
//       case TRANSACTIONS:
//         return import(/* webpackChunkName: 'transactions' */ 'modules/transactions/container')
//           .then(module => this.setState({ currentView: <module.default /> }))
//           .catch(err => asyncModuleLoadError('transactions', err));
//       case MY_POSITIONS:
//       case MY_MARKETS:
//       case MY_REPORTS:
//         return import(/* webpackChunkName: 'portfolio' */ 'modules/portfolio/containers/portfolio')
//           .then(module => this.setState({ currentView: <module.default /> }))
//           .catch(err => asyncModuleLoadError('portfolio', err));
//       case CREATE_MARKET:
//         return import(/* webpackChunkName: 'create-market' */ 'modules/create-market/container')
//           .then(module => this.setState({ currentView: <module.default /> }))
//           .catch(err => asyncModuleLoadError('create-market', err));
//       case M:
//         return import(/* webpackChunkName: 'market' */ 'modules/market/container')
//           .then(module => this.setState({ currentView: <module.default /> }))
//           .catch(err => asyncModuleLoadError('market', err));
//       case MARKETS:
//         return import(/* webpackChunkName: 'markets' */ 'modules/markets/container')
//           .then(module => this.setState({ currentView: <module.default /> }))
//           .catch(err => asyncModuleLoadError('markets', err));
//       default:
//         return import(/* webpackChunkName: 'topics' */ 'modules/topics/container')
//           .then(module => this.setState({ currentView: <module.default /> }))
//           .catch(err => asyncModuleLoadError('topics', err));
//     }
//   }
//
//   render() {
//     return <Topics />
//   }
// }
//
// function asyncModuleLoadError(module, err) {
//   console.error(`ERROR: Failed to load '${module}' module -- `, err);
// }


// const Page1 = asyncComponent(() => import('./components/Page1')
//   .then(module => module.default), { name: 'Page 1' });

// <Route path="/page1" component={Page1} />

const test1 = () => (
  <div>
    <Link to="/markets">Markets</Link>
    <span>TEST 1</span>
  </div>
);

const test2 = () => (
  <div>
    <Link to="/">Topics</Link>
    <span>TEST 2</span>
  </div>
);

const Routes = () => (
  <App>
    <Route exact path="/" component={test1} />
    <Route path="/markets" component={test2} />
  </App>
);

export default Routes;
