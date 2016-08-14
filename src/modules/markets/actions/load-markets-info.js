import { augur } from '../../../services/augurjs';
import { updateMarketsData } from '../../markets/actions/update-markets-data';

const MARKETS_PER_BATCH = 10;

export function loadMarketsInfo(marketIDs, cb) {
	return (dispatch, getState) => {
		const numMarketsToLoad = marketIDs.length;
		(function loader(stepStart) {
			const stepEnd = stepStart + MARKETS_PER_BATCH;
			const marketsToLoad = marketIDs.slice(stepStart, Math.min(numMarketsToLoad, stepEnd));
			augur.batchGetMarketInfo(marketsToLoad, (marketsData) => {
				if (!marketsData || marketsData.error) {
					console.error('ERROR loadMarketsInfo()', marketsData);
				} else {
					const branchID = getState().branch.id;
					let marketID;
					for (marketID in marketsData) {
						if (!marketsData.hasOwnProperty(marketID)) continue;
						if (marketsData[marketID].branchId !== branchID) {
							delete marketsData[marketID];
						}
					}
					if (Object.keys(marketsData).length) {
						dispatch(updateMarketsData(marketsData));
					}
				}
				if (stepEnd < numMarketsToLoad) return loader(stepEnd);
				cb && cb();
			});
		}(0));
	};
}
