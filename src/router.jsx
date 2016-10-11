import React, { Component } from 'react';

import SiteHeader from './modules/site/components/site-header';
import SiteFooter from './modules/site/components/site-footer';
import SideBar from './modules/site/components/side-bar';
import MarketsView from './modules/markets/components/markets-view';
import MarketPage from './modules/market/components/market-page';
import CreateMarketPage from './modules/create-market/components/create-market-page';
import AuthPage from './modules/auth/components/auth-page';
import AccountPage from './modules/account/components/account-page';
import PortfolioView from './modules/portfolio/components/portfolio-view';
import TransactionsPage from './modules/transactions/components/transactions-page';
import LoginMessagePage from './modules/login-message/components/login-message-page';
import CoreStats from './modules/common/components/core-stats';

import { ACCOUNT, MAKE, TRANSACTIONS, M, MY_POSITIONS, MY_MARKETS, MY_REPORTS, LOGIN_MESSAGE, MARKETS } from './modules/site/constants/views';
import { REGISTER, LOGIN, LOGOUT, IMPORT } from './modules/auth/constants/auth-types';

import shouldComponentUpdatePure from './utils/should-component-update-pure';

export default class Router extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSideBarVisible: false
		};

		this.shouldComponentUpdate = shouldComponentUpdatePure;

		this.currentRoute = this.currentRoute.bind(this);
		this.shouldDisplaySideBar = this.shouldDisplaySideBar.bind(this);
	}

	componentDidMount() {
		this.shouldDisplaySideBar();
	}

	componentDidUpdate() {
		this.shouldDisplaySideBar();
	}

	shouldDisplaySideBar() {
		const currentRoute = this.currentRoute();

		if (currentRoute.props.name === MARKETS) {
			this.setState({ isSideBarVisible: true });
		} else {
			this.setState({ isSideBarVisible: false });
		}
	}

	currentRoute(routeProps) {
		const p = {
			...this.props,
			...routeProps
		};

		switch (p.activeView) {
		case REGISTER:
		case LOGIN:
		case IMPORT:
		case LOGOUT:
			return (
				<AuthPage
					className={p.className}
					authForm={p.authForm}
				/>
			);
		case ACCOUNT:
			return (
				<AccountPage
					className={p.className}
					loginMessageLink={p.links.loginMessageLink}
					account={p.loginAccount}
					onChangePass={p.loginAccount.onChangePass}
					authLink={(p.links && p.links.authLink) || null}
				/>
			);
		case MAKE:
			return (
				<CreateMarketPage
					className={p.className}
					createMarketForm={p.createMarketForm}
				/>
			);
		case TRANSACTIONS:
			return (
				<TransactionsPage
					className={p.className}
					transactions={p.transactions}
					transactionsTotals={p.transactionsTotals}
				/>
			);
		case M:
			return (
				<MarketPage
					className={p.className}
					market={p.market}
					marketDataAge={p.marketDataAge}
					selectedOutcome={p.selectedOutcome}
					orderCancellation={p.orderCancellation}
					marketDataUpdater={p.marketDataUpdater}
					numPendingReports={p.marketsTotals.numPendingReports}
					isTradeCommitLocked={p.tradeCommitLock.isLocked}
				/>
			);
		case MY_POSITIONS:
		case MY_MARKETS:
		case MY_REPORTS:
			return (
				<PortfolioView
					{...p.portfolio}
					className={p.className}
					activeView={p.activeView}
				/>
			);
		case LOGIN_MESSAGE:
			return (
				<LoginMessagePage
					className={p.className}
					marketsLink={(p.links && p.links.marketsLink) || null}
				/>
			);
		default:
			return (
				<MarketsView
					name={MARKETS}
					className={p.className}
					loginAccount={p.loginAccount}
					createMarketLink={(p.links || {}).createMarketLink}
					markets={p.markets}
					marketsHeader={p.marketsHeader}
					favoriteMarkets={p.favoriteMarkets}
					pagination={p.pagination}
					filterSort={p.filterSort}
					keywords={p.keywords}
				/>
			);
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		const CurrentRoute = this.currentRoute;

		const siteHeader = {
			activeView: p.activeView,
			loginAccount: p.loginAccount,
			positionsSummary: p.positionsSummary,
			transactionsTotals: p.transactionsTotals,
			isTransactionsWorking: p.isTransactionsWorking,
			marketsInfo: p.marketsHeader,
			marketsLink: (p.links && p.links.marketsLink) || undefined,
			favoritesLink: (p.links && p.links.favoritesLink) || undefined,
			pendingReportsLink: (p.links && p.links.pendingReportsLink) || undefined,
			transactionsLink: (p.links && p.links.transactionsLink) || undefined,
			authLink: (p.links && p.links.authLink) || undefined,
			accountLink: (p.links && p.links.accountLink) || undefined,
			accountLinkText: (p.loginAccount && p.loginAccount.linkText) || undefined,
			myPositionsLink: (p.links && p.links.myPositionsLink) || undefined,
			portfolioTotals: (p.portfolio && p.portfolio.totals) || undefined
		};

		return (
			<div>
				{!!p &&
					<div id="site-container">
						<SiteHeader
							{...siteHeader}
							ref={(ref) => { this.siteHeader = ref; }}
						/>
						<div className="view-container" >
							<main className="view-content-container">
								{s.isSideBarVisible &&
									<div className="view-content view-content-group-1">
										<SideBar tags={p.tags} />
									</div>
								}
								<div className="view-content view-content-group-2">
									<CoreStats coreStats={p.coreStats} />
									<CurrentRoute className="view" />
								</div>
							</main>
							<SiteFooter />
						</div>
					</div>
				}
			</div>
		);
	}
}
