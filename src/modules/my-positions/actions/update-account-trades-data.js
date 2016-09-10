export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';
export const UPDATE_COMPLETE_SETS_BOUGHT = 'UPDATE_COMPLETE_SETS_BOUGHT';

export function updateAccountTradesData(data) {
	return dispatch => {
		dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, data });
	};
}

export function updateCompleteSetsBought(data) {
	return dispatch => {
		dispatch({ type: UPDATE_COMPLETE_SETS_BOUGHT, data });
	};
}
