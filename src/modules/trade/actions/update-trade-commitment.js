export const UPDATE_TRADE_COMMIT_LOCK = 'UPDATE_TRADE_COMMIT_LOCK';
export const UPDATE_TRADE_COMMITMENT = 'UPDATE_TRADE_COMMITMENT';

export function updateTradeCommitLock(isLocked) {
	return { type: UPDATE_TRADE_COMMIT_LOCK, isLocked };
}

export function updateTradeCommitment(tradeIDs) {
	return { type: UPDATE_TRADE_COMMITMENT, tradeIDs };
}
