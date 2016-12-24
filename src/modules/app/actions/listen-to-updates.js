import { augur, abi } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { syncBlockchain } from '../../app/actions/update-blockchain';
import { syncBranch } from '../../app/actions/update-branch';
import { addOrder, removeOrder, fillOrder } from '../../bids-asks/actions/update-market-order-book';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { updateOutcomePrice } from '../../markets/actions/update-outcome-price';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';
import { claimProceeds } from '../../my-positions/actions/claim-proceeds';
import { convertLogsToTransactions, convertTradeLogToTransaction } from '../../transactions/actions/convert-logs-to-transactions';

export function refreshMarket(marketID) {
	return (dispatch, getState) => {
		if (getState().marketsData[marketID]) {
			dispatch(loadMarketsInfo([marketID], () => {
				dispatch(loadBidsAsks(marketID));
				if (getState().loginAccount.address) {
					dispatch(loadAccountTrades(marketID));
				}
			}));
		}
	};
}

export function listenToUpdates() {
	return (dispatch, getState) => {
		augur.filters.listen({

			// block arrivals
			block: (blockHash) => {
				dispatch(updateAssets());
				dispatch(syncBlockchain());
				dispatch(syncBranch());
			},

			collectedFees: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('collectedFees:', msg);
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('collectedFees', [msg]));
				}
			},

			payout: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('payout:', msg);
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('payout', [msg]));
				}
			},

			penalizationCaughtUp: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('penalizationCaughtUp:', msg);
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('penalizationCaughtUp', [msg]));
				}
			},

			// Reporter penalization
			penalize: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('penalize:', msg);
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('penalize', [msg]));
				}
			},

			registration: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('registration:', msg);
					dispatch(convertLogsToTransactions('registration', [msg]));
				}
			},

			submittedReport: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('submittedReport:', msg);
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('submittedReport', [msg]));
				}
			},

			submittedReportHash: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('submittedReportHash:', msg);
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('submittedReportHash', [msg]));
				}
			},

			// trade filled: { market, outcome (id), price }
			log_fill_tx: (msg) => {
				console.debug('log_fill_tx:', msg);
				if (msg && msg.market && msg.price && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
					dispatch(fillOrder(msg));
					const { address } = getState().loginAccount;
					if (msg.maker === address || msg.taker === address) {
						dispatch(convertTradeLogToTransaction('log_fill_tx', {
							[msg.market]: { [msg.outcome]: [msg] }
						}, msg.market));
						dispatch(updateAssets());
					}
				}
			},

			// short sell filled
			log_short_fill_tx: (msg) => {
				console.debug('log_short_fill_tx:', msg);
				if (msg && msg.market && msg.price && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
					dispatch(fillOrder({ ...msg, type: 'sell' }));
					const { address } = getState().loginAccount;
					if (msg.maker === address || msg.taker === address) {
						dispatch(convertTradeLogToTransaction('log_fill_tx', {
							[msg.market]: { [msg.outcome]: [msg] }
						}, msg.market));
						dispatch(updateAssets());
					}
				}
			},

			// order added to orderbook
			log_add_tx: (msg) => {
				console.debug('log_add_tx:', msg);
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(addOrder(msg));
					const { address } = getState().loginAccount;
					if (msg.maker === address) {
						dispatch(convertTradeLogToTransaction('log_add_tx', {
							[msg.market]: { [msg.outcome]: [msg] }
						}, msg.market));
						dispatch(updateAssets());
					}
				}
			},

			// order removed from orderbook
			log_cancel: (msg) => {
				console.debug('log_cancel:', msg);
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(removeOrder(msg));
					const { address } = getState().loginAccount;
					if (msg.maker === address) {
						dispatch(convertTradeLogToTransaction('log_cancel', {
							[msg.market]: { [msg.outcome]: [msg] }
						}, msg.market));
						dispatch(updateAssets());
					}
				}
			},

			// new market: msg = { marketID }
			marketCreated: (msg) => {
				if (msg && msg.marketID) {
					console.debug('marketCreated:', msg);
					dispatch(loadMarketsInfo([msg.marketID]));
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('marketCreated', [msg]));
				}
			},

			// market trading fee updated (decrease only)
			tradingFeeUpdated: (msg) => {
				console.debug('tradingFeeUpdated:', msg);
				if (msg && msg.marketID) {
					dispatch(loadMarketsInfo([msg.marketID]));
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('tradingFeeUpdated', [msg]));
				}
			},

			deposit: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('deposit:', msg);
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('deposit', [msg]));
				}
			},

			withdraw: (msg) => {
				const { address } = getState().loginAccount;
				if (msg && msg.sender === address) {
					console.debug('withdraw:', msg);
					dispatch(updateAssets());
					dispatch(convertLogsToTransactions('withdraw', [msg]));
				}
			},

			// Reputation transfer
			Transfer: (msg) => {
				if (msg) {
					console.debug('Transfer:', msg);
				}
			},

			Approval: (msg) => {
				if (msg) {
					console.debug('Approval:', msg);
				}
			},

			closeMarket_logReturn: (msg) => {
				if (msg && msg.returnValue && parseInt(msg.returnValue, 16) === 1) {
					console.debug('closeMarket_logReturn:', msg);
					if (getState().loginAccount.address) dispatch(claimProceeds());
				}
			}
		}, filters => console.log('### Listening to filters:', filters));
	};
}
