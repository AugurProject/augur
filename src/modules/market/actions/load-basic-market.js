import * as AugurJS from '../../../services/augurjs';

import { ParseMarketsData } from '../../../utils/parse-market-data';

import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadBasicMarket(marketID, cb) {
	return function(dispatch, getState) {
		AugurJS.loadMarket(marketID, (err, marketData) => {
			var marketDataOutcomesData;
			if (err) {
				console.info("ERROR: loadMarket()", err);
				return cb && cb();
			}
			marketDataOutcomesData = ParseMarketsData({ [marketData['_id']]: marketData });
			dispatch(updateMarketsData(marketDataOutcomesData));
			return cb && cb();
		});
	};
}