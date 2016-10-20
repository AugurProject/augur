import React, { PropTypes } from 'react';
import MarketsHeaders from '../../markets/components/markets-headers';
import MarketsList from '../../markets/components/markets-list';
import Branch from '../../branch/components/branch';

const MarketsView = p => (
	<section id="markets_view">
		{!!p.loginAccount.rep && !!p.loginAccount.rep.value &&
			<Branch {...p.branch} />
		}
		<MarketsHeaders
			createMarketLink={p.createMarketLink}
			loginAccount={p.loginAccount}
			marketsHeader={p.marketsHeader}
			filterSort={p.filterSort}
			keywords={p.keywords}
		/>
		<MarketsList
			loginAccount={p.loginAccount}
			markets={p.markets}
			pagination={p.pagination}
		/>
	</section>
);

MarketsView.propTypes = {
	className: PropTypes.string,
	filterSort: PropTypes.object,
	marketsHeader: PropTypes.object,
	markets: PropTypes.array,
	pagination: PropTypes.object,
	keywords: PropTypes.object,
	branch: PropTypes.object
};

export default MarketsView;
