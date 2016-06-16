import React from 'react';
import { render } from 'react-dom';

import { MAKE, POSITIONS, TRANSACTIONS, M } from './modules/site/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from './modules/auth/constants/auth-types';

import MarketsPage from './modules/markets/components/markets-page';
import MarketPage from './modules/market/components/market-page';
import CreateMarketPage from './modules/create-market/components/create-market-page';
import AuthPage from './modules/auth/components/auth-page';
import PositionsPage from './modules/positions/components/positions-page';
import TransactionsPage from './modules/transactions/components/transactions-page';

import * as assertions from '../test/assertions/';

export default function (appElement, selectors) {
	const p = selectors;
	let node;

	p.siteHeader = {
		activePage: p.activePage,
		loginAccount: p.loginAccount,
		positionsSummary: p.marketsTotals.positionsSummary,
		transactionsTotals: p.transactionsTotals,
		isTransactionsWorking: p.isTransactionsWorking,
		marketsLink: p.links && p.links.marketsLink || undefined,
		positionsLink: p.links && p.links.positionsLink || undefined,
		transactionsLink: p.links && p.links.transactionsLink || undefined,
		authLink: p.links && p.links.authLink || undefined
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
				positionsSummary={p.marketsTotals.positionsSummary}
				markets={p.markets}
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
				sideOptions={p.sideOptions}
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
}

export { assertions };
