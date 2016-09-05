export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';

export function updateAccountTradesData(data) {
	return dispatch => {
		dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, data });
	};
}
