import async from 'async';
import { augur, constants } from '../../../services/augurjs';
import { convertLogsToTransactions } from '../../../modules/transactions/actions/convert-logs-to-transactions';

export function loadFundingHistory(cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => console.log('loadFundingHistory:', e));
		const { branch, loginAccount } = getState();
		const params = { sender: loginAccount.address, branch: branch.id };
		if (loginAccount.registerBlockNumber) {
			params.fromBlock = loginAccount.registerBlockNumber;
		}
		async.eachLimit([
			'fundedAccount',
			'registration',
			'deposit',
			'withdraw',
			'Approval',
			'Transfer',
			'sentCash'
		], constants.PARALLEL_LIMIT, (label, nextLabel) => {
			const p = label === 'fundedAccount' ? { ...params, fromBlock: null } : params;
			augur.getLogs(label, p, null, (err, logs) => {
				console.log(label, p, err, logs);
				if (err) return nextLabel(err);
				if (logs && logs.length) dispatch(convertLogsToTransactions(label, logs));
				nextLabel();
			});
		}, callback);
	};
}
