import async from 'async';
import { abi, augur, constants } from '../../../services/augurjs';
import { SUCCESS } from '../../transactions/constants/statuses';
import { BINARY, SCALAR } from '../../markets/constants/market-types';
import { formatEther, formatPercent, formatRealEther, formatRep, formatShares } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { updateEventMarketsMap } from '../../markets/actions/update-markets-data';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { selectMarketLink } from '../../link/selectors/links';
import { selectMarketIDFromEventID } from '../../market/selectors/market';
import { formatReportedOutcome } from '../../reports/selectors/reportable-outcomes';

export function loadMarketThenRetryConversion(marketID, label, log, callback) {
	return (dispatch, getState) => {
		dispatch(loadMarketsInfo([marketID], () => {
			if (!getState().marketsData[marketID]) {
				if (callback) callback(`could not load info for market ${marketID}`);
			} else {
				dispatch(convertLogsToTransactions(label, [log], true));
				if (callback) callback();
			}
		}));
	};
}

export function convertLogsToTransactions(label, logs, isRetry) {
	return (dispatch, getState) => {
		console.log('convertLogsToTransactions', label);
		console.log('logs:', logs);
		const { loginAccount } = getState();
		async.eachLimit(logs, constants.PARALLEL_LIMIT, (log, nextLog) => {
			const hash = log.transactionHash;
			if (!hash) return nextLog();
			const utd = { [hash]: { hash, status: SUCCESS, data: {} } };
			if (log.timestamp) utd[hash].timestamp = formatDate(new Date(log.timestamp * 1000));
			switch (label) {
				case 'Approval':
					utd[hash].type = 'Approved to Send Reputation';
					utd[hash].data.description = `Approve ${log._spender} to send Reputation`;
					utd[hash].message = `approved`;
					break;
				case 'collectedFees': {
					const repGain = abi.bignum(log.repGain);
					const initialRepBalance = abi.bignum(log.newRepBalance).minus(repGain).toFixed();
					utd[hash].type = `Collect Reporting Fees`;
					utd[hash].message = `reported using ${formatRep(initialRepBalance).full}`;
					const totalReportingRep = abi.bignum(log.totalReportingRep);
					if (!totalReportingRep.eq(constants.ZERO)) {
						const percentRep = formatPercent(abi.bignum(initialRepBalance).dividedBy(totalReportingRep).times(100));
						utd[hash].message = `${utd[hash].message} (${percentRep.full})`;
					}
					utd[hash].data.description = `Reporting cycle #${log.period}`;
					utd[hash].data.balances = [{
						change: formatEther(log.cashFeesCollected, { positiveSign: true }),
						balance: formatEther(log.newCashBalance)
					}, {
						change: formatRep(log.repGain, { positiveSign: true }),
						balance: formatRep(log.newRepBalance)
					}];
					utd[hash].bond = { label: 'reporting', value: formatRealEther(log.notReportingBond) };
					break;
				}
				case 'deposit':
					utd[hash].type = 'Deposit Ether';
					utd[hash].data.description = 'Convert Ether to tradeable Ether token';
					utd[hash].message = `deposited ${formatEther(log.value).full}`;
					break;
				case 'marketCreated': {
					console.log('marketCreated:', log);
					utd[hash].type = 'Create Market';
					const market = getState().marketsData[log.marketID];
					if (!market) {
						if (isRetry) return nextLog(log);
						return dispatch(loadMarketThenRetryConversion(log.marketID, label, log, nextLog));
					}
					utd[hash].data.description = market ? market.description : log.marketID.replace('0x', '');
					utd[hash].data.marketLink = selectMarketLink({ id: log.marketID, description: utd[hash].data.description }, dispatch);
					utd[hash].marketCreationFee = formatEther(log.marketCreationFee);
					utd[hash].bond = { label: 'event validity', value: formatEther(log.eventBond) };
					break;
				}
				case 'payout': {
					utd[hash].type = 'Claim Trading Payout';
					const market = getState().marketsData[log.market];
					if (!market) {
						if (isRetry) return nextLog(log);
						return dispatch(loadMarketThenRetryConversion(log.market, label, log, nextLog));
					}
					utd[hash].message = `closed out ${formatShares(log.shares).full}`;
					utd[hash].data.description = market.description;
					utd[hash].data.balances = [{
						change: formatEther(log.cashPayout, { positiveSign: true }),
						balance: formatEther(log.cashBalance)
					}];
					utd[hash].data.marketLink = selectMarketLink({ id: log.market, description: market.description }, dispatch);
					// utd[hash].totalReturn = formatEther(log.cashPayout);
					break;
				}
				case 'penalizationCaughtUp':
					utd[hash].type = 'Reporting Cycle Catch-Up';
					utd[hash].data.description = `Missed Reporting cycles ${log.penalizedFrom} to cycle ${log.penalizedUpTo}`;
					// TODO link to this cycle in My Reports
					utd[hash].data.balances = [{
						change: formatRep(log.repLost, { positiveSign: true }),
						balance: formatRep(log.newRepBalance)
					}];
					utd[hash].message = `caught up ${parseInt(log.penalizedUpTo, 10) - parseInt(log.penalizedFrom, 10)} cycles`;
					break;
				case 'penalize': {
					utd[hash].type = 'Compare Report To Consensus';
					const { marketsData, outcomesData } = getState();
					const marketID = selectMarketIDFromEventID(log.event);
					if (!marketID) {
						if (isRetry) return nextLog(log);
						return augur.getMarkets(log.event, (markets) => {
							if (markets && markets.length) {
								dispatch(updateEventMarketsMap(log.event, markets));
								dispatch(loadMarketThenRetryConversion(markets[0], label, log, nextLog));
							}
						});
					}
					const market = marketsData[marketID];
					if (!market) {
						return dispatch(loadMarketThenRetryConversion(marketID, label, log, nextLog));
					}
					const marketOutcomes = outcomesData[marketID];
					const formattedReport = formatReportedOutcome(log.reportValue, true, market.minValue, market.maxValue, market.type, marketOutcomes);
					if (log.reportValue === log.outcome) {
						utd[hash].message = `✔ report ${formattedReport} matches the consensus`;
					} else {
						utd[hash].message = `✘ report ${formattedReport} does not match the consensus ${formatReportedOutcome(log.outcome, true, market.minValue, market.maxValue, market.type, marketOutcomes)}`;
					}
					utd[hash].data.description = market.description;
					utd[hash].data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
					utd[hash].data.balances = [{
						change: formatRep(log.repchange, { positiveSign: true }),
						balance: formatRep(log.newafterrep)
					}];
					break;
				}
				case 'registration':
					utd[hash].type = 'Register New Account';
					utd[hash].data.description = `Register account ${log.sender.replace('0x', '')}`;
					utd[hash].message = `registration timestamp saved`;
					break;
				case 'submittedReport': {
					utd[hash].type = 'Reveal Report';
					const { marketsData, outcomesData } = getState();
					const marketID = selectMarketIDFromEventID(log.event);
					if (!marketID) {
						if (isRetry) return nextLog(log);
						console.debug('market ID not found, retrying...');
						return augur.getMarkets(log.event, (markets) => {
							if (markets && markets.length) {
								dispatch(updateEventMarketsMap(log.event, markets));
								dispatch(loadMarketThenRetryConversion(markets[0], label, log, nextLog));
							}
						});
					}
					const market = marketsData[marketID];
					if (!market) {
						if (isRetry) return nextLog(log);
						return dispatch(loadMarketThenRetryConversion(marketID, label, log, nextLog));
					}
					const marketOutcomes = outcomesData[marketID];
					utd[hash].data.description = market.description;
					utd[hash].data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
					utd[hash].message = `revealed report: ${formatReportedOutcome(log.report, log.ethics, market.minValue, market.maxValue, market.type, marketOutcomes)}`;
					break;
				}
				case 'submittedReportHash': {
					utd[hash].type = 'Commit Report';
					const { marketsData, outcomesData } = getState();
					const marketID = selectMarketIDFromEventID(log.event);
					if (!marketID) {
						if (isRetry) return nextLog(log);
						return augur.getMarkets(log.event, (markets) => {
							if (markets && markets.length) {
								dispatch(updateEventMarketsMap(log.event, markets));
								dispatch(loadMarketThenRetryConversion(markets[0], label, log, nextLog));
							}
						});
					}
					const market = marketsData[marketID];
					if (!market) {
						if (isRetry) return nextLog(log);
						return dispatch(loadMarketThenRetryConversion(marketID, label, log, nextLog));
					}
					const marketOutcomes = outcomesData[marketID];
					utd[hash].data.description = market.description;
					utd[hash].data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
					utd[hash].message = `committed to report`;
					if (loginAccount.derivedKey) {
						const report = augur.parseAndDecryptReport([
							log.encryptedReport,
							log.encryptedSalt
						], { derivedKey: loginAccount.derivedKey }).report;
						utd[hash].message = `${utd[hash].message}: ${formatReportedOutcome(report, log.ethics, market.minValue, market.maxValue, market.type, marketOutcomes)}`;
					}
					break;
				}
				case 'tradingFeeUpdated': {
					utd[hash].type = 'Trading Fee Updated';
					const { marketsData } = getState();
					const market = marketsData[log.marketID];
					if (!market) {
						if (isRetry) return nextLog(log);
						return dispatch(loadMarketThenRetryConversion(log.marketID, label, log, nextLog));
					}
					utd[hash].data.description = market.description;
					utd[hash].data.marketLink = selectMarketLink({ id: log.marketID, description: market.description }, dispatch);
					utd[hash].message = `updated trading fee: ${formatPercent(abi.bignum(log.tradingFee).times(100)).full}`;
					break;
				}
				case 'Transfer':
					utd[hash].type = 'Transfer Reputation';
					utd[hash].message = `transferred ${formatRep(log._value).full}`;
					utd[hash].data.description = `Transfer Reputation from ${log._from} to ${log._to}`;
					utd[hash].data.balances = [{
						change: formatRep(log._value, { positiveSign: true })
					}];
					break;
				case 'withdraw':
					utd[hash].type = 'Withdraw Ether';
					utd[hash].message = `withdrew ${formatEther(log.value).full}`;
					utd[hash].data.description = 'Convert tradeable Ether token to Ether';
					break;
				default:
					utd[hash].type = label;
					utd[hash].message = hash;
					utd[hash].data.description = JSON.stringify(log);
					break;
			}
			console.log('updated transactions data:', utd);
			dispatch(updateTransactionsData(utd));
			nextLog();
		}, (err) => {
			if (err) console.error(err);
		});
	};
}

