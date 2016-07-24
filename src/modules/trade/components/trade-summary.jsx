import React from 'react';
import Transaction from '../../transactions/components/transaction';

const TradeSummary = (p) => (
	<div className="trade-summary">
		<h5>Trade Summary</h5>

		{p.summary && p.summary.tradeOrders && p.summary.tradeOrders.map((tradeOrder, i) => (
			<Transaction
				key={i}
				className="order"
				{...tradeOrder}
				status={undefined}
			/>
		))}
	</div>
);

TradeSummary.propTypes = {
	summary: React.PropTypes.object
};

export default TradeSummary;
