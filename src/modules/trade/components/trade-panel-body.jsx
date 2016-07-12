import React from 'react';
import TradePanelRow from '../../../modules/trade/components/trade-panel-row';
import { ORDER } from '../../../modules/trade/constants/row-types';

const TradePanelBody = (p) => {
	let orderBookRows = [];
	const orderBookLength =	p.outcome.orderBook.bids.length > p.outcome.orderBook.asks.length ?
								p.outcome.orderBook.bids.length :
								p.outcome.orderBook.asks.length;

	for (let i = 0; i <= orderBookLength; i++) {
		if (i !== 0) {
			orderBookRows.push(
				<TradePanelRow
					key={`outcome-${i}`}
					outcome={p.outcome}
					selectedOutcomeID={p.selectedOutcomeID}
					constants={p.constants}
					item={i}
					type={ORDER}
				/>
			);
		}
	}

	return (
		<tbody
			id={`${p.outcome.name}-${p.outcome.id}`}
			className="trade-panel-body"
		>
			<TradePanelRow
				outcome={p.outcome}
				sideOptions={p.sideOptions}
				updateSelectedOutcome={p.updateSelectedOutcome}
				constants={p.constants}
			/>
			{orderBookRows}
		</tbody>
	);
};

TradePanelBody.propTypes = {
	outcome: React.PropTypes.object,
	sideOptions: React.PropTypes.array,
	selectedOutcomeID: React.PropTypes.string,
	updateSelectedOutcome: React.PropTypes.func,
	constants: React.PropTypes.object
};

export default TradePanelBody;
