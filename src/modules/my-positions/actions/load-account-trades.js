import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAccountPositionsData, updateAccountTradesData, updateCompleteSetsBought } from '../../../modules/my-positions/actions/update-account-trades-data';
import { convertLogsToTransactions } from '../../../modules/transactions/actions/convert-logs-to-transactions';
import { clearAccountTrades } from '../../../modules/my-positions/actions/clear-account-trades';
import { sellCompleteSets } from '../../../modules/my-positions/actions/sell-complete-sets';
import { selectPositionsPlusAsks } from '../../user-open-orders/selectors/positions-plus-asks';

export function loadAccountTrades(marketID, cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => console.log('loadAccountTrades:', e));
		const { loginAccount } = getState();
		const account = loginAccount.address;
		if (!account) return callback();
		const options = { market: marketID };
		if (loginAccount.registerBlockNumber) {
			options.fromBlock = loginAccount.registerBlockNumber;
		}
		if (!marketID) dispatch(clearAccountTrades());
		async.parallel([
			(next) => {
				augur.getAdjustedPositions(account, options, (err, positions) => {
					if (err) return next(err);
					dispatch(updateAccountPositionsData(selectPositionsPlusAsks(account, positions, getState().orderBooks), marketID));
					next(null);
				});
			},
			next => augur.getAccountTrades(account, options, (err, trades) => {
				if (err) return next(err);
				dispatch(updateAccountTradesData(trades, marketID));
				next(null);
			}),
			next => augur.getLogs('payout', { fromBlock: options.fromBlock, sender: account }, (err, payouts) => {
				if (err) return next(err);
				if (payouts && payouts.length) dispatch(convertLogsToTransactions('payout', payouts));
				next(null);
			}),
			next => augur.getBuyCompleteSetsLogs(account, options, (err, completeSets) => {
				if (err) return next(err);
				dispatch(updateCompleteSetsBought(augur.parseCompleteSetsLogs(completeSets), marketID));
				next(null);
			})
		], (err) => {
			if (err) return callback(err);
			dispatch(sellCompleteSets(marketID, cb));
		});
	};
}
