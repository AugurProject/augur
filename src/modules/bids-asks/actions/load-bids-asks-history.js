import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAccountBidsAsksData, updateAccountCancelsData } from '../../../modules/my-positions/actions/update-account-trades-data';

export function loadBidsAsksHistory(marketID, cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => console.log('loadBidsAsksHistory:', e));
		const { loginAccount } = getState();
		const params = { market: marketID, sender: loginAccount.address };
		if (loginAccount.registerBlockNumber) {
			params.fromBlock = loginAccount.registerBlockNumber;
		}
		async.parallel([
			next => augur.getLogs('log_add_tx', params, { index: ['market', 'outcome'] }, (err, logs) => {
				if (err) return next(err);
				dispatch(updateAccountBidsAsksData(logs, marketID));
				next();
			}),
			next => augur.getLogs('log_cancel', params, { index: ['market', 'outcome'] }, (err, logs) => {
				if (err) return next(err);
				dispatch(updateAccountCancelsData(logs, marketID));
				next();
			})
		], callback);
	};
}
