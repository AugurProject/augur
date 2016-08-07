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
				console.debug('block:', blockHash);
				dispatch(updateAssets());
				dispatch(updateBlockchain());
			},

			// trade filled: { marketId, outcome (id), price }
			log_fill_tx: (msg) => {
				console.debug('log_fill_tx:', msg);
				if (msg && msg.marketId && msg.outcome && msg.price) {
					dispatch(updateOutcomePrice(msg.marketId, msg.outcome, parseFloat(msg.price)));
				}
			},

			// order added to orderbook
			log_add_tx: (msg) => {
				console.debug('log_fill_tx:', msg);
				// dispatch(loadMarketsInfo(msg.marketId));
			},

			// order removed from orderbook
			log_cancel: (msg) => {
				console.debug('log_cancel:', msg);
				// dispatch(loadMarketsInfo(msg.marketId));
			},

			// new market: msg = { marketId }
			marketCreated: (msg) => {
				console.debug('marketCreated:', msg);
				if (msg && msg.marketId) {
					dispatch(loadMarketsInfo(msg.marketId));
				}
			},

			// market trading fee updated (decrease only)
			tradingFeeUpdated: (msg) => {
				console.debug('tradingFeeUpdated:', msg);
				// dispatch(loadMarketsInfo(msg.marketId));
			},

			// Reporter penalization (debugging-only?)
			penalize: (msg) => {
				console.debug('penalize:', msg);
				// dispatch(updateAssets());
			},

			// Reputation transfer
			Transfer: (msg) => {
				console.debug('Transfer:', msg);
				// dispatch(updateAssets());
			},

			Approval: (msg) => {
				console.debug('Approval:', msg);
				// dispatch(updateAssets());
			}
		}, (filters) => console.log('### Listening to filters:', filters));
	};
}
