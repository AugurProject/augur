import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAccountPositionsData, updateAccountTradesData, updateNetEffectiveTradesData, updateCompleteSetsBought } from '../../../modules/my-positions/actions/update-account-trades-data';
import { clearAccountTrades } from '../../../modules/my-positions/actions/clear-account-trades';
import { sellCompleteSets } from '../../../modules/my-positions/actions/sell-complete-sets';
import { selectPositionsPlusAsks } from '../../user-open-orders/selectors/positions-plus-asks';

const loadAccountTradesLock = {};

export function loadAccountTrades(marketID, skipSellCompleteSets, cb) {
	return (dispatch, getState) => {
		const account = getState().loginAccount.id;
		const options = { market: marketID };
		if (account && !loadAccountTradesLock[marketID]) {
			loadAccountTradesLock[marketID] = true;
			if (!marketID) dispatch(clearAccountTrades());
			async.parallel({
				positions: (callback) => {
					augur.getAdjustedPositions(account, options, (err, positions) => {
						if (err) return callback(err);
						const positionsPlusAsks = selectPositionsPlusAsks(account, positions, getState().orderBooks);
						dispatch(updateAccountPositionsData(positionsPlusAsks, marketID));
						callback(null, positionsPlusAsks);
					});
				},
				trades: (callback) => augur.getAccountTrades(account, options, (trades) => {
					if (!trades || trades.error) return callback(trades);
					dispatch(updateAccountTradesData(trades, marketID));
					callback(null, trades);
				}),
				shortAskBuyCompleteSetsLogs: (callback) => augur.getShortAskBuyCompleteSetsLogs(account, options, callback),
				shortSellBuyCompleteSetsLogs: (callback) => augur.getTakerShortSellLogs(account, options, callback),
				completeSetsSold: (callback) => augur.getSellCompleteSetsLogs(account, options, callback),
				completeSetsBought: (callback) => augur.getBuyCompleteSetsLogs(account, options, (err, logs) => {
					if (err) return callback(err);
					const completeSetsBought = augur.parseCompleteSetsLogs(logs);
					dispatch(updateCompleteSetsBought(completeSetsBought, marketID));
					callback(null, completeSetsBought);
				})
			}, (err, data) => {
				if (err) {
					loadAccountTradesLock[marketID] = false;
					return console.error('loadAccountTrades error:', err);
				}
				console.log('loadAccountTrades data:', data, skipSellCompleteSets);
				if (data.shortAskBuyCompleteSetsLogs || data.shortSellBuyCompleteSetsLogs || data.completeSetsSold) {
					const netEffectiveTrades = augur.calculateNetEffectiveTrades({
						shortAskBuyCompleteSets: data.shortAskBuyCompleteSetsLogs,
						shortSellBuyCompleteSets: data.shortSellBuyCompleteSetsLogs,
						sellCompleteSets: data.completeSetsSold
					});
					dispatch(updateNetEffectiveTradesData(netEffectiveTrades, marketID));
				}
				loadAccountTradesLock[marketID] = false;
				if (!skipSellCompleteSets) {
					return dispatch(sellCompleteSets(marketID, cb));
				}
				if (cb) cb();
			});
		} else {
			if (cb) cb();
		}
	};
}
