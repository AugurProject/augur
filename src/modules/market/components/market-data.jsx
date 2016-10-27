import React from 'react';

import ComponentNav from 'modules/common/components/component-nav';
import Outcomes from 'modules/outcomes/components/outcomes';
import MarketChart from 'modules/market/components/market-chart';
import MarketInfo from 'modules/market/components/market-info';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_INFO } from 'modules/market/constants/market-component-nav-items';

const MarketData = p => (
	<article className="market-data">
		<h3>{p.market.description}</h3>
		<ComponentNav navItems={p.marketDataNavItems} />

		{p.marketDataNavItems.selected === MARKET_DATA_NAV_OUTCOMES &&
			<Outcomes
				outcomes={p.market.outcomes}
				selectedOutcome={p.selectedOutcome}
				updateSelectedOutcome={p.updateSelectedOutcome}
			/>
		}
		{p.marketDataNavItems.selected === MARKET_DATA_NAV_CHARTS &&
			<MarketChart series={p.market.priceTimeSeries} />
		}
		{p.marketDataNavItems.selected === MARKET_DATA_NAV_INFO &&
			<MarketInfo {...p.market} />
		}

	</article>
);

export default MarketData;
