import links from 'selectors/links';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_INFO } from 'modules/market/constants/market-component-nav-items';

export default [
	{
		id: MARKET_DATA_NAV_OUTCOMES,
		label: 'Outcomes',
		link: links.marketDataNavOutcomesLink,
		selected: true // Default
	},
	{
		id: MARKET_DATA_NAV_CHARTS,
		label: 'Charts',
		link: links.marketDataNavChartsLink
	},
	{
		id: MARKET_DATA_NAV_INFO,
		label: 'Information',
		link: links.marketDataNavInfoLink
	}
];
