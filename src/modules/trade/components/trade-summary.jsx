import React from 'react';
import Transaction from 'modules/transactions/components/transaction';

const TradeSummary = p => (
	<div className="trade-summary">
		<h5>Trade Summary</h5>

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

//	TODO -- Prop Validation
// TradeSummary.propTypes = {
// 	tradeSummary: React.PropTypes.object
// };

export default TradeSummary;
