import React from 'react';
import Transactions from '../../transactions/components/transactions';

const TransactionsPage = p => (
	<main className="page transactions">
		<header className="page-header">
			<span className="big-line">{p.transactionsTotals.title}</span>
		</header>

		<div className="page-content">
			<Transactions
				className="transactions-content"
				transactions={p.transactions}
			/>
		</div>
	</main>
);

TransactionsPage.propTypes = {
	className: React.PropTypes.string,
	transactions: React.PropTypes.array,
	transactionsTotals: React.PropTypes.object
};

export default TransactionsPage;
