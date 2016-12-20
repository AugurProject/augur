import { abi, augur, constants } from '../../../services/augurjs';
import { SUCCESS } from '../../transactions/constants/statuses';
import { BINARY, SCALAR } from '../../markets/constants/market-types';
import { BINARY_NO_OUTCOME_NAME, BINARY_YES_OUTCOME_NAME, CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';
import { formatEther, formatPercent, formatRealEther, formatRep, formatShares } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { selectMarketLink } from '../../link/selectors/links';

export const UPDATE_LOGS_DATA = 'UPDATE_LOGS_DATA';

export function getOutcomeName(outcomeID, eventType, outcomesData = {}) {
	let outcomeName;
	if (eventType === BINARY) {
		if (outcomeID === '1') {
			outcomeName = BINARY_NO_OUTCOME_NAME;
		} else if (outcomeID === '2') {
			outcomeName = BINARY_YES_OUTCOME_NAME;
		} else {
			outcomeName = INDETERMINATE_OUTCOME_NAME;
		}
	} else if (outcomeID === CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID) {
		outcomeName = INDETERMINATE_OUTCOME_NAME;
	} else if (eventType === SCALAR) {
		outcomeName = outcomeID;
	} else {
		outcomeName = outcomesData[outcomeID].name;
	}
	return outcomeName;
}

export function selectMarketIDFromEventID(eventID, marketsData) {
	const marketIDs = Object.keys(marketsData);
	const numMarkets = marketIDs.length;
	console.log('marketIDs:', marketIDs);
	for (let i = 0; i < numMarkets; ++i) {
		console.log('checking:', marketIDs[i], marketsData[marketIDs[i]]);
		if (eventID === marketsData[marketIDs[i]].eventID) {
			return marketIDs[i];
		}
	}
	return null;
}

export function formatReportedOutcome(rawReportedOutcome, isEthical, minValue, maxValue, eventType, outcomesData = {}) {
	const report = augur.unfixReport(rawReportedOutcome, minValue, maxValue, eventType);
	if (report.isIndeterminate) return INDETERMINATE_OUTCOME_NAME;
	const outcomeName = getOutcomeName(report.report, eventType, outcomesData || {});
	if (isEthical) return outcomeName;
	return `${outcomeName} and Unethical`;
}

export function updateLogsData(label, logs) {
	return (dispatch, getState) => {
		dispatch(convertLogsToTransactions(label, logs));
		dispatch({ type: UPDATE_LOGS_DATA, label, logs });
	};
}

export function convertLogsToTransactions(label, logs) {
	return (dispatch, getState) => {
		console.log('convertLogsToTransactions', label);
		console.log('logs:', logs);
		const { loginAccount, marketsData } = getState();
		const numLogs = logs.length;
		let log;
		let utd;
		for (let i = 0; i < numLogs; ++i) {
			log = logs[i];
			const hash = log.transactionHash;
			utd = { [hash]: { hash, status: SUCCESS, data: {} } };
			if (log.timestamp) utd[hash].timestamp = formatDate(new Date(log.timestamp * 1000));
			switch (label) {
				case 'Approval':
					utd[hash].type = 'Approved to Send Reputation';
					utd[hash].data.description = `Approve ${log._spender} to send Reputation`;
					utd[hash].message = `approved`;
					break;
				case 'collectedFees':
					utd[hash].type = `Collect Reporting Fees`;
					utd[hash].data.description = `Collect Reporting fees for cycle ${log.period}: ${formatRep(log.lastPeriodRepBalance).full} of ${formatRep(log.totalRepReporting).full}`;
					if (log.cashFeesCollected !== '0') {
						utd[hash].message = `${formatEther(log.cashFeesCollected, { positiveSign: true }).full} (balance: ${formatEther(log.newCashBalance).full})`;
						if (log.repGain !== '0') {
							utd[hash].message = `${utd[hash].message}<br />
								${formatRep(log.repGain, { positiveSign: true }).full} (balance: ${formatRep(log.newRepBalance).full})`;
						}
					} else {
						utd[hash].message = 'no fees to collect';
					}
					utd[hash].bond = { label: 'reporting', value: formatRealEther(log.notReportingBond) };
					break;
				case 'deposit':
					utd[hash].type = 'Deposit Ether';
					utd[hash].data.description = 'Convert Ether to tradeable Ether token';
					utd[hash].message = `deposited ${formatEther(log.value).full}`;
					break;
				case 'marketCreated':
					utd[hash].type = 'Create Market';
					utd[hash].data.description = marketsData[log.marketID] ? marketsData[log.marketID].description : log.marketID.replace('0x', '');
					utd[hash].marketCreationFee = formatEther(log.marketCreationFee);
					utd[hash].bond = { label: 'event activation', value: formatEther(log.eventBond) };
					break;
				case 'payout':
					utd[hash].type = 'Claim Trading Payout';
					utd[hash].data.description = marketsData[log.market].description;
					utd[hash].message = `closed out ${formatShares(log.shares).full} for ${formatEther(log.cash).full}`;
					break;
				case 'penalizationCaughtUp':
					utd[hash].type = 'Reporting Cycle Catch-Up';
					utd[hash].data.description = `Missed Reporting cycles ${log.penalizedFrom} to cycle ${log.penalizedUpTo}`;
					utd[hash].message = `${formatRep(log.repLost).full} (balance: ${formatRep(log.newRepBalance).full})`;
					break;
				case 'penalize': {
					utd[hash].type = 'Compare Report To Consensus';
					const marketID = selectMarketIDFromEventID(log.event, marketsData);
					const outcomesData = getState().outcomesData[marketID];
					const market = marketsData[marketID];
					const formattedReport = formatReportedOutcome(log.reportValue, true, market.minValue, market.maxValue, market.type, outcomesData);
					utd[hash].data.description = market.description;
					if (log.reportValue === log.outcome) {
						utd[hash].message = `reported outcome ${formattedReport} matches the consensus outcome`;
					} else {
						utd[hash].message = `reported outcome ${formattedReport} does not match the consensus outcome ${formatReportedOutcome(log.outcome, market.minValue, market.maxValue, market.type, outcomesData)}`;
					}
					break;
				}
				case 'submittedReport': {
					utd[hash].type = 'Reveal Report';
					const marketID = selectMarketIDFromEventID(log.event, marketsData);
					const outcomesData = getState().outcomesData[marketID];
					const market = marketsData[marketID];
					utd[hash].data.description = market.description;
					utd[hash].message = `revealed report: ${formatReportedOutcome(log.report, log.ethics, market.minValue, market.maxValue, market.type, outcomesData)}`;
					break;
				}
				case 'submittedReportHash': {
					utd[hash].type = 'Commit Report';
					const marketID = selectMarketIDFromEventID(log.event, marketsData);
					const outcomesData = getState().outcomesData[marketID];
					const market = marketsData[marketID];
					utd[hash].data.description = market.description;
					utd[hash].message = `committed to report`;
					if (loginAccount.derivedKey) {
						const report = abi.unfix(abi.hex(augur.decryptReport(log.encryptedReport, loginAccount.derivedKey, log.encryptedSalt), true), 'string');
						utd[hash].message = `${utd[hash].message}: ${formatReportedOutcome(report, log.ethics, market.minValue, market.maxValue, market.type, outcomesData)}`;
					}
					break;
				}
				case 'registration':
					utd[hash].type = 'Register New Account';
					utd[hash].data.description = `Register account ${log.sender.replace('0x', '')}`;
					utd[hash].message = `registration timestamp saved`;
					break;
				case 'tradingFeeUpdated':
					utd[hash].type = 'Trading Fee Updated';
					utd[hash].data.description = marketsData[log.marketID].description;
					utd[hash].message = `updated trading fee: ${formatPercent(abi.bignum(log.tradingFee).times(100)).full}`;
					break;
				case 'Transfer':
					utd[hash].type = 'Transfer Reputation';
					utd[hash].data.description = `Transfer Reputation from ${log._from} to ${log._to}`;
					utd[hash].message = `transferred ${formatRep(log._value).full}`;
					break;
				case 'withdraw':
					utd[hash].type = 'Withdraw Ether';
					utd[hash].data.description = 'Convert tradeable Ether token to Ether';
					utd[hash].message = `withdrew ${formatEther(log.value).full}`;
					break;
				default:
					utd[hash].type = label;
					utd[hash].data.description = JSON.stringify(log);
					utd[hash].message = hash;
					break;
			}
			console.log('utd:', utd);
			dispatch(updateTransactionsData(utd));
		}
	};
}

export function convertTradingLogToTransaction(label, data, marketID) {
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
						switch (label) {
							case 'log_fill_tx': {
								const hash = trade.transactionHash;
								const transactionID = `${hash}-${trade.sequenceNumber}`;
								const type = trade.type === 1 ? 'buy' : 'sell';
								const perfectType = trade.type === 1 ? 'bought' : 'sold';
								const price = formatEther(trade.price);
								const shares = formatShares(trade.shares);
								const bnPrice = abi.bignum(trade.price);
								const tradingFees = abi.bignum(trade.takerFee);
								const bnShares = abi.bignum(trade.shares);
								const totalCost = bnPrice.times(bnShares).plus(tradingFees);
								const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
								const totalCostPerShare = totalCost.dividedBy(bnShares);
								const totalReturnPerShare = totalReturn.dividedBy(bnShares);
								const rawPrice = bnPrice;
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
										totalCost: trade.type === 1 ? formatEther(totalCost) : undefined,
										totalReturn: trade.type === 2 ? formatEther(totalReturn) : undefined,
										sequenceNumber: trade.sequenceNumber
									}
								};
								break;
							}
							case 'log_add_tx': {
								const type = trade.type === 'buy' ? 'bid' : 'ask';
								const price = formatEther(trade.price);
								const shares = formatShares(trade.amount);
								const makerFee = marketsData[marketID].makerFee;
								const takerFee = marketsData[marketID].takerFee;
								const maxValue = abi.bignum(marketsData[marketID].maxValue);
								const minValue = abi.bignum(marketsData[marketID].minValue);
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
						console.log('utd:', utd);
						dispatch(updateTransactionsData(utd));
					}
				}
			}
		}
	};
}

export function convertTradingLogsToTransactions(label, data, marketID) {
	return (dispatch, getState) => {
		console.log('convertLogsToTransactions', label);
		console.log('data:', data);
		const { marketsData } = getState();
		const marketIDs = Object.keys(data);
		const numMarkets = marketIDs.length;
		for (let i = 0; i < numMarkets; ++i) {
			if (marketsData[marketIDs[i]]) {
				dispatch(convertTradingLogToTransaction(label, data, marketIDs[i]));
			}
			dispatch(loadMarketsInfo([marketIDs[i]], () => {
				dispatch(convertTradingLogToTransaction(label, data, marketIDs[i]));
			}));
		}
	};
}
