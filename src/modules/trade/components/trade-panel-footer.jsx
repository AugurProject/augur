import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import {
	BUY_SHARES,
	SELL_SHARES,
	BID_SHARES,
	ASK_SHARES
} from '../../../modules/transactions/constants/types';

const TradePanelFooter = (p) => {
	console.log('TradePanelSummary p -- ', p);

	const transactions = [];

	p.transactions.map((trade, i) => {
		let type = null;

		switch (trade.type) {
			case BUY_SHARES:
				type = 'BUY';
				break;
			case BID_SHARES:
				type = 'BID';
				break;
			case SELL_SHARES:
				type = 'SELL';
				break;
			case ASK_SHARES:
				type = 'ASK';
				break;
			default:
				break;
		}

		transactions.push(
			<tr key={`${trade.data.outcomeName}${i}`}>
				<td>{trade.data.outcomeName}</td>
				<td colSpan="6">
					<span className="transaction-type">{type}</span>
					<ValueDenomination className="shares" {...trade.shares} /> Shares
					<span className="shares-at">@</span>
					<ValueDenomination className="price" {...trade.ether} /> eth
				</td>
				<td></td>
				<td></td>
			</tr>
		)
	});

	return (
		<tfoot className="transaction-summary">
			<tr className={classnames('header-row', 'summary-title')}>
				<td colSpan="9" >Trade Summary</td>
			</tr>
			<tr className={classnames('header-row', 'summary-headers')}>
				<td>Outcomes</td>
				<td colSpan="6">Transactions</td>
				<td>Fee</td>
				<td>Profit/Loss</td>
			</tr>
			{transactions}
			<tr className="summary-totals">
				<td></td>
				<td colSpan="6">Total Transactions...TODO</td>
				<td>Total Fees...TODO</td>
				<td>Total P/L...TODO</td>
			</tr>
		</tfoot>
	)
};

TradePanelFooter.propTypes = {
	tradeOrders: React.PropTypes.array
};

export default TradePanelFooter;


// <span className="description">
// 				<span className="action">{nodes.action}</span>
// 				<ValueDenomination className="shares" {...p.shares} />
// 				<span className="at">at</span>
// 				<ValueDenomination className="avgPrice" {...p.data.avgPrice} />
// 				<span className="of">of</span>
// 				<span className="outcome-name">{p.data.outcomeName.substring(0, 35) + (p.data.outcomeName.length > 35 && '...' || '')}</span>
// 				<br />
// 				<span className="market-description" title={p.data.marketDescription}>
// 					{p.data.marketDescription.substring(0, 100) + (p.data.marketDescription.length > 100 && '...' || '')}
// 				</span>
// 			</span>