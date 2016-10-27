import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS } from 'modules/market/constants/market-component-nav-items';

export default {
	selected: MARKET_DATA_NAV_OUTCOMES,
	navItems: {
		[MARKET_DATA_NAV_OUTCOMES]: {
			label: 'Outcomes',
			onClick: () => {
				require('../selectors').update({
					marketDataNavItems: {
						...require('../selectors').marketDataNavItems,
						selected: MARKET_DATA_NAV_OUTCOMES
					}
				});
			}
		},
		[MARKET_DATA_NAV_CHARTS]: {
			label: 'Charts',
			onClick: () => {
				require('../selectors').update({
					marketDataNavItems: {
						...require('../selectors').marketDataNavItems,
						selected: MARKET_DATA_NAV_CHARTS
					}
				});
			}
		},
		[MARKET_DATA_NAV_DETAILS]: {
			label: 'Details',
			onClick: () => {
				require('../selectors').update({
					marketDataNavItems: {
						...require('../selectors').marketDataNavItems,
						selected: MARKET_DATA_NAV_DETAILS
					}
				});
			}
		}
	}
};
