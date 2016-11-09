import { MARKET_REPORTING_NAV_REPORT, MARKET_REPORTING_NAV_DETAILS } from '../../app/constants/views';

export default function () {
	return {
		[MARKET_REPORTING_NAV_REPORT]: {
			label: 'Report'
		},
		[MARKET_REPORTING_NAV_DETAILS]: {
			label: 'Details'
		}
	};
}
