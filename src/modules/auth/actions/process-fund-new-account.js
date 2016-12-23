import { formatRealEther } from '../../../utils/format-number';
import { augur, fundNewAccount } from '../../../services/augurjs';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';

export function processFundNewAccount(transactionID, address) {
	return (dispatch, getState) => {
		const { env, branch } = getState();

		dispatch(updateExistingTransaction(transactionID, { status: 'submitting...' }));

		fundNewAccount(env, address, branch.id,
			() => {
				dispatch(updateExistingTransaction(transactionID, {
					status: 'processing...'
				}));
			},
			(data) => {
				dispatch(updateExistingTransaction(transactionID, {
					message: 'Received free Ether and Reputation!',
					hash: data.hash,
					timestamp: data.timestamp,
					gasFees: formatRealEther(data.gasFees)
				}));
				dispatch(updateAssets());
				augur.Register.register({
					onSent: (r) => {
						dispatch(updateExistingTransaction(transactionID, {
							message: `Received free Ether and Reputation.<br />
								Saving registration timestamp...`
						}));
						console.log('augur.Register.register sent:', r);
					},
					onSuccess: (r) => {
						dispatch(deleteTransaction(transactionID));
						const { loginAccount } = getState();
						loginAccount.registerBlockNumber = r.blockNumber;
						dispatch(updateLoginAccount(loginAccount));
						console.log('augur.Register.register success:', r);
					},
					onFailed: e => console.error('augur.Register.register failed:', e)
				});
			},
			(failedTransaction) => {
				dispatch(updateExistingTransaction(transactionID, {
					status: FAILED,
					message: failedTransaction.message
				}));
			}
		);
	};
}
