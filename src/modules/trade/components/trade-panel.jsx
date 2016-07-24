import React from 'react';
import TradeBuilder from '../../../modules/trade/components/trade-builder';
import TradeSummary from '../../../modules/trade/components/trade-summary';

const TradePanel = (p) => (
	<div className="trade-panel" onClick={() => p.selectedOutcome.updateSelectedOutcome(null)}>
		<TradeBuilder
			outcomes={p.outcomes}
			selectedOutcome={p.selectedOutcome}
		/>

		{!!p.tradeSummary && !!p.tradeOrders && !!p.tradeOrders.length &&
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
	selectedOutcome: React.PropTypes.object,
	tradeOrders: React.PropTypes.array,
	tradeSummary: React.PropTypes.object,
	onSubmitPlaceTrade: React.PropTypes.func
};

export default TradePanel;
