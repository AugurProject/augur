import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Hammer from 'hammerjs';

import Header from 'modules/app/components/header';
import Footer from 'modules/app/components/footer';
import SideBar from 'modules/app/components/side-bar';
import CoreStats from 'modules/app/components/core-stats';
import Routes from 'modules/app/components/routes';
import ChatView from 'modules/chat/components/chat-view';
import SidebarMask from 'modules/common/components/side-bar-mask';

import shouldComponentUpdatePure from 'utils/should-component-update-pure';
import handleScrollTop from 'utils/scroll-top-on-change';
import getValue from 'utils/get-value';
import debounce from 'utils/debounce';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSideBarAllowed: false,
			isSideBarCollapsed: false,
			isChatCollapsed: true,
			doScrollTop: false,
			currentRoute: null,
			headerHeight: 0,
			footerHeight: 0,
			isFooterCollapsed: true
		};

		this.shouldComponentUpdate = shouldComponentUpdatePure;

		this.toggleChat = this.toggleChat.bind(this);
		this.setSidebarAllowed = this.setSidebarAllowed.bind(this);
		this.attachTouchHandler = this.attachTouchHandler.bind(this);
		this.handleSwipeEvent = this.handleSwipeEvent.bind(this);
		this.handleWindowScroll = debounce(this.handleWindowScroll.bind(this));
		this.updateHeaderHeight = this.updateHeaderHeight.bind(this);
		this.updateFooterHeight = this.updateFooterHeight.bind(this);
		this.updateIsFooterCollapsed = this.updateIsFooterCollapsed.bind(this);
	}

	componentDidMount() {
		if (window.getComputedStyle(this.main).getPropertyValue('will-change') === 'contents') {
			this.main.style.willChange = 'auto'; // reset
			this.toggleSideBar();
		}

		window.addEventListener('scroll', this.handleWindowScroll);

		this.attachTouchHandler();
	}

	componentDidUpdate(pP, pS) {
		handleScrollTop(this.props.url);
	}

	// Sidebar
	setSidebarAllowed(isSideBarAllowed) {
		this.setState({ isSideBarAllowed });
	}
	toggleSideBar() {
		this.setState({ isSideBarCollapsed: !this.state.isSideBarCollapsed });
	}

	//	Bounding Element Dimentions
	//	NOTE -- used by mobile side-bar
	updateHeaderHeight(headerHeight) {
		this.setState({ headerHeight });
	}
	updateFooterHeight(footerHeight) {
		this.setState({ footerHeight });
	}

	//	Footer
	updateIsFooterCollapsed(isFooterCollapsed) {
		this.setState({ isFooterCollapsed });
	}

	handleWindowScroll() {
		if (!this.state.isFooterCollapsed) {
			this.updateIsFooterCollapsed(true);
		}
	}

	// Chat
	toggleChat() {
		this.setState({ isChatCollapsed: !this.state.isChatCollapsed });
	}

	// Touch Events
	attachTouchHandler() {
		delete Hammer.defaults.cssProps.userSelect; // Allows for text selection

		const options = {
			dragLockToAxis: true,
			dragBlockHorizontal: true,
			preventDefault: true
		};

		const hammer = new Hammer(this.main, options);

		hammer.on('swipe', (e) => { this.handleSwipeEvent(e); });
	}

	handleSwipeEvent(swipe) {
		if (this.state.isSideBarAllowed) {
			if (swipe.deltaX > 0) {
				this.setState({ isSideBarCollapsed: false });
			} else {
				this.setState({ isSideBarCollapsed: true });
			}
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		const navProps = {
			logged: getValue(p, 'loginAccount.address'),
			isSideBarAllowed: s.isSideBarAllowed,
			isSideBarCollapsed: s.isSideBarCollapsed,
			toggleSideBar: () => { this.toggleSideBar(); },
			activeView: p.activeView,
			positionsSummary: p.positionsSummary,
			transactionsTotals: p.transactionsTotals,
			isTransactionsWorking: p.isTransactionsWorking,
			marketsInfo: p.marketsHeader,
			portfolioTotals: getValue(p, 'portfolio.totals'),
			numFavorites: getValue(p, 'marketsHeader.numFavorites'),
			numPendingReports: getValue(p, 'marketsHeader.numPendingReports'),
			numTransactionsWorking: getValue(p, 'transactionsTotals.numWorking'),
			marketsLink: getValue(p, 'links.marketsLink'),
			favoritesLink: getValue(p, 'links.favoritesLink'),
			pendingReportsLink: getValue(p, 'links.pendingReportsLink'),
			transactionsLink: getValue(p, 'links.transactionsLink'),
			authLink: getValue(p, 'links.authLink'),
			accountLink: getValue(p, 'links.accountLink'),
			myPositionsLink: getValue(p, 'links.myPositionsLink')
		};

		const sideBarProps = {
			tags: p.tags,
			headerHeight: s.headerHeight,
			footerHeight: s.footerHeight
		};

		// NOTE -- A few implementation details:
		// An attention has been paid to avoid JS manipulation of app layout
		// As a result, you'll notice that both the `Header` + `CortStats` + `Footer` components are duplicated -- this is for layout purposes only in order to better preserve responsiveness w/out manual calculations
		// The duplicated components are `visibility: hidden` so that page flow is preserved since the actual elements are pulled from page flow via `position: fixed`
		return (
			<main id="main_responsive_state" ref={(main) => { this.main = main; }}>
				{p &&
					<div id="app_container" >
						{s.isSideBarAllowed && !s.isSideBarCollapsed &&
							<SidebarMask
								style={{
									top: s.headerHeight,
									bottom: s.footerHeight
								}}
							/>
						}
						<div id="app_header">
							<Header
								{...navProps}
								updateHeaderHeight={this.updateHeaderHeight}
							/>
							<div className={classnames('sub-header', (!p.loginAccount || !p.loginAccount.address) && 'logged-out')} >
								{s.isSideBarAllowed && !s.isSideBarCollapsed &&
									<div className="core-stats-bumper" />
								}
								{p.loginAccount && p.loginAccount.address &&
									<CoreStats coreStats={p.coreStats} />
								}
							</div>
						</div>
						<div id="app_views" >
							<Header {...navProps} />
							<div id="app_view_container">
								{s.isSideBarAllowed && !s.isSideBarCollapsed &&
									<div id="side_bar" >
										<SideBar {...sideBarProps} />
									</div>
								}
								<div id="app_view">
									{s.isSideBarAllowed && !s.isSideBarCollapsed &&
										<div className="core-stats-bumper" />
									}
									<div className={classnames('sub-header', (!p.loginAccount || !p.loginAccount.address) && 'logged-out')} >
										{p.loginAccount && p.loginAccount.address &&
											<CoreStats coreStats={p.coreStats} />
										}
									</div>
									<Routes
										{...p}
										setSidebarAllowed={this.setSidebarAllowed}
									/>
									<Footer {...navProps} />
								</div>
							</div>
						</div>
						{!s.isChatCollapsed &&
							<ChatView
								{...p.chat.augur}
								toggleChat={() => { this.toggleChat(); }}
							/>
						}
						<button id="chat-button" onClick={() => { this.toggleChat(); }}>
							Chat
						</button>
						<Footer
							{...navProps}
							isFooterCollapsed={s.isFooterCollapsed}
							updateFooterHeight={this.updateFooterHeight}
							updateIsFooterCollapsed={this.updateIsFooterCollapsed}
						/>
					</div>
				}
			</main>
		);
	}
}

App.propTypes = {
	url: PropTypes.string
};
