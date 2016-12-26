import React from 'react';
import Transactions from 'modules/transactions/components/transactions';
import Branch from 'modules/branch/components/branch';

const TransactionsPage = p => (
	<section id="transactions_view">
		{!!p.loginAccount.rep && !!p.loginAccount.rep.value &&
			<Branch {...p.branch} />
		}

		<header className="page-header">
			<span className="big-line">{p.transactionsTotals.title}</span>
		</header>

		<div className="page-content">
			<Transactions
				className="transactions-content"
				transactions={p.transactions}
			/>
		</div>
	</section>
);

TransactionsPage.propTypes = {
	branch: React.PropTypes.object,
	className: React.PropTypes.string,
	loginAccount: React.PropTypes.object,
	transactions: React.PropTypes.array,
	transactionsTotals: React.PropTypes.object
};

export default TransactionsPage;
