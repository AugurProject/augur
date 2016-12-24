import async from 'async';
import { augur } from '../../../services/augurjs';
import { convertLogsToTransactions } from '../../../modules/transactions/actions/convert-logs-to-transactions';

export function loadDepositWithdrawHistory(cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => console.log('loadDepositWithdrawHistory:', e));
		const { branch, loginAccount } = getState();
		const params = { sender: loginAccount.address, branch: branch.id };
		if (loginAccount.registerBlockNumber) {
			params.fromBlock = loginAccount.registerBlockNumber;
		}
		async.each(['registration', 'deposit', 'withdraw'], (label, nextLabel) => {
			augur.getLogs(label, params, null, (err, logs) => {
				if (err) return nextLabel(err);
				if (logs && logs.length) dispatch(convertLogsToTransactions(label, logs));
				nextLabel();
			});
		}, callback);
	};
}
