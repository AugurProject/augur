import React, { Component } from 'react';

import ComponentNav from 'modules/common/components/component-nav';
import Outcomes from 'modules/outcomes/components/outcomes';
import MarketChart from 'modules/market/components/market-chart';
import MarketDetails from 'modules/market/components/market-details';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS } from 'modules/app/constants/views';

export default class MarketData extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedNav: MARKET_DATA_NAV_OUTCOMES
		};

		this.updateSelectedNav = this.updateSelectedNav.bind(this);
	}

	updateSelectedNav(selectedNav) {
		this.setState({ selectedNav });
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<article className="market-data">
				<h3>{p.market.description}</h3>
				<ComponentNav
					{...p.marketDataNavItems}
					selectedNav={s.selectedNav}
					updateSelectedNav={this.updateSelectedNav}
				/>

				{s.selectedNav === MARKET_DATA_NAV_OUTCOMES &&
					<Outcomes
						outcomes={p.market.outcomes}
						selectedOutcome={p.selectedOutcome}
						updateSelectedOutcome={p.updateSelectedOutcome}
					/>
				}
				{s.selectedNav === MARKET_DATA_NAV_CHARTS &&
					<MarketChart series={p.market.priceTimeSeries} />
				}
				{s.selectedNav === MARKET_DATA_NAV_DETAILS &&
					<MarketDetails {...p.market} />
				}
			</article>
		);
	}
}
