import React, { Component } from 'react';

import MarketsView from 'modules/markets/components/markets-view';
import MarketView from 'modules/market/components/market-view';
import CreateMarketView from 'modules/create-market/components/create-market-view';
import AuthView from 'modules/auth/components/auth-view';
import AccountView from 'modules/account/components/account-view';
import PortfolioView from 'modules/portfolio/components/portfolio-view';
import TransactionsView from 'modules/transactions/components/transactions-view';
import LoginMessageView from 'modules/login-message/components/login-message-view';

import { ACCOUNT, MAKE, TRANSACTIONS, M, MY_POSITIONS, MY_MARKETS, MY_REPORTS, LOGIN_MESSAGE } from 'modules/app/constants/views';
import { REGISTER, LOGIN, LOGOUT, IMPORT } from 'modules/auth/constants/auth-types';

import getValue from 'utils/get-value';
import { shouldComponentUpdateOnStateChangeOnly } from 'utils/should-component-update-pure';

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
				viewComponent = <AuthView {...viewProps} />;
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
				viewComponent = <AccountView {...viewProps} />;
				break;
			case TRANSACTIONS:
				viewProps = {
					transactions: p.transactions,
					transactionsTotals: p.transactionsTotals
				};
				viewComponent =	<TransactionsView {...viewProps} />;
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
				viewComponent = <PortfolioView {...viewProps} />;
				break;
			}
			case LOGIN_MESSAGE: {
				viewProps = {
					marketsLink: (p.links && p.links.marketsLink) || null
				};
				viewComponent = <LoginMessageView {...viewProps} />;
				break;
			}
			case MAKE: {
				viewProps = {
					createMarketForm: p.createMarketForm,
					scalarShareDenomination: p.scalarShareDenomination
				};
				viewComponent = <CreateMarketView {...viewProps} />;
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
					marketReportingNavItems: p.marketReportingNavItems
				};
				viewComponent = <MarketView {...viewProps} />;
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
					branch: p.branch
				};
				viewComponent = <MarketsView {...viewProps} />;
			}
		}

		if (viewProps.isSideBarAllowed) {
			p.setSidebarAllowed(true);
		} else {
			p.setSidebarAllowed(false);
		}

		this.setState({ viewProps, viewComponent });
	}

	render() {
		const s = this.state;

		return <div>{s.viewComponent}</div>;
	}
}
