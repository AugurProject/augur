import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateAccountTradesData } from '../../../modules/my-positions/actions/update-account-trades-data';
import { clearAccountTrades } from '../../../modules/my-positions/actions/clear-account-trades';
import { sellCompleteSets } from '../../../modules/my-positions/actions/sell-complete-sets';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';

export function loadAccountTrades(marketID, skipSellCompleteSets) {
	return (dispatch, getState) => {
		const account = getState().loginAccount.id;
		async.parallel({
			trades: (callback) => augur.getAccountTrades(account, { market: marketID }, (trades) => {
				if (!trades || trades.error) return callback(trades);
				callback(null, trades);
			}),
			completeSets: (callback) => augur.getAccountCompleteSets(account, { type: 'sell', tradeLogStyle: true, market: marketID }, (completeSets) => {
				if (!completeSets || completeSets.error) return callback(completeSets);
				callback(null, completeSets);
			})
		}, (err, accountHistory) => {
			if (err) console.error('loadAccountTrades error:', err);
			const mergedHistory = accountHistory.trades || {};
			if (accountHistory.completeSets) {
				const completeSetsMarketIDs = Object.keys(accountHistory.completeSets);
				const numCompleteSetsMarketIDs = completeSetsMarketIDs.length;
				let id;
				let outcomes;
				let numOutcomes;
				let outcome;
				for (let i = 0; i < numCompleteSetsMarketIDs; ++i) {
					id = completeSetsMarketIDs[i];
					if (!mergedHistory[id]) mergedHistory[id] = {};
					outcomes = Object.keys(accountHistory.completeSets[id]);
					numOutcomes = outcomes.length;
					for (let j = 0; j < numOutcomes; ++j) {
						outcome = outcomes[j];
						if (!mergedHistory[id][outcome]) mergedHistory[id][outcome] = [];
						mergedHistory[id][outcome] = mergedHistory[id][outcome].concat(accountHistory.completeSets[id][outcome]);
					}
				}
			}
			console.log('merged history:', mergedHistory);
			if (!marketID) dispatch(clearAccountTrades());
			dispatch(updateAccountTradesData(mergedHistory));
			if (!marketID) {
				dispatch(loadMarketsInfo(Object.keys(accountHistory.trades)));
			} else {
				dispatch(loadMarketsInfo([marketID]));
			}
			if (!skipSellCompleteSets) dispatch(sellCompleteSets(marketID));
		});
	};
}
