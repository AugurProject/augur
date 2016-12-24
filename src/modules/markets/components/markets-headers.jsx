import React, { PropTypes } from 'react';
import MarketsFilterSort from 'modules/markets/components/markets-filter-sort';
import Link from 'modules/link/components/link';
import EmDash from 'modules/common/components/em-dash';

import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-headers';

const MarketsHeaders = p => (
	<article>
		<div className="view-header">
			<div className="view-header-group">
				<h2>
					Markets
					{p.marketsHeader.selectedMarketsHeader === FAVORITES && <span> <EmDash /> Favorites</span>}
					{p.marketsHeader.selectedMarketsHeader === PENDING_REPORTS && <span> <EmDash /> Pending Reports</span>}
				</h2>
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
