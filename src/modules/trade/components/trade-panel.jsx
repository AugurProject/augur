import React from 'react';
import TradePanelItems from '../../../modules/trade/components/trade-panel-items';
import Transaction from '../../transactions/components/transaction';
import Clickable from '../../common/components/clickable';

const TradePanel = (p) => {

	console.log('TradePanel: p -- ', p);

	return (
		<section
			className="trade-panel"
			onClick={() => p.updateSelectedOutcome(null)}
		>
			<table className="trade-builder">
				<thead className="trade-panel-item-header">
					<tr>
						<th className="outcome-name"></th>
						<th className="last-price">Last</th>
						<th className="top-bid">{!!p.selectedOutcomeID ? 'Bid' : 'Top Bid'}</th>
						<th className="top-ask">{!!p.selectedOutcomeID ? 'Ask' : 'Top Ask'}</th>
						<th className="num-shares">Side</th>
						<th className="num-shares">Shares</th>
						<th className="limit-price">Limit</th>
						<th className="fee-to-pay">Fee</th>
						<th className="total-cost">Profit/Loss</th>
					</tr>
				</thead>
				<TradePanelItems
					outcomes={p.outcomes}
					sideOptions={p.sideOptions}
					selectedOutcomeID={p.selectedOutcomeID}
					updateSelectedOutcome={p.updateSelectedOutcome}
				/>
			</table>

			{p.tradeOrders && !!p.tradeOrders.length &&
				<div className="trade-orders">
					<h5>Trade Summary</h5>
					{p.tradeOrders && p.tradeOrders.map((tradeOrder, i) => (
						<Transaction
							key={i}
							className="order"
							{...tradeOrder}
							status={undefined}
						/>
					))}

					<Transaction
						type="trade_summary"
						shares={p.totalShares}
						className="order total"
						ether={p.totalEther}
						gas={p.totalGas}
						status={undefined}
					/>
				</div>
			}
			<div className="place-trade-container">
				<button
					className="button place-trade" disabled={!p.tradeOrders || !p.tradeOrders.length}
					onClick={p.onSubmitPlaceTrade}
				>
					Place Trade
				</button>
			</div>
		</section>
	);
};

TradePanel.propTypes = {
	outcomes: React.PropTypes.array,
	tradeOrders: React.PropTypes.array,
	onSubmitPlaceTrade: React.PropTypes.func,
	selectedOutcomeID: React.PropTypes.string
};

export default TradePanel;


// {p.outcomes && p.outcomes.map(outcome => (
// 	<TradePanelItems
// 		key={outcome.id}
// 		sideOptions={p.sideOptions}
// 		updateSelectedOutcome={p.updateSelectedOutcome}
// 		selectedOutcomeID={p.selectedOutcomeID}
// 		{...outcome}
// 		{...outcome.trade}
// 	/>
// ))}