import React, { PropTypes } from 'react';
import MarketsHeaders from '../../markets/components/markets-headers';
import MarketsList from '../../markets/components/markets-list';

const MarketsView = (p) => (
	<div>
		<MarketsHeaders
			createMarketLink={p.createMarketLink}
			loginAccount={p.loginAccount}
			marketsHeader={p.marketsHeader}
			marketsFilterSort={p.marketsFilterSort}
		/>
		<MarketsList
			markets={p.markets}
			pagination={p.pagination}
		/>
	</div>
);

MarketsView.propTypes = {
	marketsHeader: PropTypes.object,
	markets: PropTypes.array,
	pagination: PropTypes.object,
	marketSortOptions: PropTypes.object
};

export default MarketsView;
