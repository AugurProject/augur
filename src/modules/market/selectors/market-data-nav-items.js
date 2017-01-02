import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_ORDERS, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS, MARKET_DATA_NAV_REPORT } from '../../app/constants/views';

export default function () {
	return {
		[MARKET_DATA_NAV_OUTCOMES]: {
			label: 'Outcomes'
		},
		[MARKET_DATA_ORDERS]: {
			label: 'Order Book',
			isMobile: true
		},
		[MARKET_DATA_NAV_CHARTS]: {
			label: 'Charts'
		},
		[MARKET_DATA_NAV_DETAILS]: {
			label: 'Details'
		},
		[MARKET_DATA_NAV_REPORT]: {
			label: 'Report',
			isPendingReport: true
		}
	};
}
