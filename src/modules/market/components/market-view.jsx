import React from 'react';

import MarketActive from 'modules/market/components/market-active';
import MarketReported from 'modules/market/components/market-reported';

import NullStateMessage from 'modules/common/components/null-state-message';

const MarketView = (p) => {
	const nullMessage = 'No Market Data';

	return (
		<section id="market_view">
			{(!p.market || !p.market.id) && <NullStateMessage message={nullMessage} />}
			{p.market && p.market.id && p.market.isOpen && <MarketActive {...p} />}
			{p.market && p.market.id && !p.market.isOpen && <MarketReported {...p} />}
		</section>
	);
};

export default MarketView;
