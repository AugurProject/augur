import { augur } from '../../../services/augurjs';
import { updateMarketsData } from '../../markets/actions/update-markets-data';
import { loadFullLoginAccountMarkets } from '../../portfolio/actions/load-full-login-account-markets';

const MARKETS_PER_BATCH = 10;

export function loadMarketsInfo(marketIDs, cb) {
	return (dispatch, getState) => {
		const numMarketsToLoad = marketIDs.length;
		(function loader(stepStart) {
			const stepEnd = stepStart + MARKETS_PER_BATCH;
			const marketsToLoad = marketIDs.slice(stepStart, Math.min(numMarketsToLoad, stepEnd));
			augur.batchGetMarketInfo(marketsToLoad, getState().loginAccount.id, (marketsData) => {
				if (!marketsData || marketsData.error) {
					console.error('ERROR loadMarketsInfo()', marketsData);
				} else {
					const branchID = getState().branch.id;
					const marketInfoIDs = Object.keys(marketsData);
					const numMarkets = marketInfoIDs.length;
					for (let i = 0; i < numMarkets; ++i) {
						if (marketsData[marketInfoIDs[i]].branchId !== branchID) {
							delete marketsData[marketInfoIDs[i]];
						}
					}
					if (Object.keys(marketsData).length) {
						dispatch(updateMarketsData(marketsData));

						const { loginAccount } = require('../../../selectors');
						Object.keys(marketsData).forEach(marketId => {
							if (marketsData[marketId].author === loginAccount.id) dispatch(loadFullLoginAccountMarkets());
						});
					}
				}
				if (stepEnd < numMarketsToLoad) return loader(stepEnd);
				if (cb) cb();
			});
		}(0));
	};
}
