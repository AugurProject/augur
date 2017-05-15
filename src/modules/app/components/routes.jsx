import React, { Component, PropTypes } from 'react';
import { ACCOUNT, CREATE_MARKET, TRANSACTIONS, M, MARKETS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, AUTHENTICATION } from 'modules/app/constants/views';
import { shouldComponentUpdateOnStateChangeOnly } from 'utils/should-component-update-pure';

import asyncComponent from 'modules/app/helpers/async-component';

import Account from 'modules/account/container';
import Authentication from 'modules/auth/container';
import Topics from 'modules/topics/container';

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
        import(/* webpackChunkName: 'auth' */ 'modules/auth/container').then((module) => {
          this.setState({ currentView: <module.default /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'auth' module -- `, err);
        });
        break;
      case ACCOUNT:
        import(/* webpackChunkName: 'account' */ 'modules/account/container').then((module) => {
          this.setState({ currentView: <module.default /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'account' module -- `, err);
        });
        break;
      case TRANSACTIONS:
        import(/* webpackChunkName: 'transactions' */ 'modules/transactions/container').then((module) => {
          this.setState({ viewComponent: <module.default isMobile={p.isMobile} /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'transactions' module -- `, err);
        });
        break;
      case MY_POSITIONS:
      case MY_MARKETS:
      case MY_REPORTS: {
        import(/* webpackChunkName: 'portfolio' */ 'modules/portfolio/containers/portfolio').then((module) => {
          this.setState({ currentView: <module.default /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'portfolio' module -- `, err);
        });
        break;
      }
      case CREATE_MARKET: {
        import(/* webpackChunkName: 'create-market' */ 'modules/create-market/container').then((module) => {
          this.setState({ currentView: <module.default footerHeight={p.footerHeight} /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'create-market' module -- `, err);
        });
        break;
      }
      case M: {
        import(/* webpackChunkName: 'market' */ 'modules/market/container').then((module) => {
          const viewProps = {
            selectedOutcome: p.selectedOutcome,
            marketReportingNavItems: p.marketReportingNavItems
          };
          this.setState({ currentView: <module.default {...viewProps} /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'market' module -- `, err);
        });
        break;
      }
      case MARKETS: {
        import(/* webpackChunkName: 'markets' */ 'modules/markets/container').then((module) => {
          this.setState({ currentView: <module.default /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'markets' module -- `, err);
        });
        p.setSidebarAllowed(true);
        break;
      }
      default: {
        import(/* webpackChunkName: 'topics' */ 'modules/topics/container').then((module) => {
          this.setState({ currentView: <module.default /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'topics' module -- `, err);
        });
      }
    }
  }

  render() {
    return this.state.currentView;
  }
}
