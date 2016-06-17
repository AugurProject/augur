import React from 'react';
// import classnames from 'classnames';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Transactions from '../../transactions/components/transactions';

const TransactionsPage = (props) => {
	const p = this.props;
	return (
		<main className="page transactions">
			<SiteHeader {...p.siteHeader} />

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

			<SiteFooter />
		</main>
	);
};

TransactionsPage.propTypes = {
	className: React.PropTypes.string,
	siteHeader: React.PropTypes.object,
	transactions: React.PropTypes.array,
	transactionsTotals: React.PropTypes.object
};

export default TransactionsPage;
