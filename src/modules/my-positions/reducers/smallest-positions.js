import { UPDATE_SMALLEST_POSITIONS } from '../../my-positions/actions/update-account-trades-data';

export default function (smallestPositions = {}, action) {
	switch (action.type) {
		case UPDATE_SMALLEST_POSITIONS:
			return {
				...smallestPositions,
				[action.marketID]: action.smallestPosition
			};
		default:
			return smallestPositions;
	}
}
