import React, { PropTypes } from 'react';
import MarketsFilterSort from 'modules/markets/components/markets-filter-sort';
import Link from 'modules/link/components/link';

const MarketsHeaders = p => (
	<article>
		<div className="view-header">
			<div className="view-header-group">
				<h2>Markets</h2>
			</div>
			<div className="view-header-group">
				{p.loginAccount && p.loginAccount.address &&
					<Link
						className="button imperative navigational"
						disabled={!p.loginAccount.address}
						{...p.createMarketLink}
					>
						+ Create New Market
					</Link>
				}
			</div>
		</div>
		<MarketsFilterSort
			keywords={p.keywords}
			{...p.filterSort}
		/>
	</article>
);

MarketsHeaders.propTypes = {
	className: PropTypes.string,
	createMarketLink: PropTypes.object,
	loginAccount: PropTypes.object,
	marketsHeader: PropTypes.object,
	filterSort: PropTypes.object,
	keywords: PropTypes.object
};

export default MarketsHeaders;
