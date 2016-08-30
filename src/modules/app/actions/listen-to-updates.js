import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { updateOutcomePrice } from '../../markets/actions/update-outcome-price';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { selectMarket } from '../../market/selectors/market';

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
				if (msg && msg.market && msg.price && msg.outcome !== undefined && msg.outcome !== null) {
					dispatch(updateOutcomePrice(msg.market, msg.outcome, parseFloat(msg.price)));
					console.log('log_fill_tx:', JSON.stringify(msg, null, 2));
					const market = selectMarket(msg.market);
					const outcomeIndex = msg.outcome - 1;
					if (market && market.outcomes && market.outcomes[outcomeIndex] && market.outcomes[outcomeIndex].orderBook) {
						console.log('loading bids/asks for market:', market);
						loadBidsAsks(msg.market);
					}
					console.log('market detail not loaded, skipping', market);
				}
			},

			// order added to orderbook
			log_add_tx: (msg) => {
				// exclude own? if (msg.sender !== getState().loginAccount.id)
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					console.log('log_add_tx:', JSON.stringify(msg, null, 2));
					const market = selectMarket(msg.market);
					const outcomeIndex = msg.outcome - 1;
					if (market && market.outcomes && market.outcomes[outcomeIndex] && market.outcomes[outcomeIndex].orderBook) {
						console.log('loading bids/asks for market:', market);
						loadBidsAsks(msg.market);
					}
					console.log('market detail not loaded, skipping', market);
				}
			},

			// order removed from orderbook
			log_cancel: (msg) => {
				// exclude own? if (msg.sender !== getState().loginAccount.id)
				if (msg && msg.market && msg.outcome !== undefined && msg.outcome !== null) {
					console.log('log_cancel:', JSON.stringify(msg, null, 2));
					const market = selectMarket(msg.market);
					const outcomeIndex = msg.outcome - 1;
					if (market && market.outcomes && market.outcomes[outcomeIndex] && market.outcomes[outcomeIndex].orderBook) {
						console.log('loading bids/asks for market:', market);
						loadBidsAsks(msg.market);
					}
					console.log('market detail not loaded, skipping', market);
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
