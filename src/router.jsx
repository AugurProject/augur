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

import { ACCOUNT, MAKE, TRANSACTIONS, M, MY_POSITIONS, MY_MARKETS, MY_REPORTS, LOGIN_MESSAGE, MARKETS } from './modules/site/constants/views';
import { REGISTER, LOGIN, LOGOUT, IMPORT } from './modules/auth/constants/auth-types';

import shouldComponentUpdatePure from './utils/should-component-update-pure';

export default class Router extends Component {
	constructor(props) {
		super(props);

		this.state = {
			pageMarginTop: 0,
			isSideBarVisible: false
		};

		this.shouldComponentUpdate = shouldComponentUpdatePure;

		this.handleResize = this.handleResize.bind(this);
		this.currentRoute = this.currentRoute.bind(this);
		this.shouldDisplaySideBar = this.shouldDisplaySideBar.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);

		this.handleResize();
	}

	componentDidUpdate() {
		this.shouldDisplaySideBar();
	}

	handleResize() {
		if (this.siteHeader.siteHeader.offsetHeight !== this.state.pageMarginTop) {
			window.requestAnimationFrame(() => {
				this.setState({
					pageMarginTop: this.siteHeader.siteHeader.offsetHeight
				});
			});
		}
	}

	shouldDisplaySideBar() {
		const currentRoute = this.currentRoute();

		if (currentRoute.props.name === MARKETS) {
			this.setState({ isSideBarVisible: true });
		} else {
			this.setState({ isSideBarVisible: false });
		}
	}

	currentRoute() {
		const p = this.props;

		let node;

		switch (p.activeView) {
		case REGISTER:
		case LOGIN:
		case IMPORT:
		case LOGOUT:
			node = <AuthPage authForm={p.authForm} />;
			break;

		case ACCOUNT:
			node = (
				<AccountPage
					loginMessageLink={p.links.loginMessageLink}
					account={p.loginAccount}
					onChangePass={p.loginAccount.onChangePass}
					authLink={(p.links && p.links.authLink) || null}
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
					market={p.market}
					marketDataAge={p.marketDataAge}
					selectedOutcome={p.selectedOutcome}
					orderCancellation={p.orderCancellation}
					marketDataUpdater={p.marketDataUpdater}
					numPendingReports={p.marketsTotals.numPendingReports}
					isTradeCommitLocked={p.tradeCommitLock.isLocked}
				/>
			);
			break;

		case MY_POSITIONS:
		case MY_MARKETS:
		case MY_REPORTS:
			node = (
				<PortfolioView
					{...p.portfolio}
					activeView={p.activeView}
				/>
			);
			break;

		case LOGIN_MESSAGE:
			node = (
				<LoginMessagePage
					marketsLink={(p.links && p.links.marketsLink) || null}
				/>);
			break;
		default:
			node = (
				<MarketsView
					name={MARKETS}
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
			break;
		}

		return node;
	}

	render() {
		const p = this.props;
		const s = this.state;

		const currentRoute = this.currentRoute();

		const pageContainerStyles = {
			marginTop: this.state.pageMarginTop
		};

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
					<div>
						<SiteHeader
							ref={(ref) => { this.siteHeader = ref; }}
							{...siteHeader}
						/>
						<div
							className="view-container"
							style={pageContainerStyles}
						>
							{s.isSideBarVisible &&
								<SideBar tags={p.tags} />
							}
							<main className="view-content-container">
								{currentRoute}
							</main>
						</div>
						<SiteFooter />
					</div>
				}
			</div>
		);
	}
}