export function convertTradeLogToTransaction(label, data, marketID) {
	return (dispatch, getState) => {
		const { marketsData, outcomesData } = getState();
		let outcomeID;
		let trade;
		let numTrades;
		let outcomeName;
		let marketType;
		let marketOutcomesData;
		const outcomeIDs = Object.keys(data[marketID]);
		const numOutcomes = outcomeIDs.length;
		if (marketsData[marketID]) {
			const description = marketsData[marketID].description;
			for (let j = 0; j < numOutcomes; ++j) {
				outcomeID = outcomeIDs[j];
				numTrades = data[marketID][outcomeID].length;
				marketOutcomesData = outcomesData[marketID];
				if (numTrades) {
					for (let k = 0; k < numTrades; ++k) {
						trade = data[marketID][outcomeID][k];
						marketType = marketsData[marketID] && marketsData[marketID].type;
						if (marketType === BINARY || marketType === SCALAR) {
							outcomeName = null;
						} else {
							outcomeName = (marketOutcomesData ? marketOutcomesData[outcomeID] : {}).name;
						}
						let utd = {};
						console.log('converting trading log:', trade);
						switch (label) {
							case 'log_fill_tx': {
								const hash = trade.transactionHash;
								const transactionID = `${hash}-${trade.tradeid}`;
								const price = formatEther(trade.price);
								const shares = formatShares(trade.amount);
								const bnPrice = abi.bignum(trade.price);
								const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
								const bnShares = abi.bignum(trade.amount);
								const totalCost = bnPrice.times(bnShares).plus(tradingFees);
								const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
								const totalCostPerShare = totalCost.dividedBy(bnShares);
								const totalReturnPerShare = totalReturn.dividedBy(bnShares);
								let type;
								let perfectType;
								let formattedTotalCost;
								let formattedTotalReturn;
								if (trade.maker) {
									type = trade.type === 'sell' ? 'match_bid' : 'match_ask';
									perfectType = trade.type === 'sell' ? 'bought' : 'sold';
									formattedTotalCost = trade.type === 'sell' ? formatEther(totalCost) : undefined;
									formattedTotalReturn = trade.type === 'buy' ? formatEther(totalReturn) : undefined;
								} else {
									type = trade.type === 'buy' ? 'buy' : 'sell';
									perfectType = trade.type === 'buy' ? 'bought' : 'sold';
									formattedTotalCost = trade.type === 'buy' ? formatEther(totalCost) : undefined;
									formattedTotalReturn = trade.type === 'sell' ? formatEther(totalReturn) : undefined;
								}
								const rawPrice = bnPrice;
								console.log('trade:', trade);
								utd = {
									[transactionID]: {
										type,
										hash,
										status: SUCCESS,
										data: {
											marketDescription: description,
											marketType: marketsData[marketID].type,
											outcomeName: outcomeName || outcomeID,
											outcomeID,
											marketLink: selectMarketLink({ id: marketID, description }, dispatch)
										},
										message: `${perfectType} ${shares.full} for ${formatEther(trade.type === 1 ? totalCostPerShare : totalReturnPerShare).full} / share`,
										rawNumShares: bnShares,
										numShares: shares,
										rawPrice,
										noFeePrice: price,
										avgPrice: price,
										timestamp: formatDate(new Date(trade.timestamp * 1000)),
										rawTradingFees: tradingFees,
										tradingFees: formatEther(tradingFees),
										feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
										rawTotalCost: totalCost,
										rawTotalReturn: totalReturn,
										totalCost: formattedTotalCost,
										totalReturn: formattedTotalReturn
									}
								};
								break;
							}
							case 'log_add_tx': {
								const market = marketsData[marketID];
								const type = trade.type === 'buy' ? 'bid' : 'ask';
								const price = formatEther(trade.price);
								const shares = formatShares(trade.amount);
								const makerFee = market.makerFee;
								const takerFee = market.takerFee;
								const maxValue = abi.bignum(market.maxValue);
								const minValue = abi.bignum(market.minValue);
								const fees = augur.calculateFxpTradingFees(makerFee, takerFee);
								const adjustedFees = augur.calculateFxpMakerTakerFees(
									augur.calculateFxpAdjustedTradingFee(
										fees.tradingFee,
										abi.fix(trade.price),
										abi.fix(maxValue.minus(minValue))
									),
									fees.makerProportionOfFee,
									false,
									true
								);
								const fxpShares = abi.fix(trade.amount);
								const fxpPrice = abi.fix(trade.price);
								const tradingFees = adjustedFees.maker.times(fxpShares)
									.dividedBy(constants.ONE)
									.floor()
									.times(fxpPrice)
									.dividedBy(constants.ONE)
									.floor();
								const noFeeCost = fxpPrice.times(fxpShares)
									.dividedBy(constants.ONE)
									.floor();
								const totalCost = noFeeCost.plus(tradingFees);
								const totalCostPerShare = totalCost.dividedBy(fxpShares)
									.times(constants.ONE)
									.floor();
								const totalReturn = fxpPrice.times(fxpShares)
									.dividedBy(constants.ONE)
									.floor()
									.minus(tradingFees);
								const totalReturnPerShare = totalReturn.dividedBy(fxpShares)
									.times(constants.ONE)
									.floor();
								utd = {
									[trade.transactionHash]: {
										type,
										status: SUCCESS,
										data: {
											marketDescription: description,
											marketType: marketsData[marketID].type,
											outcomeName: outcomeName || outcomeID,
											outcomeID,
											marketLink: selectMarketLink({ id: marketID, description }, dispatch)
										},
										message: `${type} ${shares.full} for ${formatEther(abi.unfix(trade.type === 'buy' ? totalCostPerShare : totalReturnPerShare)).full} / share`,
										numShares: shares,
										noFeePrice: price,
										freeze: {
											verb: 'froze',
											noFeeCost: trade.type === 'buy' ? formatEther(abi.unfix(noFeeCost)) : undefined,
											tradingFees: formatEther(abi.unfix(tradingFees))
										},
										avgPrice: price,
										timestamp: formatDate(new Date(trade.timestamp * 1000)),
										hash: trade.transactionHash,
										tradingFees: formatEther(abi.unfix(tradingFees)),
										feePercent: formatPercent(abi.unfix(tradingFees.dividedBy(totalCost).times(constants.ONE).floor()).times(100)),
										totalCost: trade.type === 'buy' ? formatEther(abi.unfix(totalCost)) : undefined,
										totalReturn: trade.type === 'sell' ? formatEther(abi.unfix(totalReturn)) : undefined
									}
								};
								break;
							}
							case 'log_cancel': {
								const price = formatEther(trade.price);
								const shares = formatShares(trade.amount);
								utd = {
									[trade.transactionHash]: {
										type: 'cancel_order',
										status: SUCCESS,
										data: {
											order: { type: trade.type, shares },
											marketDescription: description,
											marketType: marketsData[marketID] && marketsData[marketID].type,
											outcome: { name: outcomeName || outcomeID },
											outcomeID,
											marketLink: selectMarketLink({ id: marketID, description }, dispatch)
										},
										message: `canceled order to ${trade.type} ${shares.full} for ${price.full} each`,
										numShares: shares,
										noFeePrice: price,
										avgPrice: price,
										timestamp: formatDate(new Date(trade.timestamp * 1000)),
										hash: trade.transactionHash,
										totalReturn: formatEther(trade.cashRefund)
									}
								};
								break;
							}
							default:
								break;
						}
						console.log('updated transactions data:', utd);
						dispatch(updateTransactionsData(utd));
					}
				}
			}
		}
	};
}

export function convertTradeLogsToTransactions(label, data, marketID) {
	return (dispatch, getState) => {
		console.log('convertLogsToTransactions', label);
		console.log('data:', data);
		const { marketsData } = getState();
		const marketIDs = Object.keys(data);
		const numMarkets = marketIDs.length;
		for (let i = 0; i < numMarkets; ++i) {
			if (marketsData[marketIDs[i]]) {
				dispatch(convertTradeLogToTransaction(label, data, marketIDs[i]));
			}
			dispatch(loadMarketsInfo([marketIDs[i]], () => {
				dispatch(convertTradeLogToTransaction(label, data, marketIDs[i]));
			}));
		}
	};
}
