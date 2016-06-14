import * as AugurJS from '../../../services/augurjs';
import { updateMarketOrderBook } from "./update-market-order-book";

export function loadBidsAsks(marketID) {
	return (dispatch, getState) => {
		AugurJS.getOrderBook(marketID, (marketOrderBook) => {
			if (marketOrderBook == null || marketOrderBook.error != null) {
				return console.error(`load-bids-asks.js: getOrderBook(${marketID}) error: %o`, marketOrderBook);
				// todo: how do we handle failures in UI? retry ???
			}
			dispatch(updateMarketOrderBook(marketID, marketOrderBook));
		});
	};
}

// export function xxxloadBidsAsks(marketID) {
// 	return (dispatch, getState) => {
// 		const s = getState();
// 		const outcomeKeys = Object.keys(s.outcomes[marketID]);
//
// 		function randomInt(min, max) {
// 			return Math.floor(Math.random() * (max - min + 1)) + min;
// 		}
//
// 		function makeBidAsk() {
// 			return {
// 				id: Math.random(),
// 				marketID,
// 				outcomeID: outcomeKeys[randomInt(0, outcomeKeys.length - 1)],
// 				accountID: Math.random(),
// 				action: Math.random() >= 0.7 && 'placed' || 'canceled',
// 				bidOrAsk: Math.random() >= 0.7 && BID || ASK,
// 				numShares: Math.round(Math.random() * 10000) / 100,
// 				limitPrice: Math.round(Math.random() * 100) / 100,
// 			};
// 		}
//
// 		function makeBunch(num) {
// 			const o = {};
// 			for (let i = 0; i < num; i++) {
// 				o[Math.random()] = makeBidAsk();
// 			}
// 			return o;
// 		}
//
// 		function makeTimedBunch(num = randomInt(1, 10), millis = randomInt(500, 10000)) {
// 			// num = num || ;
// 			// millis = millis || ;
//
// 			setTimeout(() => {
// 				dispatch(updateBidsAsks(makeBunch(num)));
// 				// makeTimedBunch();
// 			}, millis);
// 		}
//
// 		if (!s.bidsAsks[marketID]) {
// 			makeTimedBunch(15, 1000);
// 			makeTimedBunch(5, 5000);
// 			makeTimedBunch(5, 10000);
// 			makeTimedBunch(5, 15000);
// 			makeTimedBunch(5, 20000);
// 		}
// 	};
// }
