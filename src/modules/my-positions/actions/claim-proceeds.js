import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import selectWinningPositions from '../../my-positions/selectors/winning-positions';

export function claimProceeds() {
	return (dispatch, getState) => {
		const { branch, loginAccount } = getState();
		if (loginAccount.address) {
			const winningPositions = selectWinningPositions();
			console.debug('closed markets with winning shares:', winningPositions);
			if (winningPositions.length) {
				augur.claimMarketsProceeds(branch.id, winningPositions, (err, claimedMarkets) => {
					if (err) return console.error('claimMarketsProceeds failed:', err);
					dispatch(updateAssets());
					console.debug('claimed proceeds from markets:', claimedMarkets);
					async.each(claimedMarkets, (marketID, nextMarket) => {
						console.log('loadAccountTrades for', marketID);
						dispatch(loadAccountTrades(marketID, () => nextMarket()));
					});
				});
			}
		}
	};
}
