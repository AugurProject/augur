import { augur } from '../../../services/augurjs';
import { updateMarketsData, updateEventMarketsMap } from '../../markets/actions/update-markets-data';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { loadMarketCreatorFees } from '../../my-markets/actions/load-market-creator-fees';

const MARKETS_PER_BATCH = 10;

export function loadMarketsInfo(marketIDs, cb) {
	return (dispatch, getState) => {
		const numMarketsToLoad = marketIDs.length;
		(function loader(stepStart) {
			const stepEnd = stepStart + MARKETS_PER_BATCH;
			const marketsToLoad = marketIDs.slice(stepStart, Math.min(numMarketsToLoad, stepEnd));
			const { loginAccount } = getState();
			augur.batchGetMarketInfo(marketsToLoad, loginAccount.address, (marketsData) => {
				if (!marketsData || marketsData.error) {
					console.error('ERROR loadMarketsInfo()', marketsData);
				} else {
					const branchID = getState().branch.id;
					let marketInfoIDs = Object.keys(marketsData);
					const numMarkets = marketInfoIDs.length;
					for (let i = 0; i < numMarkets; ++i) {
						if (marketsData[marketInfoIDs[i]].branchId !== branchID) {
							delete marketsData[marketInfoIDs[i]];
						}
					}
					marketInfoIDs = Object.keys(marketsData);
					if (marketInfoIDs.length) {
						dispatch(updateMarketsData(marketsData));
						marketInfoIDs.forEach((marketID) => {
							dispatch(updateEventMarketsMap(marketsData[marketID].events[0].id, [marketID]));
							if (marketsData[marketID].author === loginAccount.address) {
								dispatch(loadFullMarket(marketID));
								dispatch(loadMarketCreatorFees(marketID));
							}
						});
					}
				}
				if (stepEnd < numMarketsToLoad) return loader(stepEnd);
				if (cb) cb();
			});
		}(0));
	};
}
