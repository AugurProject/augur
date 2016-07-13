import React from 'react';
import { OUTCOME, ORDER, SUMMARY } from '../../../modules/trade/constants/row-types';
import TradePanelRowOutcome from '../../../modules/trade/components/trade-panel-row-outcome';
import TradePanelRowOrder from '../../../modules/trade/components/trade-panel-row-order';
import TradePanelRowSummary from '../../../modules/trade/components/trade-panel-row-summary';

const TradePanelRow = (p) => {
	switch (p.type) {
	default:
	case OUTCOME:
		return (
			<TradePanelRowOutcome
				outcome={p.outcome}
				sideOptions={p.sideOptions}
				updateSelectedOutcome={p.updateSelectedOutcome}
			/>
		);
	case ORDER:
		return (
			<TradePanelRowOrder
				outcome={p.outcome}
				selectedOutcomeID={p.selectedOutcomeID}
				orderSides={p.orderSides}
				itemIndex={p.itemIndex}
			/>
		);
	case SUMMARY:
		return (
			<TradePanelRowSummary
				type={p.type}
				orderSides={p.orderSides}
				trade={p.trade}
			/>
		);
	}
};

TradePanelRow.propTypes = {
	outcomes: React.PropTypes.array,
	sideOptions: React.PropTypes.array,
	selectedOutcomeID: React.PropTypes.string,
	updateSelectedOutcome: React.PropTypes.func,
	summary: React.PropTypes.object,
	orderSides: React.PropTypes.object,
	type: React.PropTypes.string,
	itemIndex: React.PropTypes.number
};

export default TradePanelRow;
