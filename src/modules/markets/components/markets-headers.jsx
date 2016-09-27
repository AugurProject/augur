import React, { PropTypes } from 'react';
import MarketsFilters from '../../markets/components/markets-filters';
import Link from '../../link/components/link';

const MarketsHeaders = (p) => (
	<div>
		<div className="view-header">
			<div className="left-header">
				<h2>Markets</h2>
			</div>
			<div className="right-header">
				<Link className="button make" {...p.createMarketLink} disabled={!p.loginAccount.id}>
					Make a Market
				</Link>
			</div>
		</div>
		<div className="view-header">
			<MarketsFilters {...p.marketsHeader} />
		</div>
	</div>
);

MarketsHeaders.propTypes = {
	createMarketLink: PropTypes.object,
	loginAccount: PropTypes.object,
	marketsHeader: PropTypes.object
}

export default MarketsHeaders;