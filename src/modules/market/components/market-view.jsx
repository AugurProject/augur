import React from 'react';

import MarketActive from 'modules/market/components/market-active';
import MarketReported from 'modules/market/components/market-reported';

const MarketView = p => (
	<section id="market_view">
		{(!p.market || !p.market.id) && <span className="description">No market</span>}
		{p.market && p.market.id && p.market.isOpen && <MarketActive {...p} />}
		{p.market && p.market.id && !p.market.isOpen && <MarketReported {...p} />}
	</section>
);

export default MarketView;
