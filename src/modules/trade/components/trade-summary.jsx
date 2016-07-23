import React from 'react';
import Transaction from '../../transactions/components/transaction';

const TradeSummary = (p) => (
	<div className="trade-orders">
		<h5>Trade Summary</h5>

		{p.tradeOrders && p.summary.tradeTransactions.map((tradeTransaction, i) => (
			<Transaction
				key={i}
				className="order"
				{...tradeTransaction}
				status={undefined}
			/>
		))}

		<Transaction
			type="trade_summary"
			shares={p.summary.totalShares}
			className="order total"
			ether={p.summary.totalEther}
			gas={p.summary.totalFees}
			gas={p.summary.totalGas}
			status={undefined}
		/>
	</div>
);

TradeSummary.propTypes = {
	summary: React.PropTypes.object
};

export default TradeSummary;
