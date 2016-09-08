import { loadFullMarket } from '../../../modules/market/actions/load-full-market';
import { loadMarketCreatorFees } from '../../my-markets/actions/load-market-creator-fees';

export function loadFullLoginAccountMarkets() {
	return dispatch => {
		const { allMarkets, loginAccount } = require('../../../selectors');

		allMarkets.filter(market => market.author === loginAccount.id).forEach(market => {
			dispatch(loadFullMarket(market.id));
			dispatch(loadMarketCreatorFees(market.id));
		});
	};
}
