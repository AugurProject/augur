import { augur, abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { updateAssets } from '../../auth/actions/update-assets';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { updateOutcomePrice } from '../../markets/actions/update-outcome-price';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';

export function loadActiveMarketBidsAsks(marketID, outcomeID) {
	return (dispatch, getState) => {
		augur.getParticipantSharesPurchased(marketID, getState().loginAccount.id, outcomeID, (position) => {
			if (!position || position.error) return console.error('loadActiveMarketBidsAsks:', position);
			if (abi.bignum(position).gt(ZERO)) dispatch(loadBidsAsks(marketID));
		});
	};
}

export function listenToUpdates() {
	return (dispatch, getState) => {
		augur.filters.listen({

			// block arrivals
			block: (blockHash) => {
				dispatch(updateAssets());
				dispatch(updateBlockchain());
			},

			// trade filled: { market, outcome (id), price }
			log_fill_tx: (msg) => {
				if (augur.options.debug.trading) {
					console.debug('log_fill_tx:', JSON.stringify(msg, null, 2));
				}
				if (msg && msg.market && msg.price && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, abi.bignum(msg.price)));
					dispatch(loadActiveMarketBidsAsks(msg.market, msg.outcome));
				}
			},

			// order added to orderbook
			log_add_tx: (msg) => {
				// exclude own? if (msg.sender !== getState().loginAccount.id)
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(loadActiveMarketBidsAsks(msg.market, msg.outcome));
				}
			},

			// order removed from orderbook
			log_cancel: (msg) => {
				// exclude own? if (msg.sender !== getState().loginAccount.id)
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(loadActiveMarketBidsAsks(msg.market, msg.outcome));
				}
			},

			// new market: msg = { marketID }
			marketCreated: (msg) => {
				if (msg && msg.marketID) {
					dispatch(loadMarketsInfo([msg.marketID]));
				}
			},

			// market trading fee updated (decrease only)
			tradingFeeUpdated: (msg) => {
				if (msg) console.log('tradingFeeUpdated:', msg);
				if (msg && msg.marketID) {
					dispatch(loadMarketsInfo([msg.marketID]));
				}
			},

			deposit: (msg) => {
				if (msg) console.log('deposit:', msg);
			},

			withdraw: (msg) => {
				if (msg) console.log('withdraw:', msg);
			},

			// // Reporter penalization (debugging-only?)
			// penalize: (msg) => {
			// 	console.debug('penalize:', msg);
			// 	// dispatch(updateAssets());
			// },

			// // Reputation transfer
			// Transfer: (msg) => {
			// 	console.debug('Transfer:', msg);
			// 	// dispatch(updateAssets());
			// },

			// Approval: (msg) => {
			// 	console.debug('Approval:', msg);
			// 	// dispatch(updateAssets());
			// }
		}, (filters) => console.log('### Listening to filters:', filters));
	};
}
