import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../../modules/common/components/value-denomination';

const TradePanelFooter = (p) => {
	const transactions = [];

	p.summary.tradeOrders.map((trade, i) => {
		let type = null;

		switch (trade.type) {
		case p.constants.BID:
			type = 'BUY';
			break;
		case p.constants.ASK:
			type = 'SELL';
			break;
		default:
			break;
		}

		transactions.push(
			<tr
				key={`${trade.data.outcomeName}${i}`}
				className="trade-panel-row"
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
					<ValueDenomination {...trade.data.feeToPay} />
				</td>
				<td className="total-cost" >
					{p.constants.BID === trade.type ? <ValueDenomination {...trade.etherNegative} /> : <ValueDenomination {...trade.ether} />}
				</td>
			</tr>
		);

		return null;
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
				<td />
				<td colSpan="2">
					<div className="total-transaction-summary" >
						<pre className="transaction-type"></pre>
						<div className="transaction-shares">
							<ValueDenomination className="shares" {...p.summary.totalShares} />
						</div>
						<pre className="shares-at"></pre>
						<pre className="transaction-price"></pre>
					</div>
				</td>
				<td colSpan="4" />
				<td className="fee-to-pay" >
					<ValueDenomination {...p.summary.feeToPay} />
				</td>
				<td className="total-cost" >
					<ValueDenomination {...p.summary.totalEther} />
				</td>
			</tr>
		</tfoot>
	);
};

TradePanelFooter.propTypes = {
	summary: React.PropTypes.object,
	constants: React.PropTypes.object
};

export default TradePanelFooter;
