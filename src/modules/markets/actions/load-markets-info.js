import { augur } from '../../../services/augurjs';
import { updateMarketsData, updateEventMarketsMap } from '../../markets/actions/update-markets-data';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { loadMarketCreatorFees } from '../../my-markets/actions/load-market-creator-fees';

const MARKETS_PER_BATCH = 10;

export function loadCreatedMarketInfo(marketID) {
	return (dispatch, getState) => {
		const { loginAccount, marketsData } = getState();
		if (marketsData[marketID].author === loginAccount.address) {
			dispatch(loadFullMarket(marketID));
			dispatch(loadMarketCreatorFees(marketID));
		}
	};
}

export function filterMarketsInfoByBranch(marketsData, branchID) {
	const marketInfoIDs = Object.keys(marketsData);
	const numMarkets = marketInfoIDs.length;
	for (let i = 0; i < numMarkets; ++i) {
		if (marketsData[marketInfoIDs[i]].branchId !== branchID) {
			delete marketsData[marketInfoIDs[i]];
		}
	}
	return marketsData;
}

export function loadMarketsInfo(marketIDs, cb) {
	return (dispatch, getState) => {
		const numMarketsToLoad = marketIDs.length;
		(function loader(stepStart) {
			const stepEnd = stepStart + MARKETS_PER_BATCH;
			const marketsToLoad = marketIDs.slice(stepStart, Math.min(numMarketsToLoad, stepEnd));
			augur.batchGetMarketInfo(marketsToLoad, getState().loginAccount.address, (marketsData) => {
				if (!marketsData || marketsData.error) {
					console.error('ERROR loadMarketsInfo()', marketsData);
				} else {
					const branchMarketsData = filterMarketsInfoByBranch(marketsData, getState().branch.id);
					const marketInfoIDs = Object.keys(branchMarketsData);
					if (marketInfoIDs.length) {
						dispatch(updateMarketsData(branchMarketsData));
						marketInfoIDs.forEach((marketID) => {
							dispatch(updateEventMarketsMap(branchMarketsData[marketID].events[0].id, [marketID]));
							dispatch(loadCreatedMarketInfo(marketID));
						});
					}
				}
				if (stepEnd < numMarketsToLoad) return loader(stepEnd);
				if (cb) cb();
			});
		}(0));
	};
}
