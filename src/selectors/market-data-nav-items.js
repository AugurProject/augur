import links from 'selectors/links';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_INFO } from 'modules/market/constants/market-component-nav-items';

export default {
	selected: MARKET_DATA_NAV_OUTCOMES,
	[MARKET_DATA_NAV_OUTCOMES]: {
		label: 'Outcomes',
		link: links.marketDataNavOutcomesLink,
	},
	[MARKET_DATA_NAV_CHARTS]: {
		label: 'Charts',
		link: links.marketDataNavChartsLink
	},
	[MARKET_DATA_NAV_INFO]: {
		label: 'Information',
		link: links.marketDataNavInfoLink
	}
};
