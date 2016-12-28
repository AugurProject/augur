import { formatEther, formatShares } from '../../../utils/format-number';
import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';
import selectWinningPositions from '../../my-positions/selectors/winning-positions';

export function claimProceeds() {
	return (dispatch, getState) => {
		const { branch, loginAccount } = getState();
		if (loginAccount.address) {
			const winningPositions = selectWinningPositions();
			console.log('closed markets with winning shares:', winningPositions);
			if (winningPositions.length) {
				augur.claimMarketsProceeds(branch.id, winningPositions, (err, claimedMarkets) => {
					if (err) return console.error('claimMarketsProceeds failed:', err);
					dispatch(updateAssets());
					console.log('claimed proceeds from markets:', claimedMarkets);
				}, (transactionID, marketID) => {
					const closedMarket = winningPositions.find(market => market.id === marketID);
					dispatch(updateExistingTransaction(transactionID, {
						message: `closing out ${formatShares(closedMarket.shares).full} for ${formatEther(closedMarket.shares).full}`
					}));
				}, (transactionID, marketID, payout) => {
					dispatch(deleteTransaction(transactionID));
					dispatch(updateAssets());
					dispatch(loadMarketsInfo([marketID], () => {
						dispatch(loadAccountTrades(marketID, () => dispatch(loadBidsAsks(marketID))));
					}));
				});
			}
		}
	};
}
