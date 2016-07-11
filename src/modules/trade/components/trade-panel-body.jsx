import React from 'react';
import TradePanelRow from './trade-panel-row';
import { ORDER } from '../../../modules/trade/constants/row-types';


const TradePanelBody = (p) => {
	let orderBookRows = [];
	let orderBookLength =	p.outcome.orderBook.bids.length > p.outcome.orderBook.asks.length ?
								p.outcome.orderBook.bids.length :
								p.outcome.orderBook.asks.length;

	for (let i = 0; i <= orderBookLength; i++){
		orderBookRows.push(
			<TradePanelRow
				key={`outcome-${i}`}
				outcome={p.outcome}
				selectedOutcomeID={p.selectedOutcomeID}
				item={i}
				type={ORDER}
			/>
		)
	}

	return (
		<tbody className="trade-panel-body" >
			<TradePanelRow
				outcome={p.outcome}
				sideOptions={p.sideOptions}
				updateSelectedOutcome={p.updateSelectedOutcome}
			/>
			{ orderBookRows }
		</tbody>
	);
};

TradePanelBody.propTypes = {
	outcome: React.PropTypes.object,
	sideOptions: React.PropTypes.array,
	selectedOutcomeID: React.PropTypes.string,
	updateSelectedOutcome: React.PropTypes.func
};

export default TradePanelBody;
