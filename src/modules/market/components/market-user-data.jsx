import React, { Component } from 'react';

import ComponentNav from 'modules/common/components/component-nav';
import Positions from 'modules/market/components/market-positions';

import { MARKET_USER_DATA_NAV_POSITIONS, MARKET_USER_DATA_NAV_OPEN_ORDERS } from 'modules/app/constants/views';

export default class MarketUserData extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedNav: MARKET_USER_DATA_NAV_POSITIONS
		};

		this.updateSelectedNav = this.updateSelectedNav.bind(this);
	}

	updateSelectedNav(selectedNav) {
		this.setState({ selectedNav });
	}

	render() {
		const p = this.props;
		const s = this.state;

		console.log('MarketUserData -- ', p);

		return (
			<article className="market-user-data">
				<h3>My Trading</h3>
				<ComponentNav
					navItems={p.navItems}
					selectedNav={s.selectedNav}
					updateSelectedNav={this.updateSelectedNav}
				/>
				{s.selectedNav === MARKET_USER_DATA_NAV_POSITIONS &&
					<Positions {...p} />
				}
				{s.selectedNav === MARKET_USER_DATA_NAV_OPEN_ORDERS &&
					<span>Open Orders</span>
				}
			</article>
		);
	}
}
