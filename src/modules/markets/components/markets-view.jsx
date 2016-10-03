import React, { PropTypes } from 'react';
import MarketsHeaders from '../../markets/components/markets-headers';
import MarketsList from '../../markets/components/markets-list';

const MarketsView = (p) => (
	<section className={p.className}>
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
	</section>
);

MarketsView.propTypes = {
	className: PropTypes.string,
	marketsFilterSort: PropTypes.object,
	marketsHeader: PropTypes.object,
	markets: PropTypes.array,
	pagination: PropTypes.object
};

export default MarketsView;
