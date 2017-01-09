import { UPDATE_POSITION_STATUS } from 'modules/my-positions/actions/close-position';

export default function (positionStatus = {}, action) {
	switch (action.type) {
		case UPDATE_POSITION_STATUS:
			return {
				...positionStatus,
				[action.marketID]: {
					...positionStatus[action.marketID],
					[action.outcomeID]: action.status
				}
			};
		default:
			return positionStatus;
	}
}
