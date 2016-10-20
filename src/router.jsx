import React, { Component } from 'react';
import classnames from 'classnames';

import SiteHeader from './modules/site/components/site-header';
import SiteFooter from './modules/site/components/site-footer';
import SideBar from './modules/site/components/side-bar';
import MarketsView from './modules/markets/components/markets-view';
import MarketView from './modules/market/components/market-view';
import CreateMarketView from './modules/create-market/components/create-market-view';
import AuthView from './modules/auth/components/auth-view';
import AccountView from './modules/account/components/account-view';
import PortfolioView from './modules/portfolio/components/portfolio-view';
import TransactionsView from './modules/transactions/components/transactions-view';
import LoginMessageView from './modules/login-message/components/login-message-view';
import CoreStats from './modules/common/components/core-stats';

import { ACCOUNT, MAKE, TRANSACTIONS, M, MY_POSITIONS, MY_MARKETS, MY_REPORTS, LOGIN_MESSAGE } from './modules/site/constants/views';
import { REGISTER, LOGIN, LOGOUT, IMPORT } from './modules/auth/constants/auth-types';

import shouldComponentUpdatePure from './utils/should-component-update-pure';

export default class Router extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSideBarAllowed: false,
			isSideBarCollapsed: false,
			doScrollTop: false
		};

		this.shouldComponentUpdate = shouldComponentUpdatePure;

		this.currentRoute = this.currentRoute.bind(this);
		this.handleScrollTop = this.handleScrollTop.bind(this);
		this.shouldDisplaySideBar = this.shouldDisplaySideBar.bind(this);
	}

	componentDidMount() {
		this.shouldDisplaySideBar();
	}

	componentDidUpdate() {
		this.shouldDisplaySideBar();
		this.handleScrollTop();
	}

	handleScrollTop() {
		const p = this.props;

		if (p.url !== window.location.pathname + window.location.search) {
			window.history.pushState(null, null, p.url);
			this.setState({ doScrollTop: true });
		}

		if (this.state.doScrollTop) {
			window.document.getElementById('view_container').scrollTop = 0;
			this.setState({ doScrollTop: false });
		}
	}

	shouldDisplaySideBar() {
		const currentRoute = this.currentRoute();

		if (currentRoute.props.sideBarAllowed) {
			this.setState({ isSideBarAllowed: true });
		} else {
			this.setState({ isSideBarAllowed: false });
		}
	}

	toggleSideBar() {
		this.setState({ isSideBarCollapsed: !this.state.isSideBarCollapsed });
	}

	currentRoute(routeProps) {
		const p = {
			...this.props,
			...routeProps
		};

		let viewProps = null; // Data props are split off into `viewProps` so code style wise there is a separation between element attributes + data attributes

		switch (p.activeView) {
			case REGISTER:
			case LOGIN:
			case IMPORT:
			case LOGOUT: {
				viewProps = {
					authForm: p.authForm
				};

				return (
					<AuthView
						className={p.className}
						{...viewProps}
					/>
				);
			}
			case ACCOUNT: {
				viewProps = {
					loginMessageLink: p.links.loginMessageLink,
					account: p.loginAccount,
					onChangePass: p.loginAccount.onChangePass,
					authLink: (p.links && p.links.authLink) || null,
					onAirbitzManageAccount: p.loginAccount.onAirbitzManageAccount
				};

				return (
					<AccountView
						className={p.className}
						{...viewProps}
					/>
				);
			}
			case TRANSACTIONS: {
				viewProps = {
					transactions: p.transactions,
					transactionsTotals: p.transactionsTotals
				};

				return (
					<TransactionsView
						className={p.className}
						{...viewProps}
					/>
				);
			}
			case MY_POSITIONS:
			case MY_MARKETS:
			case MY_REPORTS: {
				viewProps = {
					activeView: p.activeView,
					...p.portfolio
				};

				return (
					<PortfolioView
						className={p.className}
						{...viewProps}
					/>
				);
			}
			case LOGIN_MESSAGE: {
				viewProps = {
					marketsLink: (p.links && p.links.marketsLink) || null
				};

				return (
					<LoginMessageView
						className={p.className}
						{...viewProps}
					/>
				);
			}
			case MAKE: {
				viewProps = {
					createMarketForm: p.createMarketForm
				};

				return (
					<CreateMarketView
						className={p.className}
						{...viewProps}
					/>
				);
			}
			case M: {
				viewProps = {
					market: p.market,
					marketDataAge: p.marketDataAge,
					selectedOutcome: p.selectedOutcome,
					orderCancellation: p.orderCancellation,
					marketDataUpdater: p.marketDataUpdater,
					numPendingReports: p.marketsTotals.numPendingReports,
					isTradeCommitLocked: p.tradeCommitLock.isLocked
				};

				return (
					<MarketView
						className={p.className}
						{...viewProps}
					/>
				);
			}
			default: {
				viewProps = {
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
					<MarketsView
						className={p.className}
						sideBarAllowed
						{...viewProps}
					/>
				);
			}
		}
	}

	render() {
		const p = this.props;
		const s = this.state;
		const CurrentRoute = this.currentRoute;
		const siteHeaderProps = {
			isSideBarAllowed: s.isSideBarAllowed,
			isSideBarCollapsed: s.isSideBarCollapsed,
			toggleSideBar: () => { this.toggleSideBar(); },
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
		const sideBarProps = {
			tags: p.tags
		};

		return (
			<main>
				{!!p &&
					<div id="site_container">
						<SiteHeader {...siteHeaderProps} />
						<div id="view_container" >
							<div id="view_content_container">
								<div className="view-content-row">
									{s.isSideBarAllowed && p.tags &&
										<div className={classnames('view-content view-content-group-1', { collapsed: s.isSideBarCollapsed })} >
											<SideBar
												className="side-bar"
												{...sideBarProps}
											/>
										</div>
									}
									<div className="view-content view-content-group-2">
										<CoreStats coreStats={p.coreStats} />
										<CurrentRoute className="view" />
									</div>
								</div>
								<SiteFooter />
							</div>
						</div>
					</div>
				}
			</main>
		);
	}
}
