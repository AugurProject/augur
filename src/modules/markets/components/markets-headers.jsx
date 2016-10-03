import React, { PropTypes } from 'react';
import MarketsFilterSort from '../../markets/components/markets-filter-sort';
import Link from '../../link/components/link';

const MarketsHeaders = (p) => (
	<article className={p.className}>
		<div className="view-header">
			<div className="view-header-group-1">
				<h2>Markets</h2>
			</div>
			<div className="view-header-group-2">
				<Link
					className="button imperative"
					disabled={!p.loginAccount.id}
					{...p.createMarketLink}
				>
					+ Create New Market
				</Link>
			</div>
		</div>
		<MarketsFilterSort
			className="view-header"
			keywords={p.keywords}
			{...p.marketsFilterSort}
		/>
	</article>
);

MarketsHeaders.propTypes = {
	className: PropTypes.string,
	createMarketLink: PropTypes.object,
	loginAccount: PropTypes.object,
	marketsHeader: PropTypes.object,
	marketsFilterSort: PropTypes.object,
	keywords: PropTypes.object
};

export default MarketsHeaders;
