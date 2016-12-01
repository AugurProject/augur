import { UPDATE_SELL_COMPLETE_SETS_LOCK } from '../../my-positions/actions/update-account-trades-data';

export default function (sellCompleteSetsLock = {}, action) {
	switch (action.type) {
		case UPDATE_SELL_COMPLETE_SETS_LOCK:
			return {
				...sellCompleteSetsLock,
				[action.marketID]: action.isLocked
			};
		default:
			return sellCompleteSetsLock;
	}
}
