import { augur, abi } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { syncBlockchain } from '../../app/actions/update-blockchain';
import { syncBranch } from '../../app/actions/update-branch';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { updateOutcomePrice } from '../../markets/actions/update-outcome-price';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';
import { claimProceeds } from '../../my-positions/actions/claim-proceeds';
import { updateLogsData } from '../../transactions/actions/convert-logs-to-transactions';

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
				if (msg) {
					console.debug('collectedFees:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('collectedFees', [msg]));
				}
			},

			payout: (msg) => {
				if (msg) {
					console.debug('payout:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('payout', [msg]));
				}
			},

			penalizationCaughtUp: (msg) => {
				if (msg) {
					console.debug('penalizationCaughtUp:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('penalizationCaughtUp', [msg]));
				}
			},

			// Reporter penalization
			penalize: (msg) => {
				if (msg) {
					console.debug('penalize:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('penalize', [msg]));
				}
			},

			submittedReport: (msg) => {
				if (msg) {
					console.debug('submittedReport:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('submittedReport', [msg]));
				}
			},

			submittedReportHash: (msg) => {
				if (msg) {
					console.debug('submittedReportHash:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('submittedReportHash', [msg]));
				}
			},

			registration: (msg) => {
				if (msg) {
					console.debug('registration:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('registration', [msg]));
				}
			},

			// trade filled: { market, outcome (id), price }
			log_fill_tx: (msg) => {
				console.debug('log_fill_tx:', msg);
				if (msg && msg.market && msg.price && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
					dispatch(refreshMarket(msg.market));
				}
			},

			// short sell filled
			log_short_fill_tx: (msg) => {
				console.debug('log_short_fill_tx:', msg);
				if (msg && msg.market && msg.price && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
					dispatch(refreshMarket(msg.market));
				}
			},

			// order added to orderbook
			log_add_tx: (msg) => {
				console.debug('log_add_tx:', msg);
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(loadBidsAsks(msg.market));
				}
			},

			// order removed from orderbook
			log_cancel: (msg) => {
				console.debug('log_cancel:', msg);
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(loadBidsAsks(msg.market));
				}
			},

			// new market: msg = { marketID }
			marketCreated: (msg) => {
				if (msg && msg.marketID) {
					console.debug('marketCreated:', msg);
					dispatch(loadMarketsInfo([msg.marketID]));
					dispatch(updateAssets());
					dispatch(updateLogsData('marketCreated', [msg]));
				}
			},

			// market trading fee updated (decrease only)
			tradingFeeUpdated: (msg) => {
				console.debug('tradingFeeUpdated:', msg);
				if (msg && msg.marketID) {
					dispatch(loadMarketsInfo([msg.marketID]));
					dispatch(updateAssets());
					dispatch(updateLogsData('tradingFeeUpdated', [msg]));
				}
			},

			deposit: (msg) => {
				if (msg) {
					console.debug('deposit:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('deposit', [msg]));
				}
			},

			withdraw: (msg) => {
				if (msg) {
					console.debug('withdraw:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('withdraw', [msg]));
				}
			},

			// Reputation transfer
			Transfer: (msg) => {
				if (msg) {
					console.debug('Transfer:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('Transfer', [msg]));
				}
			},

			Approval: (msg) => {
				if (msg) {
					console.debug('Approval:', msg);
					dispatch(updateAssets());
					dispatch(updateLogsData('Approval', [msg]));
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
