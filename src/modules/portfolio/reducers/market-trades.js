import { UPDATE_MARKET_TRADES_DATA } from '../../../modules/portfolio/actions/update-market-trades-data';

export default function (marketTrades = {}, action){
	switch(action.type){
		case UPDATE_MARKET_TRADES_DATA:
			return {
				...marketTrades,
				...action.data
			};
		case CLEAR_LOGIN_ACCOUNT:
			return {};
		default:
			return marketTrades;
	}
}