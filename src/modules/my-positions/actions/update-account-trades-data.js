export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';

export function updateAccountTradesData(data) {
	return dispatch => {
		const accountTradesMarketIDs = Object.keys(data);
		dispatch(loadMarketsInfo(accountTradesMarketIDs));
		dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, data });
	};
}
