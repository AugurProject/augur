import { augur } from '../../../services/augurjs';
import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarketsInfo(marketIDs, cb) {
	return (dispatch, getState) => {
		if (marketIDs) {
			augur.batchGetMarketInfo((marketIDs.constructor !== Array) ? [marketIDs] : marketIDs, (marketsData) => {
				if (marketsData && marketsData.error) {
					return console.error('ERROR loadMarketsInfo()', marketsData);
				}
				const branchID = getState().branch.id;
				let marketID;
				for (marketID in marketsData) {
					if (!marketsData.hasOwnProperty(marketID)) continue;
					if (marketsData[marketID].branchId !== branchID) {
						delete marketsData[marketID];
					}
				}
				dispatch(updateMarketsData(marketsData));
				cb && cb();
			});
		}
	};
}
