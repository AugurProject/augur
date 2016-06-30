import React from 'react';
import TradePanelHeader from '../../../modules/trade/components/trade-panel-header';
import TradePanelFooter from './trade-panel-footer';
import TradePanelBody from './trade-panel-body';

const TradePanel = (p) => (
	<div
		className="trade-panel"
		onClick={() => p.updateSelectedOutcome(null)}
	>
		<table className="trade-builder">
			<TradePanelHeader selectedOutcomeID={p.selectedOutcomeID} />
			{p.tradeOrders && !!p.tradeOrders.length &&
				<TradePanelFooter summary={p.tradeSummary} />
			}
			<TradePanelBody
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