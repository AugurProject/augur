import React from 'react';

import MarketBasics from 'modules/market/components/market-basics';
import MarketInfo from 'modules/market/components/market-info';
import ReportPanel from 'modules/reports/components/report-panel';
import TradePanel from 'modules/trade/components/trade-panel';
import MarketPositions from 'modules/market/components/market-positions';
import MarketOpenOrders from 'modules/market/components/market-open-orders';
import Chart from 'modules/market/components/market-chart';
import MarketSummary from 'modules/market/components/market-summary';

const MarketActive = p => (
	<article className="market-open">
		<MarketBasics
			{...p.market}
			isUpdaterVisible
			marketDataAge={p.marketDataAge}
			updateData={p.marketDataUpdater.update}
			updateIntervalSecs={p.marketDataUpdater.updateIntervalSecs}
		/>
		<MarketInfo key="market-info" {...p.market} />
		{p.market.isPendingReport &&
			<ReportPanel
				key="report-panel"
				{...p.market}
				{...p.market.report}
				numPendingReports={p.numPendingReports}
			/>
		}
		<TradePanel
			key="trade-panel"
			outcomes={p.market.outcomes}
			marketType={p.market.type}
			selectedOutcome={p.selectedOutcome}
			tradeSummary={p.market.tradeSummary}
			userOpenOrdersSummary={p.market.userOpenOrdersSummary}
			onSubmitPlaceTrade={p.market.onSubmitPlaceTrade}
			isTradeCommitLocked={p.isTradeCommitLocked}
		/>
		<MarketOpenOrders
			key="market-open-orders"
			userOpenOrdersSummary={p.market.userOpenOrdersSummary}
			outcomes={p.market.outcomes}
			orderCancellation={p.orderCancellation}
		/>
		<MarketPositions
			key="market-positions"
			className="market-positions"
			market={p.market}
		/>
		<MarketSummary
			key="market-summary"
			marketSummary={p.market.myMarketSummary}
		/>
		<Chart
			key="chart"
			series={p.market.priceTimeSeries}
		/>
	</article>
);

export default MarketActive;
