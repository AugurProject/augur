import React from 'react';
import TradePanelItems from '../../../modules/trade/components/trade-panel-items';
import Transaction from '../../transactions/components/transaction';
import classnames from 'classnames';

const TradePanel = (p) => (
	<div
		className="trade-panel"
		onClick={() => p.updateSelectedOutcome(null)}
	>
		<table className="trade-builder">
			<thead className="trade-panel-header">
				<tr className="header-row">
					<th className="outcome-name">Outcomes</th>
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
			<tfoot className="transaction-summary">
				<tr className={classnames('header-row', 'summary-title')}>
					<td colSpan="9" >Trade Summary</td>
				</tr>
				<tr className={classnames('header-row', 'summary-headers')}>
					<td>Outcomes</td>
					<td colSpan="6" className="transactions-header">Transactions</td>
					<td>Fee</td>
					<td>Profit/Loss</td>
				</tr>
			</tfoot>
			<TradePanelItems
				outcomes={p.outcomes}
				sideOptions={p.sideOptions}
				selectedOutcomeID={p.selectedOutcomeID}
				updateSelectedOutcome={p.updateSelectedOutcome}
			/>
		</table>
	</div>
);

TradePanel.propTypes = {
	outcomes: React.PropTypes.array,
	tradeOrders: React.PropTypes.array,
	onSubmitPlaceTrade: React.PropTypes.func,
	selectedOutcomeID: React.PropTypes.string
};

export default TradePanel;

// {p.tradeOrders && p.tradeOrders.map((tradeOrder, i) => (
// 	<Transaction
// 		key={i}
// 		className="order"
// 		{...tradeOrder}
// 		status={undefined}
// 	/>
// ))}
//
// <Transaction
// 	type="trade_summary"
// 	shares={p.totalShares}
// 	className="order total"
// 	ether={p.totalEther}
// 	gas={p.totalGas}
// 	status={undefined}
// />

// <div className="place-trade-container">
// 	<button
// 		className="button place-trade" disabled={!p.tradeOrders || !p.tradeOrders.length}
// 		onClick={p.onSubmitPlaceTrade}
// 	>
// 		Place Trade
// 	</button>
// </div>


// {p.tradeOrders && !!p.tradeOrders.length &&
// 	<table className="trade-orders">
// 		<thead>
// 			<tr>
// 				<th colSpan="9" >Trade Summary</th>
// 			</tr>
// 			<tr>
// 				<th></th>
// 				<th colSpan="6" >Transaction</th>
// 				<th>Fee</th>
// 				<th>Profit/Loss</th>
// 			</tr>
// 		</thead>
// 		<tbody>
// 			<tr>
// 				<td></td>
// 				<td></td>
// 				<td></td>
// 				<td></td>
// 				<td></td>
// 				<td></td>
// 				<td></td>
// 				<td></td>
// 				<td></td>
// 			</tr>
// 		</tbody>
// 	</table>
// }