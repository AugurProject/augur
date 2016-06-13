import React from 'react';

import TradePanelItem from './trade-panel-item';
import Transaction from '../../transactions/components/transaction';

const TradePanel = React.createClass({
	propTypes: {
		outcomes: React.PropTypes.array,
		tradeOrders: React.PropTypes.array,
		onSubmitPlaceTrade: React.PropTypes.func
	},

	render: function() {
		var p = this.props;
		return (
			<section className="trade-panel">
				<div className="trade-builder">
					<div className="trade-panel-item-header">
						<span className="outcome-name">&nbsp;</span>
						<span className="last-price">Last</span>
						<span className="top-bid">Top Bid</span>
						<span className="top-ask">Top Ask</span>
						<span className="num-shares">Side</span>
						<span className="num-shares">Shares</span>
						<span className="limit-price">Limit</span>
						<span className="fee-to-pay">Fee</span>
						<span className="total-cost">Profit/Loss</span>
					</div>
					{ p.outcomes && p.outcomes.map(outcome => (
						<TradePanelItem
							key={ outcome.id }
							sideOptions={ p.sideOptions }
							{ ...outcome }
							{ ...outcome.trade } />
					))}
				</div>

				{ p.tradeOrders && !!p.tradeOrders.length &&
				<div className="trade-orders">
					<h5>Trade Summary</h5>
					{ p.tradeOrders && p.tradeOrders.map((tradeOrder, i) => (
						<Transaction
							key={ i }
							className="order"
							{ ...tradeOrder }
							status={ undefined }
						/>
					))}

					<Transaction
						shares={ p.totalShares }
						className="order total"
						ether={ p.totalEther }
						gas={ p.totalGas }
						status={ undefined } />
				</div>
				}
				<div className="place-trade-container">
					<button
						className="button place-trade" disabled={ !p.tradeOrders || !p.tradeOrders.length }
						onClick={ p.onSubmitPlaceTrade }>Place Trade</button>
				</div>
			</section>
		);
	}
});

module.exports = TradePanel;