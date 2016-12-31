import async from 'async';
import { abi, augur, constants } from '../../../services/augurjs';
import { SUCCESS } from '../../transactions/constants/statuses';
import { BINARY, SCALAR } from '../../markets/constants/market-types';
import { formatEther, formatPercent, formatRealEther, formatRep, formatShares } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { updateMarketsData, updateEventMarketsMap } from '../../markets/actions/update-markets-data';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { selectMarketLink } from '../../link/selectors/links';
import { selectMarketIDFromEventID } from '../../market/selectors/market';
import { formatReportedOutcome } from '../../reports/selectors/reportable-outcomes';

export function loadMarketThenRetryConversion(marketID, label, log, callback) {
	return (dispatch, getState) => {
		dispatch(augur.getMarketInfo(marketID, (marketInfo) => {
			if (!marketInfo || marketInfo.error) {
				if (marketInfo && marketInfo.error) console.error('augur.getMarketInfo:', marketInfo);
				return callback(`[${label}] couldn't load market info for market ${marketID}: ${JSON.stringify(log)}`);
			}
			dispatch(updateMarketsData({ [marketID]: marketInfo }));
			dispatch(convertLogsToTransactions(label, [log], true));
			if (callback) callback();
		}));
	};
}

export function lookupEventMarketsThenRetryConversion(eventID, label, log, callback) {
	return (dispatch, getState) => {
		augur.getMarkets(eventID, (markets) => {
			if (!markets || markets.error) {
				if (markets && markets.error) console.error('augur.getMarkets:', markets);
				return callback(`[${label}] couldn't load market IDs for event ${eventID}: ${JSON.stringify(log)}`);
			}
			if (markets && markets.length) {
				dispatch(updateEventMarketsMap(eventID, markets));
				dispatch(loadMarketThenRetryConversion(markets[0], label, log, callback));
			}
		});
	};
}

export function constructBasicTransaction(hash, status, blockNumber, timestamp) {
	const transaction = { hash, status };
	if (blockNumber) transaction.blockNumber = formatDate(new Date(blockNumber * 1000));
	if (timestamp) transaction.timestamp = formatDate(new Date(timestamp * 1000));
	return transaction;
}

export function constructApprovalTransaction(log) {
	const transaction = { data: {} };
	transaction.type = 'Approved to Send Reputation';
	transaction.description = `Approve ${log._spender} to send Reputation`;
	transaction.message = `approved`;
	return transaction;
}

export function constructCollectedFeesTransaction(log) {
	console.debug('collect fees log:', log);
	const transaction = { data: {} };
	const repGain = abi.bignum(log.repGain);
	const initialRepBalance = abi.bignum(log.newRepBalance).minus(repGain).toFixed();
	transaction.type = `Reporting Payment`;
	transaction.message = `reported with ${formatRep(initialRepBalance).full}`;
	const totalReportingRep = abi.bignum(log.totalReportingRep);
	if (!totalReportingRep.eq(constants.ZERO)) {
		const percentRep = formatPercent(abi.bignum(initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 });
		transaction.message = `${transaction.message} (${percentRep.full})`;
	}
	transaction.description = `Reporting cycle #${log.period}`;
	transaction.data.balances = [{
		change: formatEther(log.cashFeesCollected, { positiveSign: true }),
		balance: formatEther(log.newCashBalance)
	}, {
		change: formatRep(log.repGain, { positiveSign: true }),
		balance: formatRep(log.newRepBalance)
	}];
	console.log('transaction.data.balances:', transaction.data.balances);
	transaction.bond = { label: 'reporting', value: formatRealEther(log.notReportingBond) };
	return transaction;
}

export function constructDepositTransaction(log) {
	const transaction = { data: {} };
	transaction.type = 'Deposit Ether';
	transaction.description = 'Convert Ether to tradeable Ether token';
	transaction.message = `deposited ${formatEther(log.value).full}`;
	return transaction;
}

export function constructRegistrationTransaction(log) {
	const transaction = { data: {} };
	transaction.type = 'Register New Account';
	transaction.description = `Register account ${log.sender.replace('0x', '')}`;
	transaction.message = `registration timestamp saved`;
	return transaction;
}

