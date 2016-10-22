import { formatShares, formatEther, formatRealEther, formatRealEtherEstimate } from '../../../utils/format-number';
import { SUBMITTED, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { SELL_COMPLETE_SETS } from '../../transactions/constants/types';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { updateSellCompleteSetsLock } from '../../my-positions/actions/update-account-trades-data';
import { augur, abi } from '../../../services/augurjs';

export function addSellCompleteSetsTransaction(marketID, numShares, callback) {
	return (dispatch, getState) => {
		const marketData = getState().marketsData[marketID];
		const fmtNumShares = formatShares(numShares);
		const fmtValue = formatEther(abi.bignum(numShares).times(abi.bignum(marketData.cumulativeScale)));
		const transaction = {
			type: SELL_COMPLETE_SETS,
			data: {
				marketID,
				marketDescription: marketData.description
			},
			numShares: fmtNumShares,
			value: fmtValue,
			gasFees: formatRealEtherEstimate(augur.getTxGasEth({ ...augur.tx.CompleteSets.sellCompleteSets }, augur.rpc.gasPrice))
		};
		console.info(SELL_COMPLETE_SETS, transaction.data);
		transaction.action = (transactionID) => {
			augur.sellCompleteSets({
				market: marketID,
				amount: numShares,
				onSent: (r) => {
					console.debug('sellCompleteSets sent:', r);
					dispatch(updateExistingTransaction(transactionID, {
						status: SUBMITTED,
						message: `closing out ${fmtValue.full} position`
					}));
				},
				onSuccess: (r) => {
					console.debug('sellCompleteSets success:', r);
					dispatch(updateExistingTransaction(transactionID, {
						status: SUCCESS,
						hash: r.hash,
						timestamp: r.timestamp,
						message: `closed out ${fmtValue.full} position`,
						gasFees: formatRealEther(r.gasFees)
					}));
					dispatch(updateAssets());
					dispatch(loadAccountTrades(marketID));
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
	};
}
