import { formatShares, formatEther, formatRealEther } from '../../../utils/format-number';
import { SUBMITTED, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { SELL_COMPLETE_SETS } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { updateSellCompleteSetsLock } from '../../my-positions/actions/update-account-trades-data';
import { augur, abi } from '../../../services/augurjs';

export const addSellCompleteSetsTransaction = (marketID, numShares, callback) => (
	(dispatch, getState) => {
		const marketData = getState().marketsData[marketID];
		const fmtNumShares = formatShares(numShares);
		const fmtValue = formatEther(abi.bignum(numShares).times(abi.bignum(marketData.cumulativeScale)));
		const fmtGasFees = formatRealEther(augur.getTxGasEth({ ...augur.tx.CompleteSets.sellCompleteSets }, augur.rpc.gasPrice));
		const transaction = {
			type: SELL_COMPLETE_SETS,
			data: {
				marketID,
				marketDescription: marketData.description,
				numShares: fmtNumShares,
				value: fmtValue,
				gasFees: fmtGasFees
			}
		};
		console.log('sell complete sets transaction:', transaction.data);
		transaction.action = (transactionID) => {
			augur.sellCompleteSets({
				market: marketID,
				amount: numShares,
				onSent: (r) => {
					console.debug('sellCompleteSets sent:', r);
					dispatch(updateExistingTransaction(transactionID, {
						status: SUBMITTED,
						message: `selling ${fmtNumShares.full} of each outcome for ${fmtValue.full}<br />
							<small>(paying ${fmtGasFees.full} in estimated gas fees)</small>`
					}));
				},
				onSuccess: (r) => {
					console.debug('sellCompleteSets success:', r);
					dispatch(updateExistingTransaction(transactionID, {
						status: SUCCESS,
						hash: r.hash,
						timestamp: r.timestamp,
						message: `sold ${fmtNumShares.full} of each outcome for ${fmtValue.full}<br />
							<small>(paid ${formatRealEther(r.gasFees).full} in gas fees)</small>`
					}));
					dispatch(updateAssets());
					dispatch(loadAccountTrades(marketID, true));
					dispatch(updateSellCompleteSetsLock(marketID, false));
					if (callback) callback(null);
				},
				onFailed: (e) => {
					console.error('sellCompleteSets failed:', e);
					dispatch(updateExistingTransaction(transactionID, {
						status: FAILED,
						message: `transaction failed: ${e.message}`
					}));
					dispatch(updateSellCompleteSetsLock(marketID, false));
					if (callback) callback(e);
				}
			});
		};
		dispatch(addTransaction(transaction));
	}
);
