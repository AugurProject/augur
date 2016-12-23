import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAccountBidsAsksData, updateAccountCancelsData } from '../../../modules/my-positions/actions/update-account-trades-data';

export function loadBidsAsksHistory(marketID, cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => console.log('loadBidsAsksHistory:', e));
		const { loginAccount } = getState();
		const options = { market: marketID };
		if (loginAccount.registerBlockNumber) {
			options.fromBlock = loginAccount.registerBlockNumber;
		}
		async.parallel([
			next => augur.getAccountBidsAsks(loginAccount.address, options, (err, bidsAsks) => {
				if (err) return next(err);
				dispatch(updateAccountBidsAsksData(bidsAsks, marketID));
				next();
			}),
			next => augur.getAccountCancels(loginAccount.address, options, (err, cancels) => {
				if (err) return next(err);
				dispatch(updateAccountCancelsData(cancels, marketID));
				next();
			})
		], callback);
	};
}
