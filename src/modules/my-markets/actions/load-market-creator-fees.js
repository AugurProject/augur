import { augur, abi } from '../../../services/augurjs';

import { updateMarketCreatorFees } from '../../my-markets/actions/update-market-creator-fees';

export function loadMarketCreatorFees(marketId) {
	return (dispatch) => {
		augur.getMarketCreatorFeesCollected(marketId, (fees) => {
			if (fees) {
				const marketFees = {};
				marketFees[marketId] = abi.bignum(fees);
				dispatch(updateMarketCreatorFees(marketFees));
			}
		});
	};
}
