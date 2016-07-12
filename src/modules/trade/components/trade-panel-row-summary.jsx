import React from 'react';
import ValueDenomination from '../../../modules/common/components/value-denomination';

const TradePanelRowSummary = (p) => {
	let type = null;

	switch (p.trade.type) {
	case p.constants.BID:
		type = 'BUY';
		break;
	case p.constants.ASK:
		type = 'SELL';
		break;
	default:
		break;
	}

	return (
		<tr className="trade-panel-row" >
			<td className="outcome-name">{p.trade.data.outcomeName}</td>
			<td colSpan="2" >
				<div className="individual-transaction-summary" >
					<span className="transaction-type">{type}</span>
					<div className="transaction-shares">
						<ValueDenomination className="shares" {...p.trade.shares} />
					</div>
					<span className="shares-at">@</span>
					<div className="transaction-price">
						<ValueDenomination className="price" {...p.trade.ether} />
					</div>
				</div>
			</td>
			<td colSpan="4" />
			<td className="fee-to-pay" >
				<ValueDenomination {...p.trade.feeToPay} />
			</td>
			<td className="total-cost" >
				<ValueDenomination {...p.trade.profitLoss} />
			</td>
		</tr>
	);
};

TradePanelRowSummary.propTypes = {
	trade: React.PropTypes.object,
	constants: React.PropTypes.object
};

export default TradePanelRowSummary;