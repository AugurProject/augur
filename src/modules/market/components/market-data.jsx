import React, { Component } from 'react';

import MarketHeader from 'modules/market/components/market-header';
import ComponentNav from 'modules/common/components/component-nav';
import Outcomes from 'modules/outcomes/components/outcomes';
import OrderBook from 'modules/order-book/components/order-book';
import MarketChart from 'modules/market/components/market-chart';
import MarketDetails from 'modules/market/components/market-details';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_ORDERS, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS } from 'modules/app/constants/views';

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
				<MarketHeader
					{...p.market}
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
						selectedShareDenomination={p.selectedShareDenomination}
						tradeSummary={p.tradeSummary}
						submitTrade={p.submitTrade}
						selectedTradeSide={p.selectedTradeSide}
						updateSelectedTradeSide={p.updateSelectedTradeSide}
						outcomeTradeNavItems={p.outcomeTradeNavItems}
						updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
						minLimitPrice={p.minLimitPrice}
						maxLimitPrice={p.maxLimitPrice}
						updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
						minLimitPrice={p.minLimitPrice}
						maxLimitPrice={p.maxLimitPrice}
					/>
				}
				{s.selectedNav === MARKET_DATA_ORDERS &&
					<OrderBook
						marketType={p.marketType}
						outcome={p.selectedOutcome}
						selectedTradeSide={p.selectedTradeSide}
						updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
						selectedShareDenomination={p.selectedShareDenomination}
					/>
				}
				{s.selectedNav === MARKET_DATA_NAV_CHARTS &&
					<MarketChart series={p.market.priceTimeSeries} />
				}
				{s.selectedNav === MARKET_DATA_NAV_DETAILS &&
					<MarketDetails
						{...p.market}
						selectedShareDenomination={p.selectedShareDenomination}
						shareDenominations={p.shareDenominations}
					/>
				}
			</article>
		);
	}
}