export function constructPenalizationCatchupTransaction(log) {
	const transaction = { data: {} };
	transaction.type = 'Reporting Cycle Catch-Up';
	transaction.description = `Missed Reporting cycles ${log.penalizedFrom} to cycle ${log.penalizedUpTo}`;
	// TODO link to this cycle in My Reports
	if (log.repLost && log.newRepBalance) {
		transaction.data.balances = [{
			change: formatRep(log.repLost, { positiveSign: true }),
			balance: formatRep(log.newRepBalance)
		}];
	}
	transaction.message = `caught up ${parseInt(log.penalizedUpTo, 10) - parseInt(log.penalizedFrom, 10)} cycles`;
	return transaction;
}

export function constructTransferTransaction(log) {
	const transaction = { data: {} };
	transaction.type = 'Transfer Reputation';
	transaction.message = `transferred ${formatRep(log._value).full}`;
	transaction.description = `Transfer Reputation from ${log._from} to ${log._to}`;
	transaction.data.balances = [{
		change: formatRep(log._value, { positiveSign: true })
	}];
	return transaction;
}

export function constructWithdrawTransaction(log) {
	const transaction = { data: {} };
	transaction.type = 'Withdraw Ether';
	transaction.message = `withdrew ${formatEther(log.value).full}`;
	transaction.description = 'Convert tradeable Ether token to Ether';
	return transaction;
}

export function constructDefaultTransaction(label, log) {
	const transaction = { data: {} };
	transaction.type = label;
	transaction.message = log.transactionHash;
	transaction.description = JSON.stringify(log);
	return transaction;
}

export function constructMarketCreatedTransaction(log, market, dispatch) {
	const transaction = { data: {} };
	transaction.type = 'create_market';
	transaction.description = market ? market.description : log.marketID.replace('0x', '');
	transaction.marketCreationFee = formatEther(log.marketCreationFee);
	transaction.data.marketLink = selectMarketLink({ id: log.marketID, description: transaction.description }, dispatch);
	transaction.data.bond = { label: 'event validity', value: formatEther(log.eventBond) };
	return transaction;
}

export function constructPayoutTransaction(log, market, dispatch) {
	const transaction = { data: {} };
	transaction.type = 'Claim Trading Payout';
	transaction.message = `closed out ${formatShares(log.shares).full}`;
	transaction.description = market.description;
	transaction.data.balances = [{
		change: formatEther(log.cashPayout, { positiveSign: true }),
		balance: formatEther(log.cashBalance)
	}];
	transaction.data.marketLink = selectMarketLink({ id: log.market, description: market.description }, dispatch);
	return transaction;
}

export function constructTradingFeeUpdatedTransaction(log, market, dispatch) {
	const transaction = { data: {} };
	transaction.description = market.description;
	transaction.data.marketLink = selectMarketLink({ id: log.marketID, description: market.description }, dispatch);
	transaction.message = `updated trading fee: ${formatPercent(abi.bignum(log.tradingFee).times(100)).full}`;
	return transaction;
}

export function constructPenalizeTransaction(log, marketID, market, outcomes, dispatch) {
	const transaction = { data: {} };
	transaction.type = 'Compare Report To Consensus';
	const formattedReport = formatReportedOutcome(log.reportValue, true, market.minValue, market.maxValue, market.type, outcomes);
	if (log.reportValue === log.outcome) {
		transaction.message = `✔ report ${formattedReport} matches consensus`;
	} else {
		transaction.message = `✘ report ${formattedReport} does not match consensus ${formatReportedOutcome(log.outcome, true, market.minValue, market.maxValue, market.type, outcomes)}`;
	}
	transaction.description = market.description;
	transaction.data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
	if (log.repchange && log.newafterrep) {
		transaction.data.balances = [{
			change: formatRep(log.repchange, { positiveSign: true }),
			balance: formatRep(log.newafterrep)
		}];
	}
	return transaction;
}

