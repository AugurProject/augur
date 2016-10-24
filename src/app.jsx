import React, { Component } from 'react';
import { render } from 'react-dom';
import classnames from 'classnames';

import Router from 'base/router';

import SiteHeader from 'modules/site/components/site-header';
import SiteFooter from 'modules/site/components/site-footer';
import SideBarHeader from 'modules/site/components/side-bar-header';
import SideBarContent from 'modules/site/components/side-bar-content';
import CoreStats from 'modules/common/components/core-stats';

import shouldComponentUpdatePure from 'utils/should-component-update-pure';

export default function (appElement, selectors) {
	render(<AppComponent {...selectors} />, appElement);
}

class AppComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSideBarAllowed: false,
			isSideBarCollapsed: false,
			doScrollTop: false
		};

		this.shouldComponentUpdate = shouldComponentUpdatePure;

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
		const currentRoute = Router(this.props);

		if (currentRoute.props.sideBarAllowed) {
			this.setState({ isSideBarAllowed: true });
		} else {
			this.setState({ isSideBarAllowed: false });
		}
	}

	toggleSideBar() {
		this.setState({ isSideBarCollapsed: !this.state.isSideBarCollapsed });
	}

	render() {
		const p = this.props;
		const s = this.state;
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
			tags: p.tags,
			loginAccount: p.loginAccount
		};

		return (
			<main>
				{!!p &&
					<div id="site_container">
						<SiteHeader {...siteHeaderProps} />
						<div className={classnames('sub-header', (!p.loginAccount || !p.loginAccount.address) && 'logged-out')} >
							<div className="view-content-row">
								{s.isSideBarAllowed &&
									<div className={classnames('view-content view-content-group-1', { collapsed: s.isSideBarCollapsed })} >
										<SideBarHeader />
									</div>
								}
								<div className="view-content view-content-group-2">
									{p.loginAccount && p.loginAccount.id &&
										<CoreStats coreStats={p.coreStats} />
									}
								</div>
							</div>
						</div>
						<div id="view_container" >
							<div id="view_content_container">
								<div className={classnames('view-content-row', (!p.loginAccount || !p.loginAccount.address) && 'logged-out')} >
									{s.isSideBarAllowed &&
										<div className={classnames('view-content view-content-group-1', { collapsed: s.isSideBarCollapsed })} >
											{p.tags ?
												<SideBarContent {...sideBarProps} />

												:

												<span>No Tags</span>
											}
										</div>
									}
									<div className="view-content view-content-group-2">
										<Router {...p} />
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
