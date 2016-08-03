import * as AugurJS from '../../../services/augurjs';

import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarketsInfo(marketIDs, cb) {
	return (dispatch, getState) => {
		if (!marketIDs || !marketIDs.length) {
			return;
		}

		AugurJS.batchGetMarketInfo(marketIDs, (err, marketsData) => {
			if (err) {
				console.error('ERROR loadMarketsInfo()', err);
				return;
			}

			dispatch(updateMarketsData(marketsData));

			cb && cb();
		});
	};
}
