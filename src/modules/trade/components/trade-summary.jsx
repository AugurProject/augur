import React from 'react';
import Transaction from '../../transactions/components/transaction';

const TradeSummary = (p) => (
	<div className="trade-summary">
		<h5>Best Case</h5>

		{p.tradeSummary && p.tradeSummary.tradeOrders && p.tradeSummary.tradeOrders.map((tradeOrder, i) => (
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
	tradeSummary: React.PropTypes.object
};

export default TradeSummary;
