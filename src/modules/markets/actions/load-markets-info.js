import { augur } from '../../../services/augurjs';
import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadMarketsInfo(marketIDs, cb) {
	return (dispatch, getState) => {
		if (marketIDs) {
			let marketArray;
			if (marketIDs.constructor === Array) {
				console.log('marketIDs:', marketIDs.length);
				if (marketIDs.length > 10) {
					marketArray = marketIDs.slice(0, 10);
				} else {
					marketArray = marketIDs;
				}
			} else {
				marketArray = [marketIDs];
			}
			augur.batchGetMarketInfo(marketArray, (marketsData) => {
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
