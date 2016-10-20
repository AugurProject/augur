import React from 'react';

import MarketOpen from 'modules/market/components/market-open';
import MarketClosed from 'modules/market/components/market-open';

const MarketView = p => (
	<section id="market_view">
		{(!p.market || !p.market.id) && <span className="description">No market</span>}
		{p.market && p.market.id && p.market.isOpen && <MarketOpen />}
		{p.market && p.market.id && !p.market.isOpen && <MarketClosed />}
	</section>
)

export default MarketView;
