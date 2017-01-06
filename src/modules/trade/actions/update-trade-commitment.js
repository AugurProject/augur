export const UPDATE_TRADE_COMMIT_LOCK = 'UPDATE_TRADE_COMMIT_LOCK';
export const UPDATE_TRADE_COMMITMENT = 'UPDATE_TRADE_COMMITMENT';

export const updateTradeCommitLock = isLocked => ({ type: UPDATE_TRADE_COMMIT_LOCK, isLocked });
export const updateTradeCommitment = tradeCommitment => ({ type: UPDATE_TRADE_COMMITMENT, tradeCommitment });
