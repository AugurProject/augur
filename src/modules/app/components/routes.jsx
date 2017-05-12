import React, { Component, PropTypes } from 'react';
import { ACCOUNT, CREATE_MARKET, TRANSACTIONS, M, MARKETS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, AUTHENTICATION } from 'modules/app/constants/views';
import { shouldComponentUpdateOnStateChangeOnly } from 'utils/should-component-update-pure';

import Topics from 'modules/topics/container';
import Authentication from 'modules/auth/container';

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
      viewComponent: null
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
    let viewProps = {};
    let viewComponent;
    let currentView = p.activeView;

    if (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10))) {
      currentView = MARKETS;
    }

    p.setSidebarAllowed(false);

    switch (currentView) {
      case AUTHENTICATION:
        viewProps = {
          authLogin: p.authLogin,
          authAirbitz: p.authAirbitz,
          authSignup: p.authSignup,
          authImport: p.authImport,
          authNavItems: p.authNavItems
        };
        import(/* webpackChunkName: 'auth-view' */ 'modules/auth/components/auth-view').then((module) => {
          const AuthView = module.default;
          viewComponent = <AuthView {...viewProps} />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'auth' module -- `, err);
        });
        break;
      case ACCOUNT:
        import(/* webpackChunkName: 'account' */'modules/account/container').then((module) => {
          const AccountView = module.default;
          viewProps = {
            authLink: (p.links && p.links.authLink) || null
          };
          viewComponent = <AccountView {...viewProps} />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'account' module -- `, err);
        });
        break;
      case TRANSACTIONS:
        import(/* webpackChunkName: 'transactions' */ 'modules/transactions/container').then((module) => {
          const TransactionsView = module.default;
          viewProps = {
            isMobile: p.isMobile
          };
          this.setState({ viewComponent: <TransactionsView {...viewProps} /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'transactions' module -- `, err);
        });
        break;
      case MY_POSITIONS:
      case MY_MARKETS:
      case MY_REPORTS: {
        import(/* webpackChunkName: 'portfolio' */ 'modules/portfolio/containers/portfolio').then((module) => {
          const PortfolioView = module.default;
          viewComponent = <PortfolioView />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'portfolio' module -- `, err);
        });
        break;
      }
      case CREATE_MARKET: {
        import(/* webpackChunkName: 'create-market' */ 'modules/create-market/container').then((module) => {
          const CreateMarketView = module.default;

          viewProps = { // Global state props handled via react-redux in the create-market container
            footerHeight: p.footerHeight
          };

          viewComponent = <CreateMarketView {...viewProps} />;

          this.setState({ viewProps, viewComponent });
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
          this.setState({ viewProps, viewComponent: <module.default {...viewProps} /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'market' module -- `, err);
        });
        break;
      }
      case MARKETS: {
        import(/* webpackChunkName: 'markets' */ 'modules/markets/container').then((module) => {
          this.setState({ viewComponent: <module.default /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'markets' module -- `, err);
        });
        p.setSidebarAllowed(true);
        break;
      }
      default: {
        this.setState({ viewComponent: <Topics /> });
        import(/* webpackChunkName: 'topics' */ 'modules/topics/container').then((module) => {
          this.setState({ viewComponent: <module.default /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'topics' module -- `, err);
        });
      }
    }
  }

  render() {
    const p = this.props;

    let currentView = p.activeView;
    if (!!parseInt(p.activeView, 10) && Number.isInteger(parseInt(p.activeView, 10))) { // TODO -- markets pagination should really be component level state
      currentView = MARKETS;
    }

    switch (currentView) {
      case AUTHENTICATION:
        return <Authentication />;
      default:
        return <Topics />;
    }
  }
}
