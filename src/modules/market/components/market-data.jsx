import React, { Component } from 'react';

import MarketDataHeader from 'modules/market/components/market-data-header';
import ComponentNav from 'modules/common/components/component-nav';
import Outcomes from 'modules/outcomes/components/outcomes';
import MarketChart from 'modules/market/components/market-chart';
import MarketDetails from 'modules/market/components/market-details';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS } from 'modules/app/constants/views';

import getValue from 'utils/get-value';

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

		const marketDescription = getValue(p, 'market.description');

		return (
			<article className="market-data">
				<MarketDataHeader
					marketID={p.marketID}
					marketType={p.marketType}
					marketDescription={marketDescription}
					selectedShareDenomination={p.selectedShareDenomination}
					shareDenominations={p.shareDenominations}
					updateSelectedShareDenomination={p.updateSelectedShareDenomination}
				/>
				<ComponentNav
					navItems={p.marketDataNavItems}
					selectedNav={s.selectedNav}
					updateSelectedNav={this.updateSelectedNav}
				/>

				{s.selectedNav === MARKET_DATA_NAV_OUTCOMES &&
					<Outcomes
						marketType={p.marketType}
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
