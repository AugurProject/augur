import React from 'react';
import classnames from 'classnames';
import Transaction from './transaction';

const Transactions = (p) => (
	<section className={classnames(p.className)}>
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
				Feel free to continue trading while transactions are running, just don't close the browser before they're done!
			</span>
		}
	</section>
);

Transactions.propTypes = {
	className: React.PropTypes.string,
	transactions: React.PropTypes.array
};
export default Transactions;
