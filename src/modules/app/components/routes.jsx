import React from 'react';

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

const Routes = (p) => {
	let viewProps = null;

	switch (p.activeView) {
		case REGISTER:
		case LOGIN:
		case IMPORT:
		case LOGOUT: {
			viewProps = {
				authForm: p.authForm
			};

			return (
				<AuthView {...viewProps} />
			);
		}
		case ACCOUNT: {
			viewProps = {
				loginMessageLink: p.links.loginMessageLink,
				account: p.loginAccount,
				settings: p.settings,
				onUpdateSettings: p.loginAccount.onUpdateAccountSettings,
				onChangePass: p.loginAccount.onChangePass,
				authLink: (p.links && p.links.authLink) || null,
				onAirbitzManageAccount: p.loginAccount.onAirbitzManageAccount
			};

			return (
				<AccountView {...viewProps} />
			);
		}
		case TRANSACTIONS: {
			viewProps = {
				transactions: p.transactions,
				transactionsTotals: p.transactionsTotals
			};

			return (
				<TransactionsView {...viewProps} />
			);
		}
		case MY_POSITIONS:
		case MY_MARKETS:
		case MY_REPORTS: {
			viewProps = {
				activeView: p.activeView,
				settings: p.settings,
				...p.portfolio
			};

			return (
				<PortfolioView {...viewProps} />
			);
		}
		case LOGIN_MESSAGE: {
			viewProps = {
				marketsLink: (p.links && p.links.marketsLink) || null
			};

			return (
				<LoginMessageView {...viewProps} />
			);
		}
		case MAKE: {
			viewProps = {
				createMarketForm: p.createMarketForm
			};

			return (
				<CreateMarketView {...viewProps} />
			);
		}
		case M: {
			viewProps = {
				market: p.market,
				settings: p.settings,
				marketDataNavItems: p.marketDataNavItems,
				marketDataAge: p.marketDataAge,
				selectedOutcome: p.selectedOutcome,
				orderCancellation: p.orderCancellation,
				marketDataUpdater: p.marketDataUpdater,
				numPendingReports: p.marketsTotals.numPendingReports,
				isTradeCommitLocked: p.tradeCommitLock.isLocked
			};

			return (
				<MarketView {...viewProps} />
			);
		}
		default: {
			viewProps = {
				sideBarAllowed: true,
				loginAccount: p.loginAccount,
				createMarketLink: (p.links || {}).createMarketLink,
				markets: p.markets,
				marketsHeader: p.marketsHeader,
				favoriteMarkets: p.favoriteMarkets,
				pagination: p.pagination,
				filterSort: p.filterSort,
				keywords: p.keywords
			};

			return (
				<MarketsView {...viewProps} />
			);
		}
	}
};

export default Routes;
