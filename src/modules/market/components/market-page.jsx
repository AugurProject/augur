import React from 'react';

import TradeView from './market-trade';
import ReportView from './market-report';
import ExpiredView from './market-expired';
import NoneView from './market-none';

module.exports = React.createClass({
	render: function() {
		var p = this.props.selectors;

		if (!p.market) {
			return <NoneView
						siteHeader={ p.siteHeader }
						market={ p.market } />;
		}
		else if (p.market.isRequiredToReportByAccount) {
			return <ReportView
							siteHeader={ p.siteHeader }
							market={ p.market }
							report={ p.report }
							numTotalReports={ p.reportMarkets.length }
							submitReportHandler={ p.submitReportHandler } />;
		}
		else if (!p.market.isOpen) {
			return <ExpiredView siteHeader={ p.siteHeader } />;
		}
		else {
			return <TradeView
							market={ p.market }
							tradeMarket={ p.tradeMarket }
							tradeOrders={ p.tradeOrders }
							tradeOrdersTotals={ p.tradeOrdersTotals }
							siteHeader={ p.siteHeader }
							placeTradeHandler={ p.placeTradeHandler } />;
		}
	}
});