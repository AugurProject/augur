import React, { Component } from 'react';

import { ACCOUNT, CREATE_MARKET, TRANSACTIONS, M, MARKETS, MY_POSITIONS, MY_MARKETS, MY_REPORTS, LOGIN_MESSAGE, AUTHENTICATION } from 'modules/app/constants/views';

import getValue from 'utils/get-value';
import { shouldComponentUpdateOnStateChangeOnly } from 'utils/should-component-update-pure';

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
        viewProps = {
          loginMessageLink: p.links.loginMessageLink,
          account: p.loginAccount,
          onChangePass: p.loginAccount.onChangePass,
          authLink: (p.links && p.links.authLink) || null,
          onAirbitzManageAccount: p.loginAccount.onAirbitzManageAccount
        };
        import('modules/account/components/account-view').then((module) => {
          const AccountView = module.default;
          viewComponent = <AccountView {...viewProps} />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'account' module -- `, err);
        });
        break;
      case TRANSACTIONS:
        import('modules/transactions/container').then((module) => {
          const TransactionsView = module.default;
          viewProps = {}; // Global state props handled via react-redux in the transactions container
          viewComponent = <TransactionsView />;
          this.setState({ viewProps, viewComponent });
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
      case LOGIN_MESSAGE: {
        viewProps = {
          topicsLink: (p.links && p.links.topicsLink) || null
        };
        import('modules/login-message/components/login-message-view').then((module) => {
          const LoginMessageView = module.default;
          viewComponent = <LoginMessageView {...viewProps} />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'login-message' module -- `, err);
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
      case M: {
        viewProps = {
          logged: getValue(p, 'loginAccount.address'),
          market: p.market,
          marketDataNavItems: p.marketDataNavItems,
          marketUserDataNavItems: p.marketUserDataNavItems,
          selectedOutcome: p.selectedOutcome,
          orderCancellation: p.orderCancellation,
          numPendingReports: p.marketsTotals.numPendingReports,
          isTradeCommitLocked: p.tradeCommitLock.isLocked,
          scalarShareDenomination: p.scalarShareDenomination,
          marketReportingNavItems: p.marketReportingNavItems,
          outcomeTradeNavItems: p.outcomeTradeNavItems,
          closePositionStatus: p.closePositionStatus,
          branch: p.branch
        };
        import('modules/market/components/market-view').then((module) => {
          const MarketView = module.default;
          viewComponent = <MarketView {...viewProps} />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'market' module -- `, err);
        });
        break;
      }
      case MARKETS: {
        viewProps = {
          loginAccount: p.loginAccount,
          createMarketLink: (p.links || {}).createMarketLink,
          markets: p.markets,
          marketsHeader: p.marketsHeader,
          favoriteMarkets: p.favoriteMarkets,
          pagination: p.pagination,
          filterSort: p.filterSort,
          keywords: p.keywords,
          branch: p.branch,
          scalarShareDenomination: p.scalarShareDenomination
        };
        import('modules/markets/components/markets-view').then((module) => {
          const MarketsView = module.default;
          viewComponent = <MarketsView {...viewProps} />;
          this.setState({ viewProps, viewComponent });
        }).catch((err) => {
          console.error(`ERROR: Failed to load 'markets' module -- `, err);
        });

        p.setSidebarAllowed(true);

        break;
      }
      default: {
        viewProps = {
          topics: getValue(p, 'topics.topics'),
          selectTopic: getValue(p, 'topics.selectTopic'),
          loginAccount: p.loginAccount,
          createMarketLink: (p.links || {}).createMarketLink,
          branch: p.branch,
        };
        import('modules/topics/components/topics-view').then((module) => {
          const TopicsView = module.default;
          viewComponent = <TopicsView {...viewProps} />;
          this.setState({ viewProps, viewComponent });
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
