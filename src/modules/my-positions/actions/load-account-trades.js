import async from 'async';
import { augur, abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
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
			completeSets: (callback) => augur.getAccountCompleteSets(account, { tradeLogStyle: true, market: marketID }, (completeSets) => {
				if (!completeSets || completeSets.error) return callback(completeSets);
				callback(null, completeSets);
			})
		}, (err, accountHistory) => {
			if (err) console.error('loadAccountTrades error:', err);
			const mergedHistory = accountHistory.trades || {};
			const completeSetsHistory = accountHistory.completeSets || {};
			const tradeMarketIDs = Object.keys(mergedHistory);
			const numTradeMarketIDs = tradeMarketIDs.length;
			let completeSetsMarketIDs = Object.keys(completeSetsHistory);
			let numCompleteSetsMarketIDs = completeSetsMarketIDs.length;
			const marketIDs = (marketID)
				? [marketID]
				: tradeMarketIDs.concat(completeSetsMarketIDs).filter((value, index, self) => self.indexOf(value) === index);
			if (marketIDs.length) {
				dispatch(loadMarketsInfo(marketIDs, () => {
					// TODO move this madness to augur.js
					let i;
					let j;
					let id;
					let outcomes;
					let numOutcomes;
					let outcome;
					let completeSetsEntries;
					let numCompleteSetsEntries;
					let outcomesWithTrades;
					let numOutcomesWithTrades;
					let sharesBought;
					let sharesSold;
					let outcomeTrades;
					let numOutcomeTrades;
					let k;
					let l;
					let m;
					if (numTradeMarketIDs) {
						const { marketsData } = getState();
						const shortSellMarketIDs = [];
						accountHistory.completeSets = accountHistory.completeSets || {};
						for (i = 0; i < numTradeMarketIDs; ++i) {
							id = tradeMarketIDs[i];
							if (!marketsData[id]) continue;
							numOutcomes = marketsData[id].numOutcomes;
							outcomesWithTrades = Object.keys(mergedHistory[id]);
							numOutcomesWithTrades = outcomesWithTrades.length;
							for (j = 0; j < numOutcomesWithTrades; ++j) {
								outcome = parseInt(outcomesWithTrades[j], 10);
								outcomeTrades = mergedHistory[id][outcome];
								numOutcomeTrades = outcomeTrades.length;
								for (l = 0; l < numOutcomeTrades; ++l) {
									if (outcomeTrades[l].type === 3 && !outcomeTrades[l].maker) {
										// console.log('found short sell log:', outcomeTrades[l]);
										if (!shortSellMarketIDs.length || shortSellMarketIDs[shortSellMarketIDs.length - 1] !== id) {
											shortSellMarketIDs.push(id);
										}
										if (!accountHistory.completeSets[id]) accountHistory.completeSets[id] = {};
										for (k = 1; k <= numOutcomes; ++k) {
											sharesBought = abi.bignum(outcomeTrades[l].shares);
											if (accountHistory.completeSets[id][k]) {
												completeSetsEntries = accountHistory.completeSets[id][k];
												numCompleteSetsEntries = completeSetsEntries.length;
												for (m = 0; m < numCompleteSetsEntries; ++m) {
													if (completeSetsEntries[m].type === 2) {
														sharesSold = abi.bignum(completeSetsEntries[m].shares);
														if (sharesSold.gt(ZERO)) {
															if (sharesBought.gt(sharesSold)) {
																sharesBought = sharesBought.minus(sharesSold);
																sharesSold = ZERO;
															} else {
																sharesSold = sharesSold.minus(sharesBought);
																sharesBought = ZERO;
															}
															completeSetsEntries[m].shares = sharesSold.toFixed();
															if (sharesBought.lte(ZERO)) break;
														}
													}
												}
												// console.log('complete sets entry:', k, accountHistory.completeSets[id]);
											}
										}
									}
								}
							}
						}
					}
					completeSetsMarketIDs = Object.keys(accountHistory.completeSets || {});
					numCompleteSetsMarketIDs = completeSetsMarketIDs.length;
					if (numCompleteSetsMarketIDs) {
						for (i = 0; i < numCompleteSetsMarketIDs; ++i) {
							id = completeSetsMarketIDs[i];
							if (!mergedHistory[id]) mergedHistory[id] = {};
							outcomes = Object.keys(accountHistory.completeSets[id]);
							numOutcomes = outcomes.length;
							for (j = 0; j < numOutcomes; ++j) {
								outcome = outcomes[j];
								completeSetsEntries = accountHistory.completeSets[id][outcome];
								numCompleteSetsEntries = completeSetsEntries.length;
								sharesBought = ZERO;
								for (m = 0; m < numCompleteSetsEntries; ++m) {
									if (completeSetsEntries[m].type === 1) {
										sharesBought = sharesBought.plus(abi.bignum(completeSetsEntries[m].shares));
										completeSetsEntries.splice(m, 1);
										--m;
										--numCompleteSetsEntries;
									}
								}
								for (m = 0; m < numCompleteSetsEntries; ++m) {
									if (completeSetsEntries[m].type === 2) {
										sharesSold = abi.bignum(completeSetsEntries[m].shares);
										if (sharesSold.gt(ZERO)) {
											if (sharesBought.gt(sharesSold)) {
												sharesBought = sharesBought.minus(sharesSold);
												sharesSold = ZERO;
											} else {
												sharesSold = sharesSold.minus(sharesBought);
												sharesBought = ZERO;
											}
											completeSetsEntries[m].shares = sharesSold.toFixed();
											if (sharesBought.lte(ZERO)) break;
										}
									}
								}
								// console.log('final complete sets entry:', accountHistory.completeSets[id]);
								if (!mergedHistory[id][outcome]) mergedHistory[id][outcome] = [];
								mergedHistory[id][outcome] = mergedHistory[id][outcome].concat(accountHistory.completeSets[id][outcome]);
							}
						}
					}
					console.log('merged history:', mergedHistory);
					if (!marketID) dispatch(clearAccountTrades());
					dispatch(updateAccountTradesData(mergedHistory));
					if (!skipSellCompleteSets) dispatch(sellCompleteSets(marketID));
				}));
			}
		});
	};
}
