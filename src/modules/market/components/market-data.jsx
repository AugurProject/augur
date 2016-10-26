import React from 'react';

import ComponentNav from 'modules/common/components/component-nav';
import Outcomes from 'modules/outcomes/components/outcomes';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_INFO } from 'modules/market/constants/market-component-nav-items';

const MarketData = (p) => {
	console.log('p.market -- ', p.market);

	return (
		<article className="market-data">
			<h3>{p.market.description}</h3>
			<ComponentNav navItems={p.marketDataNavItems} />

			{p.marketDataNavItems.selected === MARKET_DATA_NAV_OUTCOMES &&
				<Outcomes outcomes={p.market.outcomes} />
			}
			{p.marketDataNavItems.selected === MARKET_DATA_NAV_CHARTS &&
				<span>Charts</span>
			}
			{p.marketDataNavItems.selected === MARKET_DATA_NAV_INFO &&
				<span>Info</span>
			}

		</article>
	);
};

export default MarketData;
