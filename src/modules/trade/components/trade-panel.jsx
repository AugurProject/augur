import React from 'react';
import TradePanelHeader from '../../../modules/trade/components/trade-panel-header';
import TradePanelBody from '../../../modules/trade/components/trade-panel-body';
import TradeSummary from '../../../modules/trade/components/trade-summary';

const TradePanel = (p) => (
	<div className="trade-panel">
		<table className="trade-builder">
			<TradePanelHeader selectedOutcomeID={p.selectedOutcomeID} />
			{p.outcomes.map(outcome => (
				<TradePanelBody
					key={`${outcome.name}`}
					outcome={outcome}
					selectedOutcomeID={p.selectedOutcomeID}
					updateSelectedOutcome={p.updateSelectedOutcome}
				/>
			))}
		</table>

		{p.tradeOrders && !!p.tradeOrders.length &&
			<TradeSummary summary={p.tradeSummary} />
		}

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
	updateSelectedOutcome: React.PropTypes.func,
	selectedOutcomeID: React.PropTypes.string,
	tradeOrders: React.PropTypes.array,
	tradeSummary: React.PropTypes.object,
	onSubmitPlaceTrade: React.PropTypes.func
};

export default TradePanel;
