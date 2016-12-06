import React, { Component } from 'react';

import { ACCOUNT, MAKE, TRANSACTIONS, M, MY_POSITIONS, MY_MARKETS, MY_REPORTS, LOGIN_MESSAGE } from 'modules/app/constants/views';
import { REGISTER, LOGIN, LOGOUT, IMPORT } from 'modules/auth/constants/auth-types';

import getValue from 'utils/get-value';
import { shouldComponentUpdateOnStateChangeOnly } from 'utils/should-component-update-pure';

// NOTE -- 	the respective routes are imported within the switch statement so that
//					webpack can properly code split the views
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

		switch (p.activeView) {
			case REGISTER:
			case LOGIN:
			case IMPORT:
			case LOGOUT:
				viewProps = {
					authForm: p.authForm
				};
				System.import('modules/auth/components/auth-view').then((module) => {
					const AuthView = module.default;
					viewComponent = <AuthView {...viewProps} />;
					this.setState({ viewProps, viewComponent });
				});
				break;
			case ACCOUNT:
				viewProps = {
					loginMessageLink: p.links.loginMessageLink,
					account: p.loginAccount,
					settings: p.settings,
					onUpdateSettings: p.loginAccount.onUpdateAccountSettings,
					onChangePass: p.loginAccount.onChangePass,
					authLink: (p.links && p.links.authLink) || null,
					onAirbitzManageAccount: p.loginAccount.onAirbitzManageAccount
				};
				System.import('modules/account/components/account-view').then((module) => {
					const AccountView = module.default;
					viewComponent = <AccountView {...viewProps} />;
					this.setState({ viewProps, viewComponent });
				});
				break;
			case TRANSACTIONS:
				viewProps = {
					transactions: p.transactions,
					transactionsTotals: p.transactionsTotals
				};
				System.import('modules/transactions/components/transactions-view').then((module) => {
					const TransactionsView = module.default;
					viewComponent =	<TransactionsView {...viewProps} />;
					this.setState({ viewProps, viewComponent });
				});
				break;
			case MY_POSITIONS:
			case MY_MARKETS:
			case MY_REPORTS: {
				viewProps = {
					activeView: p.activeView,
					settings: p.settings,
					branch: p.branch,
					...p.portfolio
				};
				System.import('modules/portfolio/components/portfolio-view').then((module) => {
					const PortfolioView = module.default;
					viewComponent = <PortfolioView {...viewProps} />;
					this.setState({ viewProps, viewComponent });
				});
				break;
			}
			case LOGIN_MESSAGE: {
				viewProps = {
					marketsLink: (p.links && p.links.marketsLink) || null
				};
				System.import('modules/login-message/components/login-message-view').then((module) => {
					const LoginMessageView = module.default;
					viewComponent = <LoginMessageView {...viewProps} />;
					this.setState({ viewProps, viewComponent });
				});
				break;
			}
			case MAKE: {
				viewProps = {
					createMarketForm: p.createMarketForm,
					scalarShareDenomination: p.scalarShareDenomination
				};
				System.import('modules/create-market/components/create-market-view').then((module) => {
					const CreateMarketView = module.default;
					viewComponent = <CreateMarketView {...viewProps} />;

					this.setState({ viewProps, viewComponent });
				});
				break;
			}
			case M: {
				viewProps = {
					logged: getValue(p, 'loginAccount.address'),
					market: p.market,
					settings: p.settings,
					marketDataNavItems: p.marketDataNavItems,
					marketUserDataNavItems: p.marketUserDataNavItems,
					marketDataAge: p.marketDataAge,
					selectedOutcome: p.selectedOutcome,
					orderCancellation: p.orderCancellation,
					marketDataUpdater: p.marketDataUpdater,
					numPendingReports: p.marketsTotals.numPendingReports,
					isTradeCommitLocked: p.tradeCommitLock.isLocked,
					scalarShareDenomination: p.scalarShareDenomination,
					marketReportingNavItems: p.marketReportingNavItems,
					outcomeTradeNavItems: p.outcomeTradeNavItems
				};
				System.import('modules/market/components/market-view').then((module) => {
					const MarketView = module.default;
					viewComponent = <MarketView {...viewProps} />;

					this.setState({ viewProps, viewComponent });
				});
				break;
			}
			default: {
				viewProps = {
					isSideBarAllowed: true,
					loginAccount: p.loginAccount,
					createMarketLink: (p.links || {}).createMarketLink,
					markets: p.markets,
					marketsHeader: p.marketsHeader,
					favoriteMarkets: p.favoriteMarkets,
					pagination: p.pagination,
					filterSort: p.filterSort,
					keywords: p.keywords,
					branch: p.branch,
					scalarShareDenomination: p.scalarShareDenomination,
				};
				System.import('modules/markets/components/markets-view').then((module) => {
					const MarketsView = module.default;
					viewComponent = <MarketsView {...viewProps} />;

					this.setState({ viewProps, viewComponent });
				});
			}
		}

		if (viewProps.isSideBarAllowed) {
			p.setSidebarAllowed(true);
		} else {
			p.setSidebarAllowed(false);
		}
	}

	render() {
		const s = this.state;

		return <div>{s.viewComponent}</div>;
	}
}
