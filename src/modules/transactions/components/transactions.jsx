import React from 'react';
import classnames from 'classnames';
import Transaction from './transaction';

const Transactions = (props) => {
	const p = this.props;
	return (
		<section className={classnames(p.className)}>
			{(p.transactions || []).map((transaction, i) =>
				<Transaction
					key={transaction.id}
					{...transaction}
					index={p.transactions.length - i}
				/>
			)}
			{!!p.transactions.length &&
				<span className="feel-free">
					You can continue using the site and placing trades while transactions are running. Just don't close the browser before they're done!
				</span>
			}
		</section>
	);
};
Transactions.propTypes = {
	className: React.PropTypes.string,
	transactions: React.PropTypes.array
};
export default Transactions;
