import React from 'react';
import MarketsHeaders from '../../markets/components/markets-headers';
import MarketsList from '../../markets/components/markets-list';

const MarketsView = (p) => {
	console.log('p -- ', p);

	return (
		<div>
			<MarketsHeaders
				createMarketLink={p.createMarketLink}
				loginAccount={p.loginAccount}
				marketsHeader={p.marketsHeader}
			/>
			<MarketsList
				markets={p.markets}
				pagination={p.pagination}
			/>
		</div>
	);
};

MarketsView.propTypes = {
	marketsHeader: React.PropTypes.object,
	markets: React.PropTypes.array,
	pagination: React.PropTypes.object,
	sortOptions: React.PropTypes.array
};

export default MarketsView;
