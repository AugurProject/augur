import { abi, augur, rpc } from '../../../services/augurjs';
import { SUBMITTED, SUCCESS } from '../../transactions/constants/statuses';
import { NO_RELAY } from '../../transactions/constants/no-relay';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { constructTradingTransaction, constructTransaction, constructBasicTransaction } from '../../transactions/actions/convert-logs-to-transactions';
import { selectMarketFromEventID } from '../../market/selectors/market';
import selectWinningPositions from '../../my-positions/selectors/winning-positions';

export function unpackTransactionParameters(tx) {
	const params = tx.data.params;
	if (!params) return null;
	const inputs = tx.data.inputs;
	const numInputs = inputs.length;
	const unfixedParams = params.constructor === Array ? params.slice() : [params];
	const unpacked = {};
	for (let i = 0; i < numInputs; ++i) {
		unpacked[inputs[i]] = unfixedParams[i];
	}
	return unpacked;
}

export function constructRelayTransaction(tx, status) {
	return (dispatch, getState) => {
		const p = {
			...unpackTransactionParameters(tx),
			transactionHash: tx.response.hash,
			blockNumber: tx.response.blockNumber,
			timestamp: tx.response.timestamp || parseInt(Date.now() / 1000, 10)
		};
		console.log('unpacked:', JSON.stringify(p, null, 2));
		const hash = tx.response.hash;
		const method = tx.data.method;
		const contracts = augur.contracts;
		const contract = Object.keys(contracts).find(c => contracts[c] === tx.data.to);
		const gasFees = augur.getTxGasEth({
			...augur.api.functions[contract][method]
		}, rpc.gasPrice).toFixed();
		switch (method) {
			case 'buy':
				return dispatch(constructTradingTransaction('log_add_tx', {
					type: 'buy',
					...p,
					price: abi.unfix(abi.hex(p.price, true), 'string'),
					amount: abi.unfix(p.amount, 'string')
				}, p.market, p.outcome, status));
			case 'shortAsk':
			case 'sell':
				return dispatch(constructTradingTransaction('log_add_tx', {
					type: 'sell',
					...p,
					price: abi.unfix(abi.hex(p.price, true), 'string'),
					amount: abi.unfix(p.amount, 'string')
				}, p.market, p.outcome, status));
			// note: trade, short_sell, and cancel messaging done manually until the next contract update
			case 'trade':
			case 'short_sell':
			case 'cancel':
				return null;
			default: {
				let transaction;
				switch (method) {
					case 'submitReport':
						transaction = dispatch(constructTransaction('submittedReport', {
							...p, // { event, report, salt }
							ethics: parseInt(p.ethics, 16)
						}));
						break;
					case 'submitReportHash':
						transaction = dispatch(constructTransaction('submittedReportHash', {
							...p, // { event, encryptedReport, encryptedSalt }
							ethics: parseInt(p.ethics, 16)
						}));
						break;
					case 'penalizeWrong': {
						const { eventsWithSubmittedReport } = getState();
						if (!parseInt(p.event, 16) || !eventsWithSubmittedReport || !eventsWithSubmittedReport[p.event]) {
							return null;
						}
						const market = selectMarketFromEventID(p.event);
						if (!market) return null;
						transaction = dispatch(constructTransaction('penalize', {
							...p, // { event }
							reportValue: eventsWithSubmittedReport[p.event].accountReport,
							outcome: market.reportedOutcome
						}));
						break;
					}
					case 'penalizationCatchup': {
						const { lastPeriodPenalized, reportPeriod } = getState().branch;
						transaction = dispatch(constructTransaction('penalizationCaughtUp', {
							...p,
							penalizedFrom: lastPeriodPenalized,
							penalizeUpTo: reportPeriod
						}));
						break;
					}
					case 'collectFees': {
						const { branch, loginAccount } = getState();
						transaction = dispatch(constructTransaction('collectedFees', {
							...p,
							initialRepBalance: loginAccount.rep,
							notReportingBond: abi.unfix(tx.data.value, 'string'),
							period: branch.lastPeriodPenalized
						}));
						break;
					}
					case 'claimProceeds': {
						const winningPositions = selectWinningPositions();
						const shares = (winningPositions.find(position => position.id === p.market) || {}).shares;
						transaction = dispatch(constructTransaction('payout', { ...p, shares }));
						break;
					}
					case 'transfer':
						transaction = dispatch(constructTransaction('Transfer', {
							...p,
							_from: tx.data.from,
							_to: abi.format_address(p.recver),
							_value: abi.unfix(p.value, 'string')
						}));
						break;
					case 'approve':
						transaction = dispatch(constructTransaction('Approve', {
							...p,
							_spender: abi.format_address(p.spender)
						}));
						break;
					case 'register':
						transaction = dispatch(constructTransaction('registration', {
							...p,
							sender: tx.data.from
						}));
						break;
					case 'createMarket':
					case 'createSingleEventMarket': {
						const { baseReporters, numEventsCreatedInPast24Hours, numEventsInReportPeriod, periodLength } = getState().branch;
						transaction = dispatch(constructTransaction('marketCreated', {
							...p,
							eventBond: augur.calculateValidityBond(p.tradingFee, periodLength, baseReporters, numEventsCreatedInPast24Hours, numEventsInReportPeriod),
							marketCreationFee: abi.unfix(augur.calculateRequiredMarketValue(rpc.gasPrice), 'string')
						}));
						break;
					}
					default:
						return null;
				}
				return {
					[hash]: {
						...constructBasicTransaction(hash, status, tx.response.blockNumber, tx.response.timestamp, gasFees),
						...transaction
					}
				};
			}
		}
	};
}

