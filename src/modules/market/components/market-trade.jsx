import React from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import SiteHeader from '../../site/components/site-header';
import TradePanel from '../../trade/components/trade-panel';
//import BidsAsks from '../../bids-asks/components/bids-asks';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		siteHeader: React.PropTypes.object,
		market: React.PropTypes.object,
		tradeMarket: React.PropTypes.object,
		tradeOrders: React.PropTypes.array,
		tradeOrdersTotals: React.PropTypes.object,
		placeTradeHandler: React.PropTypes.func
	},

	shouldComponentUpdate: shouldComponentUpdatePure,

	render: function() {
		var p = this.props;
		return (
			<main className="page market-trade">
				<SiteHeader { ...p.siteHeader } />

		        <TradePanel
		            { ...p.market }
		            { ...p.tradeMarket }
		            tradeOrders={ p.tradeOrders }
		            tradeOrdersTotals={ p.tradeOrdersTotals }
		            onClickPlaceTrade={ p.placeTradeHandler } />

				<section className="page-content">
					{/*
					<BidsAsks
						className="bids-asks"
						bidsAsks={ selectBidsAsksByPrice(s.selectedMarketID, s, dispatch) } />
					*/}
				</section>
			</main>
	    );
	}
});


