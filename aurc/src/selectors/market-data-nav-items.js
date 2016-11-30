import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_ORDERS, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS } from 'modules/app/constants/views';

export default {
	[MARKET_DATA_NAV_OUTCOMES]: {
		label: 'Outcomes'
	},
	[MARKET_DATA_ORDERS]: {
		label: 'Orders',
		mobileOnly: true
	},
	[MARKET_DATA_NAV_CHARTS]: {
		label: 'Charts'
	},
	[MARKET_DATA_NAV_DETAILS]: {
		label: 'Details'
	}
};
