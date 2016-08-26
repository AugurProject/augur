import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { updateOutcomePrice } from '../../markets/actions/update-outcome-price';

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
				// console.log('log_fill_tx:', msg);
				if (msg && msg.market && msg.outcome && msg.price) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, parseFloat(msg.price)));
				}
			},

			// order added to orderbook
			log_add_tx: (msg) => {
				if (msg && msg.market) {
					dispatch(loadMarketsInfo([msg.market]));
				}
			},

			// order removed from orderbook
			log_cancel: (msg) => {
				if (msg && msg.market) {
					dispatch(loadMarketsInfo([msg.market]));
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
