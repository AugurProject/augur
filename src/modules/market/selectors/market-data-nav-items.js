import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS } from '../../app/constants/views';

export default function () {
	return {
		[MARKET_DATA_NAV_OUTCOMES]: {
			label: 'Outcomes'
		},
		[MARKET_DATA_NAV_CHARTS]: {
			label: 'Charts'
		},
		[MARKET_DATA_NAV_DETAILS]: {
			label: 'Details'
		}
	};
}
