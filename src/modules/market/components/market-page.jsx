import React, { Component, PropTypes } from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Basics from '../../market/components/basics';
import MarketInfo from '../../market/components/market-info';
import TradePanel from '../../../modules/trade/components/trade-panel';
import ReportPanel from '../../reports/components/report-panel';
import MarketPositions from '../../market/components/market-positions';
import MarketOpenOrders from '../../market/components/market-open-orders';
import Chart from '../../market/components/chart';
import MarketSummary from './market-summary';

export default class MarketPage extends Component {
	static propTypes = {
		className: PropTypes.string,
		siteHeader: PropTypes.object,
		market: PropTypes.object,
		selectedOutcome: PropTypes.object,
		priceTimeSeries: PropTypes.array,
		numPendingReports: PropTypes.number,
		orderCancellation: PropTypes.object.isRequired,
		isTradeCommitLocked: PropTypes.bool,
		marketDataUpdater: React.PropTypes.shape({
			update: PropTypes.func.isRequired,
			updateIntervalSecs: PropTypes.number.isRequired
		}).isRequired,
		marketDataAge: React.PropTypes.shape({
			lastUpdatedBefore: PropTypes.string.isRequired,
			isUpdateButtonDisabled: PropTypes.bool.isRequired
		}).isRequired
	};

	constructor(props) {
		super(props);
		this.shouldComponentUpdate = shouldComponentUpdatePure;
	}

	render() {
		const p = this.props;
		const	nodes = [];

		// no market
		if (!p.market || !p.market.id) {
			nodes.push(
				<section key="no-market" className="basics">
					<span className="description">No market</span>
				</section>
			);
		} else {
			// market exists
			nodes.push(<Basics
				key="basics"
				{...p.market}
				isUpdaterVisible
				marketDataAge={p.marketDataAge}
				updateData={p.marketDataUpdater.update}
				updateIntervalSecs={p.marketDataUpdater.updateIntervalSecs}
			/>);
			nodes.push(<MarketInfo key="market-info" {...p.market} />);

			// report form
			if (p.market.isPendingReport) {
				nodes.push(
					<ReportPanel
						key="report-panel"
						{...p.market}
						{...p.market.report}
						numPendingReports={p.numPendingReports}
					/>
				);
			}	else if (p.market.isOpen) {
				// trade panel
				nodes.push(
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
				);

				// open orders
				if (!!p.market.userOpenOrdersSummary && !!p.market.userOpenOrdersSummary.openOrdersCount && !!p.market.userOpenOrdersSummary.openOrdersCount.value) {
					nodes.push(
						<MarketOpenOrders
							key="market-open-orders"
							userOpenOrdersSummary={p.market.userOpenOrdersSummary}
							outcomes={p.market.outcomes}
							orderCancellation={p.orderCancellation}
						/>
					);
				}

				// positions
				if (p.market.myPositionsSummary && p.market.myPositionsSummary.numPositions && p.market.myPositionsSummary.numPositions.value) {
					nodes.push(
						<MarketPositions
							key="market-positions"
							className="market-positions"
							positionsSummary={p.market.myPositionsSummary}
							positionOutcomes={p.market.myPositionOutcomes}
						/>
					);
				}

				// my markets
				if (!!p.market.myMarketSummary) {
					nodes.push(
						<MarketSummary
							key="market-summary"
							marketSummary={p.market.myMarketSummary}
						/>
					);
				}

				// chart
				nodes.push(
					<Chart
						key="chart"
						series={p.market.priceTimeSeries}
					/>
				);
			}
		}

		return (
			<main className="page market">
				<SiteHeader {...p.siteHeader} />

				<article className="page-content">
					<div className="l-container">
						{nodes}
					</div>
				</article>

				<SiteFooter />
			</main>
		);
	}
}
