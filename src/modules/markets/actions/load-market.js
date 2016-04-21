import * as AugurJS from '../../../services/augurjs';

import { ParseMarketsData } from '../../../utils/parse-market-data';

import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarket(marketID) {
	return function(dispatch, getState) {
		AugurJS.loadMarket(marketID, (err, marketData) => {
			var marketDataOutcomesData;
			if (err) {
				return console.info("ERROR: loadMarket()", err);
			}
			marketDataOutcomesData = ParseMarketsData({ [marketData['_id']]: marketData });
			dispatch(updateMarketsData(marketDataOutcomesData));
		});
	};
}