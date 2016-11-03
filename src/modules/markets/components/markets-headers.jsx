import React, { PropTypes } from 'react';
import MarketsFilterSort from 'modules/markets/components/markets-filter-sort';
import Link from 'modules/link/components/link';

const MarketsHeaders = p => (
	<article>
		<div className="view-header">
			<div className="view-header-group-1">
				<h2>Markets</h2>
			</div>
			<div className="view-header-group-2">
				{p.loginAccount && p.loginAccount.id &&
					<Link
						className="button imperative navigational"
						disabled={!p.loginAccount.id}
						{...p.createMarketLink}
					>
						+ Create New Market
					</Link>
				}
			</div>
		</div>
		<MarketsFilterSort
			className="view-header"
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
