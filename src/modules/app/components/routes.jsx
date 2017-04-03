import React, { Component } from 'react';

import { ACCOUNT, CREATE_MARKET, TRANSACTIONS, M, MARKETS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, AUTHENTICATION } from 'modules/app/constants/views';

import { shouldComponentUpdateOnStateChangeOnly } from 'utils/should-component-update-pure';
import getValue from 'utils/get-value';

// NOTE --  the respective routes are imported within the switch statement so that
//          webpack can properly code split the views
export default class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewProps: null,
      viewComponent: null
    };

    this.shouldComponentUpdate = shouldComponentUpdateOnStateChangeOnly;
    this.handleRouting = this.handleRouting.bind(this);
  }

  componentWillMount() {
    this.handleRouting(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleRouting(nextProps);
  }

  handleRouting(p) {
    let viewProps;
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
        import('modules/auth/components/auth-view').then((module) => {
          const AuthView = module.default;
          viewComponent = <AuthView {...viewProps} />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'auth' module -- `, err);
        });
        break;
      case ACCOUNT:
        import('modules/account/container').then((module) => {
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
        import('modules/transactions/container').then((module) => {
          const TransactionsView = module.default;
          this.setState({ viewComponent: <TransactionsView /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'transactions' module -- `, err);
        });
        break;
      case MY_POSITIONS:
      case MY_MARKETS:
      case MY_REPORTS: {
        import('modules/portfolio/containers/portfolio').then((module) => {
          const PortfolioView = module.default;
          viewProps = {}; // Global state props handled via react-redux in the portfolio container
          viewComponent = <PortfolioView />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'portfolio' module -- `, err);
        });
        break;
      }
      case CREATE_MARKET: {
        import('modules/create-market/container').then((module) => {
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
      // case M: {
      //   viewProps = {
      //     logged: getValue(p, 'loginAccount.address'),
      //     market: p.market,
      //     marketDataNavItems: p.marketDataNavItems,
      //     marketUserDataNavItems: p.marketUserDataNavItems,
      //     selectedOutcome: p.selectedOutcome,
      //     orderCancellation: p.orderCancellation,
      //     numPendingReports: p.marketsTotals.numPendingReports,
      //     isTradeCommitLocked: p.tradeCommitLock.isLocked,
      //     scalarShareDenomination: p.scalarShareDenomination,
      //     marketReportingNavItems: p.marketReportingNavItems,
      //     outcomeTradeNavItems: p.outcomeTradeNavItems,
      //     closePositionStatus: p.closePositionStatus,
      //     branch: p.branch
      //   };
      //   import('modules/market/components/market-view').then((module) => {
      //     const MarketView = module.default;
      //     viewComponent = <MarketView {...viewProps} />;
      //     this.setState({ viewProps, viewComponent });
      //   }).catch((err) => {
      //     console.error(`ERROR: Failed to load 'market' module -- `, err);
      //   });
      //   break;
      // }
      case M: {
        import('modules/market/container').then((module) => {
          const MarketView = module.default;
          const viewProps = {
            market: p.market,
            selectedOutcome: p.selectedOutcome,
            marketReportingNavItems: p.marketReportingNavItems
          };
          this.setState({ viewProps, viewComponent: <MarketView {...viewProps} /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'market' module -- `, err);
        });
        break;
      }
      case MARKETS: {
        // viewProps = {
        //   loginAccount: p.loginAccount,
        //   createMarketLink: (p.links || {}).createMarketLink,
        //   markets: p.markets,
        //   marketsHeader: p.marketsHeader,
        //   favoriteMarkets: p.favoriteMarkets,
        //   pagination: p.pagination,
        //   filterSort: p.filterSort,
        //   keywords: p.keywords,
        //   branch: p.branch,
        //   scalarShareDenomination: p.scalarShareDenomination
        // };
        import('modules/markets/container').then((module) => {
          const MarketsView = module.default;
          this.setState({ viewComponent: <MarketsView /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'markets' module -- `, err);
        });
        p.setSidebarAllowed(true);
        break;
      }
      default: {
        import('modules/topics/container').then((module) => {
          const TopicsView = module.default;
          this.setState({ viewComponent: <TopicsView /> });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'topics' module -- `, err);
        });
      }
    }
  }

  render() {
    const s = this.state;

    return s.viewComponent;
  }
}
