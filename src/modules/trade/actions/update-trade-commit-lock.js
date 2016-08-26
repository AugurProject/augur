export const UPDATE_TRADE_COMMIT_LOCK = 'UPDATE_TRADE_COMMIT_LOCK';

export function updateTradeCommitLock(isLocked) {
	return { type: UPDATE_TRADE_COMMIT_LOCK, isLocked };
}
