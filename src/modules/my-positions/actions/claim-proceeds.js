import { formatEther, formatShares } from '../../../utils/format-number';
import { abi, augur } from '../../../services/augurjs';
import { SUCCESS } from '../../transactions/constants/statuses';
import { ZERO } from '../../trade/constants/numbers';
import { updateAssets } from '../../auth/actions/update-assets';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';

export function claimProceeds() {
	return (dispatch, getState) => {
		const { loginAccount, outcomesData } = getState();
		if (loginAccount.address) {
			const { portfolio } = require('../../../selectors');
			const marketsWithPositions = portfolio.positions.markets;
			const numPositions = portfolio.positions.markets.length;
			let marketID;
			let outcomeIDs;
			let numOutcomes;
			let outcomeData;
			let shares;
			const closedMarketsWithShares = [];
			for (let i = 0; i < numPositions; ++i) {
				if (!marketsWithPositions[i].isOpen) {
					marketID = marketsWithPositions[i].id;
					outcomeIDs = Object.keys(outcomesData[marketID]);
					numOutcomes = outcomeIDs.length;
					for (let j = 0; j < numOutcomes; ++j) {
						outcomeData = outcomesData[marketID][outcomeIDs[j]];
						if (abi.bignum(outcomeData.sharesPurchased).gt(ZERO)) {
							if (marketsWithPositions[i].type !== 'scalar' && outcomeIDs[j].toString() === marketsWithPositions[i].reportedOutcome && outcomeData.sharesPurchased && outcomeData.sharesPurchased !== '0') {
								shares = outcomeData.sharesPurchased;
							}
							if (marketsWithPositions[i].type === 'scalar' || shares) {
								closedMarketsWithShares.push({
									id: marketID,
									description: marketsWithPositions[i].description,
									shares
								});
							}
						}
					}
				}
			}
			console.log('closed markets with shares:', closedMarketsWithShares);
			if (closedMarketsWithShares.length) {
				augur.claimMarketsProceeds(getState().branch.id, closedMarketsWithShares, (err, claimedMarkets) => {
					if (err) return console.error('claimMarketsProceeds failed:', err);
					dispatch(updateAssets());
					console.log('claimed proceeds from markets:', claimedMarkets);
				}, (transactionID, marketID) => {
					const closedMarket = closedMarketsWithShares.find(market => market.id === marketID);
					dispatch(updateExistingTransaction(transactionID, {
						message: `closing out ${formatShares(closedMarket.shares).full} for ${formatEther(closedMarket.shares).full}`
					}));
				}, (transactionID, marketID, payout) => {
					dispatch(updateExistingTransaction(transactionID, {
						status: 'updating position',
						message: `closed out ${formatShares(payout.shares).full} for ${formatEther(payout.cash).full}`
					}));
					dispatch(updateAssets());
					dispatch(loadMarketsInfo([marketID], () => {
						dispatch(loadAccountTrades(marketID, () => {
							dispatch(loadBidsAsks(marketID, () => {
								dispatch(updateExistingTransaction(transactionID, {
									status: SUCCESS
								}));
							}));
						}));
					}));
				});
			}
		}
	};
}
