import React, { Component, PropTypes } from 'react';

import MarketHeader from 'modules/market/components/market-header';
import ComponentNav from 'modules/common/components/component-nav';
import Outcomes from 'modules/outcomes/components/outcomes';
import OrderBook from 'modules/order-book/components/order-book';
import MarketChart from 'modules/market/components/market-chart';
import MarketDetails from 'modules/market/components/market-details';
import ReportForm from 'modules/reports/components/report-form';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_ORDERS, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS, MARKET_DATA_NAV_REPORT } from 'modules/app/constants/views';

export default class MarketData extends Component {
	static propTypes = {
		marketDataNavItems: PropTypes.object,
		isPendingReport: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.state = {
			marketDataNavItems: props.marketDataNavItems,
			selectedNav: props.isPendingReport ? MARKET_DATA_NAV_REPORT : MARKET_DATA_NAV_OUTCOMES
		};

		this.updateSelectedNav = this.updateSelectedNav.bind(this);
		this.setMarketDataNavItems = this.setMarketDataNavItems.bind(this);
	}

	componentWillMount() {
		this.setMarketDataNavItems();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.isPendingReport !== nextProps.isPendingReport) {
			this.setMarketDataNavItems();
		}
	}

	setMarketDataNavItems() {
		if (!this.props.isPendingReport) {
			const marketDataNavItems = Object.keys(this.props.marketDataNavItems).reduce((prev, nav) => {
				if (this.props.marketDataNavItems[nav].isPendingReport !== true) {
					prev[nav] = this.props.marketDataNavItems[nav];
				}
				return prev;
			}, {});

			this.setState({ marketDataNavItems });
		}
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
					navItems={s.marketDataNavItems}
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
				{s.selectedNav === MARKET_DATA_NAV_REPORT &&
					<ReportForm
						{...p.market}
						isReported={p.market.isReported || p.market.isReportSubmitted}
						onClickSubmit={p.market.report.onSubmitReport}
					/>
				}
			</article>
		);
	}
}
