import { UPDATE_MARKET_CREATOR_FEES } from '../../my-markets/actions/update-market-creator-fees';

export default function (marketCreatorFees = {}, action) {
	switch (action.type) {
		case UPDATE_MARKET_CREATOR_FEES:
			return {
				...marketCreatorFees,
				...action.data
			};
		default:
			return marketCreatorFees;
	}
}
