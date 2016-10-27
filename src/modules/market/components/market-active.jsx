import React, { Component } from 'react';

import MarketData from 'modules/market/components/market-data';
import MarketUserData from 'modules/market/components/market-user-data';
import OutcomeOrderBook from 'modules/outcomes/components/outcome-order-book';
import OutcomeTrade from 'modules/outcomes/components/outcome-trade';

export default class MarketActive extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedOutcome: this.props.market.outcomes[0]
		};

		this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this);
	}

	updateSelectedOutcome(selectedOutcome) {
		this.setState({ selectedOutcome });
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<article className="market-active">
				<div className="market-group">
					<MarketData
						{...p}
						selectedOutcome={s.selectedOutcome}
						updateSelectedOutcome={this.updateSelectedOutcome}
					/>
					<OutcomeOrderBook outcome={s.selectedOutcome} />
					<OutcomeTrade />
				</div>
				<div className="market-group">
					<MarketUserData />
					<OutcomeTrade />
				</div>
			</article>
		);
	}
}

// const MarketActive = p => (
// 	<article className="market-active">
// 		<div className="market-group">
// 			<MarketData {...p} />
// 			<OutcomeOrderBook currentOutcome={...p} />
// 			<OutcomeTrade />
// 		</div>
// 		<div className="market-group">
// 			<MarketUserData />
// 			<OutcomeTrade />
// 		</div>
// 	</article>
// );
//
// export default MarketActive;

// <MarketBasics
// 	{...p.market}
// 	isUpdaterVisible
// 	marketDataAge={p.marketDataAge}
// 	updateData={p.marketDataUpdater.update}
// 	updateIntervalSecs={p.marketDataUpdater.updateIntervalSecs}
// />
// <MarketInfo key="market-info" {...p.market} />
// {p.market.isPendingReport &&
// 	<ReportPanel
// 		key="report-panel"
// 		{...p.market}
// 		{...p.market.report}
// 		numPendingReports={p.numPendingReports}
// 	/>
// }
// <TradePanel
// 	key="trade-panel"
// 	outcomes={p.market.outcomes}
// 	marketType={p.market.type}
// 	selectedOutcome={p.selectedOutcome}
// 	tradeSummary={p.market.tradeSummary}
// 	userOpenOrdersSummary={p.market.userOpenOrdersSummary}
// 	onSubmitPlaceTrade={p.market.onSubmitPlaceTrade}
// 	isTradeCommitLocked={p.isTradeCommitLocked}
// />
// <MarketOpenOrders
// 	key="market-open-orders"
// 	userOpenOrdersSummary={p.market.userOpenOrdersSummary}
// 	outcomes={p.market.outcomes}
// 	orderCancellation={p.orderCancellation}
// />
// <MarketPositions
// 	key="market-positions"
// 	className="market-positions"
// 	market={p.market}
// />
// <MarketSummary
// 	key="market-summary"
// 	marketSummary={p.market.myMarketSummary}
// />
// <Chart
// 	key="chart"
// 	series={p.market.priceTimeSeries}
// />
