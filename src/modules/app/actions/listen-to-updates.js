import * as AugurJS from '../../../services/augurjs';

import { updateAssets } from '../../auth/actions/update-assets';
import { updateCurrentBlock } from '../../app/actions/update-current-block';
import { loadMarket } from '../../markets/actions/load-market';
import { updateOutcomePrice } from '../../markets/actions/update-outcome-price';

export function listenToUpdates() {
	return function(dispatch, getState) {
		AugurJS.listenToUpdates(

			// new block
			(errNone, blockHash) => {
				dispatch(updateAssets());
				dispatch(updateCurrentBlock());
			},

			// transactions involving augur contracts
			(errNone, filtrate) => {
				console.log('augur contracts:', filtrate)
			},

			// outcome price update, { marketId, outcome (id), price }
			(errNone, outcomePriceChange) => {
				if (!outcomePriceChange || !outcomePriceChange.marketId || !outcomePriceChange.outcome || !outcomePriceChange.price) {
					return;
				}
				dispatch(updateOutcomePrice(outcomePriceChange.marketId, outcomePriceChange.outcome, parseFloat(outcomePriceChange.price)));
			},

			// new market, { blockNumber, marketId }
			(errNone, result) => {
				if (!result.marketId) {
					return;
				}
				dispatch(loadMarket(result.marketId));
			}
		);
	};
}