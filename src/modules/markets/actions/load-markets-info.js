import { augur } from '../../../services/augurjs';
import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarketsInfo(marketIDs, cb) {
	return (dispatch, getState) => {
		if (marketIDs && marketIDs.length) {
			augur.batchGetMarketInfo(marketIDs, (marketsData) => {
				if (marketsData && marketsData.error) {
					return console.error('ERROR loadMarketsInfo()', marketsData);
				}
				dispatch(updateMarketsData(marketsData));
				cb && cb();
			});
		}
	};
}
