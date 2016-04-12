import React from 'react';

import Basics from '../../markets/components/basics';
import TradePanelItem from './trade-panel-item';
import Transaction from '../../transactions/components/transaction';

module.exports = React.createClass({
	propTypes: {
		marketID: React.PropTypes.string,
		description: React.PropTypes.string,
		tradeOutcomes: React.PropTypes.array,
		tradeOrders: React.PropTypes.array,
		tradeOrdersTotals: React.PropTypes.object,
		onClickPlaceTrade: React.PropTypes.func
	},

	render: function() {
		var p = this.props;
		return (
			<article className="trade-panel">
				<div className="trade-builder">
					<Basics { ...p } />

					<div className="trade-panel-item-header">
						<span className="outcome-name">&nbsp;</span>
						<span className="last-price">Last</span>
						<span className="top-bid">Top Bid</span>
						<span className="top-ask">Top Ask</span>
						<span className="num-shares">Shares</span>
						<span className="limit-price">Limit</span>
						<span className="fee-to-pay">Fee</span>
						<span className="total-cost">Cost</span>
					</div>
					{ p.tradeOutcomes && p.tradeOutcomes.map(tradeOutcome => (
						<TradePanelItem
							{ ...tradeOutcome }
							key={ tradeOutcome.outcomeID }
							/>
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
							className="order total"
							{ ...p.tradeOrdersTotals }
							status={ undefined }
						/>
					</div>
				}
				<div className="place-trade-container">
					<button
						className="button place-trade" disabled={ !p.tradeOrders || !p.tradeOrders.length }
						onClick={ p.onClickPlaceTrade }>Place Trade</button>
				</div>
			</article>
		);
	}
});