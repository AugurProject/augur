import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { refreshMarket } from '../../app/actions/listen-to-updates';

export function claimProceeds() {
	return (dispatch, getState) => {
		const { portfolio } = require('../../../selectors');
		const marketsWithPositions = portfolio.positions.markets;
		const numPositions = portfolio.positions.markets.length;
		const closedMarketsWithShares = [];
		for (let i = 0; i < numPositions; ++i) {
			if (!marketsWithPositions[i].isOpen) {
				closedMarketsWithShares.push(marketsWithPositions[i].id);
			}
		}
		if (closedMarketsWithShares.length) {
			console.log('closed markets with shares:', closedMarketsWithShares);
			augur.claimMarketsProceeds(getState().branch.id, closedMarketsWithShares, (err, claimedMarkets) => {
				if (err) return console.error('claimMarketsProceeds failed:', err);
				dispatch(updateAssets());
				if (claimedMarkets && claimedMarkets.length) {
					console.log('claimed proceeds from markets:', claimedMarkets);
					const numClaimedMarkets = claimedMarkets.length;
					for (let j = 0; j < numClaimedMarkets; ++j) {
						dispatch(refreshMarket(claimedMarkets[j]));
					}
				}
			});
		}
	};
}
