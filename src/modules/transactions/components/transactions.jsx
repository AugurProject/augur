import React from 'react';
import Transaction from 'modules/transactions/components/transaction';

const Transactions = p => (
	<article className={p.className}>
		<div className="transactions-container">
			{(p.transactions || []).map((transaction, i) =>
				<Transaction
					key={transaction.id}
					{...transaction}
					index={p.transactions.length - i}
				/>
			)}
		</div>
		{!!p.transactions.length &&
			<span className="feel-free">
				{"continue trading while transactions are running, just don't close the browser before they're done!"}
			</span>
		}
	</article>
);

// TODO -- prop validations
// Transactions.propTypes = {
// 	transactions: React.PropTypes.array
// };
export default Transactions;
