import React from 'react';
import { render } from 'react-dom';

import { ACCOUNT, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/site/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from './modules/auth/constants/auth-types';

import MarketsPage from './modules/markets/components/markets-page';
import MarketPage from './modules/market/components/market-page';
import CreateMarketPage from './modules/create-market/components/create-market-page';
import AuthPage from './modules/auth/components/auth-page';
import AccountPage from './modules/account/components/account-page';
import PositionsPage from './modules/positions/components/positions-page';
import TransactionsPage from './modules/transactions/components/transactions-page';

export default function (appElement, selectors) {
	const p = selectors;
	const url = p.url;
	let node;

	p.siteHeader = {
		activePage: p.activePage,
		loginAccount: p.loginAccount,
		positionsSummary: p.positionsSummary,
		transactionsTotals: p.transactionsTotals,
		isTransactionsWorking: p.isTransactionsWorking,
		marketsLink: p.links && p.links.marketsLink || undefined,
		positionsLink: p.links && p.links.positionsLink || undefined,
		transactionsLink: p.links && p.links.transactionsLink || undefined,
		authLink: p.links && p.links.authLink || undefined,
		accountLink: p.links && p.links.accountLink || undefined,
		accountLinkText: p.loginAccount && p.loginAccount.linkText || undefined
	};

	switch (p.activePage) {
	case REGISTER:
	case LOGIN:
	case LOGOUT:
		node = (
			<AuthPage
				siteHeader={p.siteHeader}
				authForm={p.authForm}
			/>
		);
		break;

	case ACCOUNT:
		node = (
			<AccountPage
				siteHeader={p.siteHeader}
				account={p.loginAccount}
				onChangePass={p.loginAccount.onChangePass}
			/>
		);
		break;

	case MAKE:
		node = (
			<CreateMarketPage
				siteHeader={p.siteHeader}
				createMarketForm={p.createMarketForm}
			/>
		);
		break;

	case POSITIONS:
		node = (
			<PositionsPage
				siteHeader={p.siteHeader}
				positionsSummary={p.positionsSummary}
				positionsMarkets={p.positionsMarkets}
			/>
		);
		break;

	case TRANSACTIONS:
		node = (
			<TransactionsPage
				siteHeader={p.siteHeader}
				transactions={p.transactions}
				transactionsTotals={p.transactionsTotals}
			/>
		);
		break;

	case M:
		node = (
			<MarketPage
				siteHeader={p.siteHeader}
				selectedOutcome={p.selectedOutcome}
				market={p.market}
				numPendingReports={p.marketsTotals.numPendingReports}
			/>
		);
		break;

	default:
		node = (
			<MarketsPage
				siteHeader={p.siteHeader}
				createMarketLink={(p.links || {}).createMarketLink}
				keywords={p.keywords && p.keywords.value}
				onChangeKeywords={p.keywords && p.keywords.onChangeKeywords}
				markets={p.markets}
				marketsHeader={p.marketsHeader}
				favoriteMarkets={p.favoriteMarkets}
				filters={p.filters}
				pagination={p.pagination}
				selectedSort={p.searchSort.selectedSort}
				sortOptions={p.searchSort.sortOptions}
				onChangeSort={p.searchSort.onChangeSort}
			/>
		);
		break;
	}

	render(
		node,
		appElement
	);


	if (url !== window.location.pathname + window.location.search) {
		window.history.pushState(null, null, url);
		window.scrollTo(0, 0);
	}
}
