import React from 'react';
import TradePanelRowOutcome from '../../../modules/trade/components/trade-panel-row-outcome';
import TradePanelRowOrder from '../../../modules/trade/components/trade-panel-row-order';

const TradePanelBody = (p) => {
	let orderBookRows = [];
	const orderBookLength =	Math.max(p.outcome.orderBook.bids.length, p.outcome.orderBook.asks.length);
	const secondItemIndex = 1; // first item is displayed in different row

	for (let i = secondItemIndex; i < orderBookLength; i++) {
		orderBookRows.push(
			<TradePanelRowOrder
				key={`outcome-${i}`}
				outcome={p.outcome}
				selectedOutcomeID={p.selectedOutcomeID}
				itemIndex={i}
			/>
		);
	}

	return (
		<tbody className="trade-panel-body">
			<TradePanelRowOutcome
				outcome={p.outcome}
				selectedOutcomeID={p.selectedOutcomeID}
				updateSelectedOutcome={p.updateSelectedOutcome}
			/>
			{orderBookRows}
		</tbody>
	);
};

TradePanelBody.propTypes = {
	outcome: React.PropTypes.object,
	selectedOutcomeID: React.PropTypes.string,
	updateSelectedOutcome: React.PropTypes.func
};

export default TradePanelBody;
