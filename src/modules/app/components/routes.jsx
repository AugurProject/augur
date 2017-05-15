import React, { Component, PropTypes } from 'react';
import { ACCOUNT, CREATE_MARKET, TRANSACTIONS, M, MARKETS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, AUTHENTICATION } from 'modules/app/constants/views';
import { shouldComponentUpdateOnStateChangeOnly } from 'utils/should-component-update-pure';

// NOTE --  the respective routes are imported within the switch statement so that
//          webpack can properly code split the views
export default class Routes extends Component {
  static propTypes = {
    activeView: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      currentView: null
    };

    this.shouldComponentUpdate = shouldComponentUpdateOnStateChangeOnly;
    this.handleRouting = this.handleRouting.bind(this);
  }

  componentWillMount() {
    this.handleRouting(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.activeView !== nextProps.activeView) this.handleRouting(nextProps);
  }

  handleRouting(p) {
    let activeView = p.activeView;
    if (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10))) {
      activeView = MARKETS;
    }

    p.setSidebarAllowed(false);

    switch (activeView) {
      case AUTHENTICATION:
        return import(/* webpackChunkName: 'auth' */ 'modules/auth/container')
          .then((module) => {
            this.setState({ currentView: <module.default /> });
          })
          .catch(err => asyncModuleLoadError('auth', err));
      case ACCOUNT:
        return import(/* webpackChunkName: 'account' */ 'modules/account/container')
          .then((module) => {
            this.setState({ currentView: <module.default authLink={(p.links && p.links.authLink) || null} /> });
          })
          .catch(err => asyncModuleLoadError('account', err));
      case TRANSACTIONS:
        return import(/* webpackChunkName: 'transactions' */ 'modules/transactions/container')
          .then((module) => {
            this.setState({ currentView: <module.default isMobile={p.isMobile} /> });
          })
          .catch(err => asyncModuleLoadError('transactions', err));
      case MY_POSITIONS:
      case MY_MARKETS:
      case MY_REPORTS:
        return import(/* webpackChunkName: 'portfolio' */ 'modules/portfolio/containers/portfolio')
          .then((module) => {
            this.setState({ currentView: <module.default /> });
          })
          .catch(err => asyncModuleLoadError('portfolio', err));
      case CREATE_MARKET:
        return import(/* webpackChunkName: 'create-market' */ 'modules/create-market/container')
          .then(module => this.setState({ currentView: <module.default footerHeight={p.footerHeight} /> }))
          .catch(err => asyncModuleLoadError('create-market', err));
      case M:
        return import(/* webpackChunkName: 'market' */ 'modules/market/container')
          .then((module) => {
            const viewProps = {
              selectedOutcome: p.selectedOutcome,
              marketReportingNavItems: p.marketReportingNavItems
            };
            this.setState({ currentView: <module.default {...viewProps} /> });
          })
          .catch(err => asyncModuleLoadError('market', err));
      case MARKETS: {
        p.setSidebarAllowed(true);

        return import(/* webpackChunkName: 'markets' */ 'modules/markets/container')
          .then((module) => {
            this.setState({ currentView: <module.default /> });
          })
          .catch(err => asyncModuleLoadError('markets', err));
      }
      default:
        return import(/* webpackChunkName: 'topics' */ 'modules/topics/container')
          .then((module) => {
            this.setState({ currentView: <module.default /> });
          })
          .catch(err => asyncModuleLoadError('topics', err));
    }
  }

  render() {
    return this.state.currentView;
  }
}

function asyncModuleLoadError(module, err) {
  console.error(`ERROR: Failed to load '${module}' module -- `, err);
}
