import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import {
	BID,
	ASK
} from '../../../modules/transactions/constants/types';

const TradePanelFooter = (p) => {
	const transactions = [];

	p.summary.tradeOrders.map((trade, i) => {
		let type = null;

		switch (trade.type) {
			case BID:
				type = 'BUY';
				break;
			case ASK:
				type = 'SELL';
				break;
			default:
				break;
		}

		transactions.push(
			<tr
				key={`${trade.data.outcomeName}${i}`}
				className='trade-panel-row'
			>
				<td className="outcome-name">{trade.data.outcomeName}</td>
				<td colSpan="2" >
					<div className="individual-transaction-summary" >
						<span className="transaction-type">{type}</span>
						<div className="transaction-shares">
							<ValueDenomination className="shares" {...trade.shares} />
						</div>
						<span className="shares-at">@</span>
						<div className="transaction-price">
							<ValueDenomination className="price" {...trade.ether} />
						</div>
					</div>
				</td>
				<td colSpan="4" />
				<td className="fee-to-pay" >
					<ValueDenomination {...trade.feeToPay} />
				</td>
				<td className="total-cost" >
					<ValueDenomination {...trade.profitLoss} />
				</td>
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
				<td className="fee-to-pay" >
					<ValueDenomination { ...p.summary.totalFees } />
				</td>
				<td className="total-cost" >
					<ValueDenomination { ...p.summary.totalEther } />
				</td>
			</tr>
		</tfoot>
	)
};

TradePanelFooter.propTypes = {
	summary: React.PropTypes.object
};

export default TradePanelFooter;