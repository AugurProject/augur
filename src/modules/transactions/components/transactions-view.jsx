import React from 'react';
import Transactions from 'modules/transactions/components/transactions';
import Branch from 'modules/branch/components/branch';

const TransactionsPage = p => (
	<section id="transactions_view">
		{!!p.loginAccount.rep && !!p.loginAccount.rep.value &&
			<Branch {...p.branch} />
		}

		<div className="view-header">
			<h2>Transactions</h2>
		</div>

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
	transactions: React.PropTypes.array
};

export default TransactionsPage;
