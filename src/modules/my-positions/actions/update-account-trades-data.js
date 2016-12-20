import { convertTradingLogsToTransactions } from '../../transactions/actions/convert-logs-to-transactions';

export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA';
export const UPDATE_COMPLETE_SETS_BOUGHT = 'UPDATE_COMPLETE_SETS_BOUGHT';
export const UPDATE_NET_EFFECTIVE_TRADES_DATA = 'UPDATE_NET_EFFECTIVE_TRADES_DATA';
export const UPDATE_SELL_COMPLETE_SETS_LOCK = 'UPDATE_SELL_COMPLETE_SETS_LOCK';
export const UPDATE_SMALLEST_POSITIONS = 'UPDATE_SMALLEST_POSITIONS';

export function updateSmallestPositions(marketID, smallestPosition) {
	return { type: UPDATE_SMALLEST_POSITIONS, marketID, smallestPosition };
}

export function updateSellCompleteSetsLock(marketID, isLocked) {
	return { type: UPDATE_SELL_COMPLETE_SETS_LOCK, marketID, isLocked };
}

export function updateAccountBidsAsksData(data, marketID) {
	return (dispatch, getState) => {
		dispatch(convertTradingLogsToTransactions('log_add_tx', data, marketID));
	};
}

export function updateAccountCancelsData(data, marketID) {
	return (dispatch, getState) => {
		dispatch(convertTradingLogsToTransactions('log_cancel', data, marketID));
	};
}

export function updateAccountTradesData(data, marketID) {
	return (dispatch, getState) => {
		dispatch(convertTradingLogsToTransactions('log_fill_tx', data, marketID));
		dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, data, marketID });
	};
}

export function updateAccountPositionsData(data, marketID) {
	return { type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketID };
}

export function updateNetEffectiveTradesData(data, marketID) {
	return { type: UPDATE_NET_EFFECTIVE_TRADES_DATA, data, marketID };
}

export function updateCompleteSetsBought(data, marketID) {
	return { type: UPDATE_COMPLETE_SETS_BOUGHT, data, marketID };
}
