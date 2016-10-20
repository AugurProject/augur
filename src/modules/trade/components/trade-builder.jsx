import React from 'react';
import TradeBuilderRow from 'modules/trade/components/trade-builder-row';

const TradePanel = p => (
	<table className="trade-builder">
		<thead className="trade-builder-header">
			<tr>
				<th className="outcome-name">Outcome</th>
				<th className="bid">{p.selectedOutcome.selectedOutcomeID ? 'Buy Orders' : 'Top Buy'}</th>
				<th className="ask">{p.selectedOutcome.selectedOutcomeID ? 'Sell Orders' : 'Top Sell'}</th>
				<th className="buy-sell-button" />
				<th className="num-shares">Shares</th>
				<th className="limit-price">Limit</th>
				<th className="fee-to-pay">Fee</th>
				<th className="total-cost">Total</th>
			</tr>
		</thead>

		<tbody className="trade-builder-body">
			{p.outcomes.map(outcome => (
				<TradeBuilderRow
					key={outcome.id}
					{...outcome}
					marketType={p.marketType}
					showFullOrderBook={!!p.selectedOutcome && !!p.selectedOutcome.selectedOutcomeID && p.selectedOutcome.selectedOutcomeID === outcome.id}
					isFaded={!!p.selectedOutcome && !!p.selectedOutcome.selectedOutcomeID && p.selectedOutcome.selectedOutcomeID !== outcome.id}
					updateSelectedOutcome={p.selectedOutcome.updateSelectedOutcome}
				/>
			))}
		</tbody>
	</table>
);


// TODO -- Prop Validations
// TradePanel.propTypes = {
// 	outcomes: React.PropTypes.array,
// 	marketType: React.PropTypes.string,
// 	selectedOutcome: React.PropTypes.object,
// 	userOpenOrdersSummary: React.PropTypes.object
// };

export default TradePanel;
