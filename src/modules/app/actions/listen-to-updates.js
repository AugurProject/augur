import { augur, abi } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { syncBlockchain } from '../../app/actions/update-blockchain';
import { syncBranch } from '../../app/actions/update-branch';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { updateOutcomePrice } from '../../markets/actions/update-outcome-price';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';

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
				// console.log('block:', blockHash);
				dispatch(updateAssets());
				dispatch(syncBlockchain());
				dispatch(syncBranch());
			},

			// trade filled: { market, outcome (id), price }
			log_fill_tx: (msg) => {
				// console.debug('log_fill_tx:', JSON.stringify(msg, null, 2));
				if (msg && msg.market && msg.price && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
					dispatch(refreshMarket(msg.market));
				}
			},

			// short sell filled
			log_short_fill_tx: (msg) => {
				// console.debug('log_short_fill_tx:', JSON.stringify(msg, null, 2));
				if (msg && msg.market && msg.price && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
					dispatch(refreshMarket(msg.market));
				}
			},

			// order added to orderbook
			log_add_tx: (msg) => {
				// console.debug('log_add_tx:', JSON.stringify(msg, null, 2));
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(loadBidsAsks(msg.market));
				}
			},

			// order removed from orderbook
			log_cancel: (msg) => {
				// console.debug('log_cancel:', JSON.stringify(msg, null, 2));
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(loadBidsAsks(msg.market));
				}
			},

			// new market: msg = { marketID }
			marketCreated: (msg) => {
				// console.debug('marketCreated:', JSON.stringify(msg, null, 2));
				if (msg && msg.marketID) {
					dispatch(loadMarketsInfo([msg.marketID]));
				}
			},

			// market trading fee updated (decrease only)
			tradingFeeUpdated: (msg) => {
				console.debug('tradingFeeUpdated:', msg);
				if (msg && msg.marketID) {
					dispatch(loadMarketsInfo([msg.marketID]));
				}
			},

			deposit: (msg) => {
				if (msg) {
					console.debug('deposit:', msg);
					dispatch(updateAssets());
				}
			},

			withdraw: (msg) => {
				if (msg) {
					console.debug('withdraw:', msg);
					dispatch(updateAssets());
				}
			},

			// Reporter penalization (debugging-only)
			penalize: (msg) => {
				if (msg) {
					console.debug('penalize:', msg);
					dispatch(updateAssets());
				}
			},

			// Reputation transfer
			Transfer: (msg) => {
				if (msg) {
					console.debug('Transfer:', msg);
					dispatch(updateAssets());
				}
			},

			Approval: (msg) => {
				if (msg) {
					console.debug('Approval:', msg);
					dispatch(updateAssets());
				}
			}
		}, (filters) => console.log('### Listening to filters:', filters));
	};
}