export function constructSubmittedReportHashTransaction(log, marketID, market, outcomes, decryptionKey, dispatch) {
	const transaction = { data: {} };
	transaction.type = 'commit_report';
	transaction.description = market.description;
	transaction.data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
	transaction.data.market = market;
	transaction.data.isUnethical = !log.ethics;
	transaction.message = `committed to report`;
	if (decryptionKey) {
		const report = augur.parseAndDecryptReport([
			log.encryptedReport,
			log.encryptedSalt
		], { derivedKey: decryptionKey }).report;
		const formattedReport = formatReportedOutcome(report, log.ethics, market.minValue, market.maxValue, market.type, outcomes);
		transaction.data.reportedOutcomeID = formattedReport;
		transaction.data.outcome = { name: formattedReport };
		transaction.message = `${transaction.message}: ${formattedReport}`;
	}
	return transaction;
}

export function constructSubmittedReportTransaction(log, marketID, market, outcomes, dispatch) {
	const transaction = { data: {} };
	transaction.type = 'reveal_report';
	transaction.description = market.description;
	transaction.data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
	transaction.data.market = market;
	transaction.data.isUnethical = !log.ethics;
	const formattedReport = formatReportedOutcome(log.report, log.ethics, market.minValue, market.maxValue, market.type, outcomes);
	transaction.data.reportedOutcomeID = formattedReport;
	transaction.data.outcome = { name: formattedReport };
	transaction.message = `revealed report: ${formatReportedOutcome(log.report, log.ethics, market.minValue, market.maxValue, market.type, outcomes)}`;
	return transaction;
}

export function loadDataForMarketTransaction(label, log, isRetry, callback) {
	return (dispatch, getState) => {
		const marketID = log.marketID || log.market;
		const market = getState().marketsData[marketID];
		if (!market) {
			if (isRetry) return callback(log);
			return dispatch(loadMarketThenRetryConversion(marketID, label, log, callback));
		}
		return market;
	};
}

export function loadDataForReportingTransaction(label, log, isRetry, callback) {
	return (dispatch, getState) => {
		const { marketsData, outcomesData } = getState();
		const marketID = selectMarketIDFromEventID(log.event);
		if (!marketID) {
			if (isRetry) return callback(log);
			return dispatch(lookupEventMarketsThenRetryConversion(log.event, label, log, callback));
		}
		const market = marketsData[marketID];
		if (!market) {
			if (isRetry) return callback(log);
			return dispatch(loadMarketThenRetryConversion(marketID, label, log, callback));
		}
		return { marketID, market, outcomes: outcomesData[marketID] };
	};
}

export function constructMarketTransaction(label, log, marketID, market) {
	return (dispatch, getState) => {
		switch (label) {
			case 'marketCreated':
				return constructMarketCreatedTransaction(log, marketID, market, dispatch);
			case 'payout':
				return constructPayoutTransaction(log, marketID, market, dispatch);
			case 'tradingFeeUpdated':
				return constructTradingFeeUpdatedTransaction(log, marketID, market, dispatch);
			default:
				return null;
		}
	};
}

export function constructReportingTransaction(label, log, marketID, market, outcomes) {
	return (dispatch, getState) => {
		switch (label) {
			case 'penalize':
				return constructPenalizeTransaction(log, marketID, market, outcomes);
			case 'submittedReport':
				return constructSubmittedReportTransaction(log, marketID, market, outcomes);
			case 'submittedReportHash':
				return constructSubmittedReportHashTransaction(log, marketID, market, outcomes, getState().loginAccount.derivedKey);
			default:
				return null;
		}
	};
}

