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
			viewComponent: null,
			logged: getValue(this.props, 'loginAccount.address')
		};

		this.shouldComponentUpdate = shouldComponentUpdateOnStateChangeOnly;
	}

	componentWillReceiveProps(nextProps) {
		let viewProps;
		let viewComponent;

		switch (nextProps.activeView) {
			case REGISTER:
			case LOGIN:
			case IMPORT:
			case LOGOUT:
				viewProps = {
					authForm: nextProps.authForm
				};
				viewComponent = <AuthView {...viewProps} />;
				break;
			case ACCOUNT:
				viewProps = {
					loginMessageLink: nextProps.links.loginMessageLink,
					account: nextProps.loginAccount,
					settings: nextProps.settings,
					onUpdateSettings: nextProps.loginAccount.onUpdateAccountSettings,
					onChangePass: nextProps.loginAccount.onChangePass,
					authLink: (nextProps.links && nextProps.links.authLink) || null,
					onAirbitzManageAccount: nextProps.loginAccount.onAirbitzManageAccount
				};
				viewComponent = <AccountView {...viewProps} />;
				break;
			case TRANSACTIONS:
				viewProps = {
					transactions: nextProps.transactions,
					transactionsTotals: nextProps.transactionsTotals
				};
				viewComponent =	<TransactionsView {...viewProps} />;
				break;
			case MY_POSITIONS:
			case MY_MARKETS:
			case MY_REPORTS: {
				viewProps = {
					activeView: nextProps.activeView,
					settings: nextProps.settings,
					branch: nextProps.branch,
					...nextProps.portfolio
				};
				viewComponent = <PortfolioView {...viewProps} />;
				break;
			}
			case LOGIN_MESSAGE: {
				viewProps = {
					marketsLink: (nextProps.links && nextProps.links.marketsLink) || null
				};
				viewComponent = <LoginMessageView {...viewProps} />;
				break;
			}
			case MAKE: {
				viewProps = {
					createMarketForm: nextProps.createMarketForm
				};
				viewComponent = <CreateMarketView {...viewProps} />;
				break;
			}
			case M: {
				viewProps = {
					logged: this.state.logged,
					market: nextProps.market,
					settings: nextProps.settings,
					marketDataNavItems: nextProps.marketDataNavItems,
					marketUserDataNavItems: nextProps.marketUserDataNavItems,
					marketDataAge: nextProps.marketDataAge,
					selectedOutcome: nextProps.selectedOutcome,
					orderCancellation: nextProps.orderCancellation,
					marketDataUpdater: nextProps.marketDataUpdater,
					numPendingReports: nextProps.marketsTotals.numPendingReports,
					isTradeCommitLocked: nextProps.tradeCommitLock.isLocked,
					scalarShareDenomination: nextProps.scalarShareDenomination,
					marketReportingNavItems: nextProps.marketReportingNavItems
				};
				viewComponent = <MarketView {...viewProps} />;
				break;
			}
			default: {
				viewProps = {
					isSideBarAllowed: true,
					loginAccount: nextProps.loginAccount,
					createMarketLink: (nextProps.links || {}).createMarketLink,
					markets: nextProps.markets,
					marketsHeader: nextProps.marketsHeader,
					favoriteMarkets: nextProps.favoriteMarkets,
					pagination: nextProps.pagination,
					filterSort: nextProps.filterSort,
					keywords: nextProps.keywords,
					branch: nextProps.branch
				};
				viewComponent = <MarketsView {...viewProps} />;
			}
		}

		if (viewProps.isSideBarAllowed) {
			nextProps.setSidebarAllowed(true);
		} else {
			nextProps.setSidebarAllowed(false);
		}

		this.setState({ viewProps, viewComponent });
	}

	render() {
		const s = this.state;

		return <div>{s.viewComponent}</div>;
	}
}
