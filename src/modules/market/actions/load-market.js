import * as AugurJS from '../../../services/augurjs';

import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarket(marketID, cb) {
	return (dispatch, getState) => {
		AugurJS.loadMarket(marketID, (err, marketData) => {
			if (err) {
				console.info('ERROR: loadMarket()', err);
				return cb && cb();
			}
			if (marketData) {
				dispatch(updateMarketsData({ [marketID]: marketData }));
			}
			return cb && cb();
		});
	};
}