export function constructTransaction(label, log, isRetry, callback) {
	return (dispatch, getState) => {
		switch (label) {
			case 'Approval':
				return constructApprovalTransaction(log);
			case 'collectedFees':
				return constructCollectedFeesTransaction(log);
			case 'deposit':
				return constructDepositTransaction(log);
			case 'penalizationCaughtUp':
				return constructPenalizationCatchupTransaction(log);
			case 'registration':
				return constructRegistrationTransaction(log);
			case 'Transfer':
				return constructTransferTransaction(log);
			case 'withdraw':
				return constructWithdrawTransaction(log);
			case 'marketCreated':
			case 'payout':
			case 'tradingFeeUpdated': {
				const market = dispatch(loadDataForMarketTransaction(label, log, isRetry, callback));
				if (!market) break;
				return dispatch(constructMarketTransaction(label, log, market));
			}
			case 'penalize':
			case 'submittedReport':
			case 'submittedReportHash': {
				const aux = dispatch(loadDataForReportingTransaction(label, log, isRetry, callback));
				if (!aux) break;
				return dispatch(constructReportingTransaction(label, log, aux.marketID, aux.market, aux.outcomes));
			}
			default:
				return constructDefaultTransaction(label, log);
		}
	};
}

export function convertLogToTransaction(label, log, status, isRetry, cb) {
	return (dispatch, getState) => {
		console.log('convertLogToTransaction', label);
		console.log(log);
		const callback = cb || (e => console.log('convertLogToTransaction:', e));
		const hash = log.transactionHash;
		if (hash) {
			const transaction = dispatch(constructTransaction(label, log, isRetry, callback));
			if (transaction) {
				dispatch(updateTransactionsData({
					[hash]: {
						...constructBasicTransaction(hash, status, log.blockNumber, log.timestamp),
						...transaction
					}
				}));
				return callback();
			}
		}
	};
}

export const convertLogsToTransactions = (label, logs, isRetry) => (
	(dispatch, getState) => (
		async.eachSeries(logs, (log, nextLog) => (
			dispatch(convertLogToTransaction(label, log, SUCCESS, isRetry, nextLog))
		), err => (err && console.error(err)))
	)
);

export function constructLogFillTxTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, status, dispatch) {
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
	return {
		[transactionID]: {
			type,
			hash,
			status,
			description,
			data: {
				marketType,
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
}

export function constructLogCancelTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, status, dispatch) {
	const price = formatEther(trade.price);
	const shares = formatShares(trade.amount);
	return {
		[trade.transactionHash]: {
			type: 'cancel_order',
			status,
			description,
			data: {
				order: { type: trade.type, shares },
				marketType,
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
}

export function constructLogAddTxTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, market, status, dispatch) {
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
	return {
		[trade.transactionHash]: {
			type,
			status,
			description,
			data: {
				marketType,
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
}

export function constructTradingTransaction(label, trade, marketID, outcomeID, status) {
	return (dispatch, getState) => {
		const { marketsData, outcomesData } = getState();
		const market = marketsData[marketID];
		const marketOutcomesData = outcomesData[marketID];
		const marketType = market.type;
		const description = market.description;
		let outcomeName;
		if (marketType === BINARY || marketType === SCALAR) {
			outcomeName = null;
		} else {
			outcomeName = (marketOutcomesData ? marketOutcomesData[outcomeID] : {}).name;
		}
		switch (label) {
			case 'log_fill_tx': {
				return constructLogFillTxTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, status, dispatch);
			}
			case 'log_add_tx': {
				return constructLogAddTxTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, market, status, dispatch);
			}
			case 'log_cancel': {
				return constructLogCancelTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, status, dispatch);
			}
			default:
				return null;
		}
	};
}

export function convertTradeLogToTransaction(label, data, marketID) {
	return (dispatch, getState) => {
		const outcomeIDs = Object.keys(data[marketID]);
		const numOutcomes = outcomeIDs.length;
		for (let j = 0; j < numOutcomes; ++j) {
			const outcomeID = outcomeIDs[j];
			const numTrades = data[marketID][outcomeID].length;
			if (numTrades) {
				for (let k = 0; k < numTrades; ++k) {
					const transaction = dispatch(constructTradingTransaction(label, data[marketID][outcomeID][k], marketID, outcomeID, SUCCESS));
					if (transaction) dispatch(updateTransactionsData(transaction));
				}
			}
		}
	};
}

export function convertTradeLogsToTransactions(label, data, marketID) {
	return (dispatch, getState) => {
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
