import { augur } from '../../../services/augurjs';
import { formatRealEther } from '../../../utils/format-number';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function processTransferFunds(transactionID, fromAddress, amount, currency, toAddress) {
	return (dispatch, getState) => {
		dispatch(updateExistingTransaction(transactionID, {
			status: `submitting a request to transfer ${amount} ${currency} to ${toAddress}...`
		}));

		const { branch } = getState();
		const to = augur.abi.format_address(toAddress);
		const sent = (sent) => {
			dispatch(updateExistingTransaction(transactionID, {
				status: `transferring ${amount} ${currency} to ${toAddress}`
			}));
		};
		const success = (data) => {
			dispatch(updateExistingTransaction(transactionID, {
				status: SUCCESS,
				message: `Transfer of ${amount} ${currency} to ${toAddress} Complete.`,
				hash: data.hash,
				timestamp: data.timestamp,
				gasFees: formatRealEther(data.gasFees)
			}));
			dispatch(updateAssets());
		};
		const failed = (failedTransaction) => {
			dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: failedTransaction.message
			}));
		};

		switch (currency) {
		case 'ETH':
			return augur.sendCashFrom(to, amount, fromAddress, sent, success, failed);
		case 'real ETH':
			return augur.sendEther({
				to,
				value: amount,
				from: fromAddress,
				onSent: sent,
				onSuccess: success,
				onFailed: failed
			});
		case 'REP':
			return augur.sendReputation(branch.id, to, amount, sent, success, failed);
		default:
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: 'Unrecognized currency selected. Transaction failed.'
			}));
		}
	};
}
