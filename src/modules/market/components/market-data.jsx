import React, { Component } from 'react';

import ComponentNav from 'modules/common/components/component-nav';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_INFO } from 'modules/market/constants/market-component-nav-items';

const MarketData = p => (
	<article className="market-data">
		<h3>{p.market.description}</h3>
		<ComponentNav navItems={p.marketDataNavItems} />
	</article>
)

export default MarketData;
