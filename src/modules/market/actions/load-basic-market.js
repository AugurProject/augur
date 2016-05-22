import * as AugurJS from '../../../services/augurjs';

import { parseMarketsData } from '../../../utils/parse-market-data';

import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadBasicMarket(marketID, cb) {
	return (dispatch, getState) => {
		AugurJS.loadMarket(marketID, (err, marketData) => {
			if (err) {
				console.info('ERROR: loadMarket()', err);
				return cb && cb();
			}
			const marketDataOutcomesData = parseMarketsData(
							{ [marketData._id]: marketData }
				);
			dispatch(updateMarketsData(marketDataOutcomesData));
			return cb && cb();
		});
	};
}
