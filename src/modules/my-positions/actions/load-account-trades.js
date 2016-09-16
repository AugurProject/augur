import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAccountTradesData, updateAccountPositionsData, updateCompleteSetsBought } from '../../../modules/my-positions/actions/update-account-trades-data';
import { clearAccountTrades } from '../../../modules/my-positions/actions/clear-account-trades';
import { sellCompleteSets } from '../../../modules/my-positions/actions/sell-complete-sets';

export function loadAccountTrades(marketID, skipSellCompleteSets, cb) {
	return (dispatch, getState) => {
		const account = getState().loginAccount.id;
		const options = { market: marketID };
		async.parallel({
			positions: (callback) => augur.getAdjustedPositions(account, options, callback),
			trades: (callback) => augur.getAccountTrades(account, options, (trades) => {
				if (!trades || trades.error) return callback(trades);
				callback(null, trades);
			}),
			completeSetsBought: (callback) => augur.getBuyCompleteSetsLogs(account, options, (err, logs) => {
				if (err) return callback(err);
				callback(null, augur.parseCompleteSetsLogs(logs));
			})
		}, (err, data) => {
			if (err) return console.error('loadAccountTrades error:', err);
			console.log('loadAccountTrades data:', data, skipSellCompleteSets);
			if (!marketID) dispatch(clearAccountTrades());
			if (data.positions) {
				dispatch(updateAccountPositionsData(data.positions));
			}
			if (data.trades) {
				dispatch(updateAccountTradesData(data.trades));
			}
			if (data.completeSetsBought) {
				dispatch(updateCompleteSetsBought(data.completeSetsBought));
			}
			if (!skipSellCompleteSets) dispatch(sellCompleteSets(marketID));
			if (cb) cb();
		});
	};
}
