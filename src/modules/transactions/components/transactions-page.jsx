import React from 'react';
import classnames from 'classnames';

import SiteHeader from '../../app/components/site-header';
import Transactions from '../../transactions/components/transactions';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		siteHeader: React.PropTypes.object,
		transactions: React.PropTypes.array,
		transactionsTotals: React.PropTypes.object
	},

	render: function() {
		var p = this.props;
		return (
			<main className="page transactions">
				<SiteHeader { ...p.siteHeader } />

				<header className="page-header">
					<span className="big-line">{ p.transactionsTotals.title }</span>
				</header>

				<Transactions
					className="page-content transactions-content"
					transactions={ p.transactions } />
			</main>
		);
	}
});