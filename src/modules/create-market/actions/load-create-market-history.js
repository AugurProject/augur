import async from 'async';
import { augur } from '../../../services/augurjs';
import { convertLogsToTransactions } from '../../../modules/transactions/actions/convert-logs-to-transactions';

export function loadCreateMarketHistory(marketID, cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => console.log('loadReportingLogs:', e));
		const { branch, loginAccount } = getState();
		const params = { sender: loginAccount.address, branch: branch.id };
		if (loginAccount.registerBlockNumber) {
			params.fromBlock = loginAccount.registerBlockNumber;
		}
		async.each([
			'marketCreated',
			'tradingFeeUpdated'
		], (label, nextLabel) => {
			augur.getLogs(label, params, null, (err, logs) => {
				if (err) return nextLabel(err);
				if (logs && logs.length) dispatch(convertLogsToTransactions(label, logs));
				nextLabel();
			});
		}, callback);
	};
}
