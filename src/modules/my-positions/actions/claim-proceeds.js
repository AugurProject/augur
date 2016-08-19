import { augur } from '../../../services/augurjs';

export function claimProceeds() {
	return (dispatch, getState) => {
		const { portfolio } = require('../../../selectors');
		const marketsWithShares = portfolio.positions.markets.map(market => market.id);
		augur.claimMarketsProceeds(getState().branch.id, marketsWithShares, (err, claimedMarkets) => {
			if (err) return console.error('claimMarketsProceeds failed:', err);
			if (claimedMarkets && claimedMarkets.length) {
				console.log('claimed proceeds from markets:', claimedMarkets);
			}
		});
	};
}
