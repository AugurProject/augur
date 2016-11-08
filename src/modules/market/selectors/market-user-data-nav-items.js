import { MARKET_USER_DATA_NAV_POSITIONS, MARKET_USER_DATA_NAV_OPEN_ORDERS } from 'modules/app/constants/views';

export default function () {
	return {
		[MARKET_USER_DATA_NAV_POSITIONS]: {
			label: 'Positions'
		},
		[MARKET_USER_DATA_NAV_OPEN_ORDERS]: {
			label: 'Orders'
		}
	};
}
