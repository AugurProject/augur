import React from 'react';
import Transactions from '../../transactions/components/transactions';

const TransactionsPage = (p) => (
	<main className="page transactions">
		<header className="page-header">
			<div className="l-container">
				<span className="big-line">{p.transactionsTotals.title}</span>
			</div>
		</header>

		<div className="page-content">
			<div className="l-container">
				<Transactions
					className="transactions-content"
					transactions={p.transactions}
				/>
			</div>
		</div>
	</main>
);

TransactionsPage.propTypes = {
	className: React.PropTypes.string,
	transactions: React.PropTypes.array,
	transactionsTotals: React.PropTypes.object
};

export default TransactionsPage;
