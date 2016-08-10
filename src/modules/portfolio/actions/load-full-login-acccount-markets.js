import { loadFullMarket } from '../../../modules/market/actions/load-full-market';

export function loadFullLoginAccountMarkets() {
	return dispatch => {
		const { allMarkets, loginAccount } = require('../../../selectors');

		allMarkets.filter(market => market.author === loginAccount.id).forEach(market => {
			dispatch(loadFullMarket(market.id));
		});
	};
}
