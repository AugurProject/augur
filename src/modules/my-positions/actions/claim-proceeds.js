import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';
import selectWinningPositions from '../../my-positions/selectors/winning-positions';

export function claimProceeds() {
	return (dispatch, getState) => {
		const { branch, loginAccount, outcomesData } = getState();
		if (loginAccount.address) {
			const winningPositions = selectWinningPositions(outcomesData);
			console.log('closed markets with winning shares:', winningPositions);
			if (winningPositions.length) {
				augur.claimMarketsProceeds(branch.id, winningPositions, (err, claimedMarkets) => {
					if (err) return console.error('claimMarketsProceeds failed:', err);
					dispatch(updateAssets());
					async.each(claimedMarkets, (market, nextMarket) => dispatch(loadAccountTrades(market.id, () => nextMarket())));
				});
			}
		}
	};
}
