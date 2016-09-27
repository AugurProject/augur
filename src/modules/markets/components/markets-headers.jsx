import React, { PropTypes } from 'react';
import MarketsFilterSort from '../../markets/components/markets-filter-sort';
import Link from '../../link/components/link';

const MarketsHeaders = (p) => (
	<div>
		<div className="view-header">
			<div className="left-header">
				<h2>Markets</h2>
			</div>
			<div className="right-header">
				<Link
					className="button make imperative"
					disabled={!p.loginAccount.id}
					{...p.createMarketLink}
				>
					+ Create New Market
				</Link>
			</div>
		</div>
		<MarketsFilterSort {...p.marketsFilterSort} />
	</div>
);

MarketsHeaders.propTypes = {
	createMarketLink: PropTypes.object,
	loginAccount: PropTypes.object,
	marketsHeader: PropTypes.object,
	marketsFilterSort: PropTypes.object
}

export default MarketsHeaders;