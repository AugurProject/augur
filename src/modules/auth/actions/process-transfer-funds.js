import { augur } from '../../../services/augurjs';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function processTransferFunds(transactionID, fromAddress, amount, currency, toAddress) {
	return (dispatch, getState) => {
		dispatch(updateExistingTransaction(transactionID, { status: `submitting a request to transfer ${amount} ${currency} to ${toAddress}...` }));

		const { branch } = getState();
		const to = augur.abi.format_address(toAddress);
		const sent = (sent) => {
			console.log('sent');
			console.log(sent);
			dispatch(updateExistingTransaction(transactionID, { status: `processing transferring of ${amount} ${currency} to ${toAddress}` }));
		};
		const success = (data) => {
			console.log('success');
			console.log(data);
			dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: `Transfer of ${amount} ${currency} to ${toAddress} Complete.`, hash: data.hash }));
			dispatch(updateAssets());
		};
		const failed = (failedTransaction) => {
			console.log('failed');
			console.log(failedTransaction);
			dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: failedTransaction.message }));
		};
		const confirmed = (confirmedTransaction) => {
			console.log('transaction Confirmed!');
			console.log(confirmedTransaction);
		};
		console.log(branch);
		console.log('from:', fromAddress);
		console.log(amount, currency);
		console.log('to', to);

		switch (currency) {
		case 'eth':
			return augur.sendCashFrom(to, amount, fromAddress, sent, success, failed, confirmed);
		case 'realEth':
			return augur.rpc.sendEther({
				to,
				value: amount,
				from: fromAddress,
				onSent: sent,
				onSuccess: success,
				onFailed: failed
			});
			// return augur.rpc.sendEther(to, amount, fromAddress, sent, success, failed, confirmed);
		case 'REP':
			return augur.transferReputationFrom(branch.id, fromAddress, to, amount, sent, success, failed, confirmed);
			// return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: 'testing...' }));
		default:
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: 'Unrecognized currency selected. Transaction failed.' }));
		}
	};
}
