export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';
export const UPDATE_COMPLETE_SETS_BOUGHT = 'UPDATE_COMPLETE_SETS_BOUGHT';
export const UPDATE_SELL_COMPLETE_SETS_LOCK = 'UPDATE_SELL_COMPLETE_SETS_LOCK';

export function updateSellCompleteSetsLock(marketID, isLocked) {
	return (dispatch) => {
		dispatch({ type: UPDATE_SELL_COMPLETE_SETS_LOCK, marketID, isLocked });
	};
}

export function updateAccountTradesData(data) {
	return (dispatch) => {
		dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, data });
	};
}

export function updateCompleteSetsBought(data) {
	return (dispatch) => {
		dispatch({ type: UPDATE_COMPLETE_SETS_BOUGHT, data });
	};
}
