import { augur } from '../../../services/augurjs';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function processTransferFunds(transactionID, fromAddress, amount, currency, toAddress) {
	return (dispatch, getState) => {
		dispatch(updateExistingTransaction(transactionID, { status: `submitting a request to transfer ${amount} ${currency} to ${toAddress}...` }));

		const sent = () => {
			dispatch(updateExistingTransaction(transactionID, { status: `processing transferring of ${amount} ${currency} to ${toAddress}` }));
		};
		const success = (data) => {
			dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: `Transfer of ${amount} ${currency} to ${toAddress} Complete.`, hash: data.hash }));
			dispatch(updateAssets());
		};
		const failed = (failedTransaction) => {
			dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: failedTransaction.message }));
		};
		const confirmed = (confirmedTransaction) => {
			console.log('transaction Confirmed!');
			console.log(confirmedTransaction);
		}

		const { branch } = getState();

		switch (currency) {
		case 'eth':
			return augur.sendCashFrom(toAddress, amount, fromAddress, sent, success, failed, confirmed);
		case 'realEth':
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: 'This failed because sending realEther has not been implemented.' }));
		case 'REP':
			return augur.SendReputation.sendReputation(branch.id, toAddress, amount, sent, success, failed, confirmed);
			// return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: 'This failed because sending REP has not been implemented.' }));
		default:
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: 'Unrecognized currency selected. Transaction failed.' }));
		}
	};
}
