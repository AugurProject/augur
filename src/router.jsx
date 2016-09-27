import React, { Component } from 'react';

// 	Components
//		Global
import SiteHeader from './modules/site/components/site-header';
import SiteFooter from './modules/site/components/site-footer';
//		Views
import MarketsPage from './modules/markets/components/markets-page';
import MarketPage from './modules/market/components/market-page';
import CreateMarketPage from './modules/create-market/components/create-market-page';
import AuthPage from './modules/auth/components/auth-page';
import AccountPage from './modules/account/components/account-page';
import PortfolioPage from './modules/portfolio/components/portfolio-page';
import TransactionsPage from './modules/transactions/components/transactions-page';
import LoginMessagePage from './modules/login-message/components/login-message-page';

//	Constants
import { ACCOUNT, MAKE, TRANSACTIONS, M, MY_POSITIONS, MY_MARKETS, MY_REPORTS, LOGIN_MESSAGE } from './modules/site/constants/pages';
import { REGISTER, LOGIN, LOGOUT, IMPORT } from './modules/auth/constants/auth-types';

//	Utils
import shouldComponentUpdatePure from './utils/should-component-update-pure';

export default class Router extends Component {
	constructor(props) {
		super(props);

		this.shouldComponentUpdate = shouldComponentUpdatePure;
	}

	currentRoute() {
		let node;

		const p = this.props;

		switch (p.activePage) {
		case REGISTER:
		case LOGIN:
		case IMPORT:
		case LOGOUT:
			node = (
				<AuthPage authForm={p.authForm} />
			);
			break;

		case ACCOUNT:
			node = (
				<AccountPage
					loginMessageLink={p.links.loginMessageLink}
					account={p.loginAccount}
					onChangePass={p.loginAccount.onChangePass}
				/>
			);
			break;

		case MAKE:
			node = (
				<CreateMarketPage createMarketForm={p.createMarketForm} />
			);
			break;

		case TRANSACTIONS:
			node = (
				<TransactionsPage
					transactions={p.transactions}
					transactionsTotals={p.transactionsTotals}
				/>
			);
			break;

		case M:
			node = (
				<MarketPage
					marketDataAge={p.marketDataAge}
					selectedOutcome={p.selectedOutcome}
					orderCancellation={p.orderCancellation}
					marketDataUpdater={p.marketDataUpdater}
					market={p.market}
					numPendingReports={p.marketsTotals.numPendingReports}
					isTradeCommitLocked={p.tradeCommitLock.isLocked}

				/>
			);
			break;

		case MY_POSITIONS:
		case MY_MARKETS:
		case MY_REPORTS:
			node = (
				<PortfolioPage
					{...p.portfolio}
					activePage={p.activePage}
				/>
			);
			break;

		case LOGIN_MESSAGE:
			node = (
				<LoginMessagePage />
			);
			break;
		default:
			node = (
				<MarketsPage
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
					loginAccount={p.loginAccount}
				/>
			);
			break;
		}

		return node;
	}

	render() {
		const p = this.props;
		const siteHeader = {
			activePage: p.activePage,
			loginAccount: p.loginAccount,
			positionsSummary: p.positionsSummary,
			transactionsTotals: p.transactionsTotals,
			isTransactionsWorking: p.isTransactionsWorking,
			marketsLink: p.links && p.links.marketsLink || undefined,
			transactionsLink: p.links && p.links.transactionsLink || undefined,
			authLink: p.links && p.links.authLink || undefined,
			accountLink: p.links && p.links.accountLink || undefined,
			accountLinkText: p.loginAccount && p.loginAccount.linkText || undefined,
			myPositionsLink: p.links && p.links.myPositionsLink || undefined,
			portfolioTotals: p.portfolio && p.portfolio.totals || undefined
		};

		return (
			<div>
				{!!p &&
					<div>
						<SiteHeader {...siteHeader} />
						<div className="page-container">
							{this.currentRoute()}
						</div>
						<SiteFooter />
					</div>
				}
			</div>
		);
	}
}
