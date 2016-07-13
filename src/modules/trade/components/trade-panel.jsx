import React from 'react';
import TradePanelHeader from '../../../modules/trade/components/trade-panel-header';
import TradePanelFooter from '../../../modules/trade/components/trade-panel-footer';
import TradePanelBody from '../../../modules/trade/components/trade-panel-body';

const TradePanel = (p) => (
	<div
		className="trade-panel"
		onClick={() => p.updateSelectedOutcome(null)}
	>
		<table className="trade-builder">
			<TradePanelHeader selectedOutcomeID={p.selectedOutcomeID} />
			{p.outcomes.map(outcome => (
				<TradePanelBody
					key={`${outcome.name}`}
					outcome={outcome}
					sideOptions={p.sideOptions}
					selectedOutcomeID={p.selectedOutcomeID}
					updateSelectedOutcome={p.updateSelectedOutcome}
					orderSides={p.orderSides}
				/>
			))}
			{p.tradeOrders && !!p.tradeOrders.length &&
				<TradePanelFooter
					summary={p.tradeSummary}
					orderSides={p.orderSides}
				/>
			}
		</table>
		<div className="place-trade-container">
			<button
				className="button place-trade"
				disabled={!p.tradeOrders || !!!p.tradeOrders.length}
				onClick={event => {
					event.stopPropagation();

					p.onSubmitPlaceTrade();
				}}
			>
				Place Trade
			</button>
		</div>
	</div>
);

TradePanel.propTypes = {
	outcomes: React.PropTypes.array,
	sideOptions: React.PropTypes.array,
	updateSelectedOutcome: React.PropTypes.func,
	selectedOutcomeID: React.PropTypes.string,
	tradeOrders: React.PropTypes.array,
	tradeSummary: React.PropTypes.object,
	onSubmitPlaceTrade: React.PropTypes.func,
	orderSides: React.PropTypes.object
};

export default TradePanel;
