import { UPDATE_TRADE_COMMIT_LOCK } from '../../trade/actions/update-trade-commit-lock';

export default function (tradeCommitLock = {}, action) {
	switch (action.type) {
		case UPDATE_TRADE_COMMIT_LOCK:
			return { ...tradeCommitLock, isLocked: action.isLocked };
		default:
			return tradeCommitLock;
	}
}
