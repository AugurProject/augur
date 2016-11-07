import React, { Component } from 'react';

import ComponentNav from 'modules/common/components/component-nav';
import MarketPositions from 'modules/market/components/market-positions';
import MarketOpenOrders from 'modules/market/components/market-open-orders';

import { MARKET_USER_DATA_NAV_POSITIONS, MARKET_USER_DATA_NAV_OPEN_ORDERS } from 'modules/app/constants/views';

import getValue from 'utils/get-value';

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

		const outcomes = getValue(p, 'market.outcomes');

		return (
			<article className="market-user-data">
				<h3>My Trading</h3>
				<ComponentNav
					navItems={p.navItems}
					selectedNav={s.selectedNav}
					updateSelectedNav={this.updateSelectedNav}
				/>
				{s.selectedNav === MARKET_USER_DATA_NAV_POSITIONS &&
					<MarketPositions
						{...p}
						marketType={p.marketType}
						selectedShareDenomination={p.selectedShareDenomination}
					/>
				}
				{s.selectedNav === MARKET_USER_DATA_NAV_OPEN_ORDERS &&
					<MarketOpenOrders
						outcomes={outcomes}
						marketType={p.marketType}
						orderCancellation={p.orderCancellation}
						selectedShareDenomination={p.selectedShareDenomination}
					/>
				}
			</article>
		);
	}
}