export function registerTransactionRelay() {
	return (dispatch, getState) => {
		rpc.excludeFromTxRelay(NO_RELAY);
		rpc.registerTxRelay((tx) => {
			if (tx && tx.response && tx.data) {
				console.log('txRelay:', tx);
				const hash = tx.response.hash;
				const { loginAccount, transactionsData } = getState();
				if (hash && tx.data.from === loginAccount.address) {
					const timestamp = tx.response.timestamp || parseInt(Date.now() / 1000, 10);
					const gasFees = tx.response.gasFees || augur.getTxGasEth({ ...tx.data }, rpc.gasPrice).toFixed();
					if (!transactionsData[hash] || transactionsData[hash].status !== SUCCESS) {
						const status = tx.response.blockHash ? SUCCESS : SUBMITTED;
						const relayTransaction = dispatch(constructRelayTransaction(tx, status));
						if (relayTransaction) {
							return dispatch(updateTransactionsData(relayTransaction));
						}
						if (!tx.description && tx.data.description) {
							tx.description = tx.data.description;
						}
						if (!tx.description && tx.data.inputs) {
							const params = tx.data.params.slice();
							if (tx.data.fixed) {
								const numFixed = tx.data.fixed.length;
								for (let i = 0; i < numFixed; ++i) {
									params[tx.data.fixed[i]] = abi.unfix(params[tx.data.fixed[i]], 'string');
								}
							}
							tx.description = tx.data.inputs.map((input, i) => `${input}: ${params[i]}`).join('\n');
						}
						if (transactionsData[hash] && transactionsData[hash].disableAutoMessage) {
							return dispatch(updateTransactionsData({
								[hash]: {
									...tx,
									...constructBasicTransaction(hash, status, tx.response.blockNumber, timestamp, gasFees),
									hash
								}
							}));
						}
						let message;
						if (tx.response.callReturn && (
							tx.response.callReturn.constructor === Array ||
							tx.response.callReturn.constructor === Object)
						) {
							message = JSON.stringify(tx.response.callReturn);
						} else {
							message = tx.response.callReturn;
						}
						dispatch(updateTransactionsData({
							[hash]: {
								...tx,
								...constructBasicTransaction(hash, status, tx.response.blockNumber, timestamp, gasFees),
								message,
								hash
							}
						}));
					} else if (transactionsData[hash]) {
						dispatch(updateExistingTransaction(hash, { gasFees }));
					}
				}
			}
		});
	};
}
