import { augur } from '../../../services/augurjs';
import { updateMarketDataTimestamp } from '../../market/actions/update-market-data-timestamp';
import { clearMarketOrderBook, updateMarketOrderBook } from '../../bids-asks/actions/update-market-order-book';
import { selectMarket } from '../../market/selectors/market';

const loadBidsAsksLock = {};

export function loadBidsAsks(marketID, cb) {
	return (dispatch, getState) => {
		if (!loadBidsAsksLock[marketID]) {
			loadBidsAsksLock[marketID] = true;
			const market = selectMarket(marketID);
			var scalarMinMax = {};
			if (market.type === 'scalar') {
				scalarMinMax.minValue = market.minValue;
				scalarMinMax.maxValue = market.maxValue;
			}
			augur.get_total_trades(marketID, (totalTrades) => {
				if (!totalTrades || totalTrades.error || !parseInt(totalTrades, 10)) {
					loadBidsAsksLock[marketID] = false;
					if (cb) cb(totalTrades);
				} else {
					getOrderBookChunked(marketID, 0, Math.min(parseInt(totalTrades, 10), 100), scalarMinMax, totalTrades, cb, dispatch);
				}
			});
		}
	};
}

function getOrderBookChunked(marketID, offset, numTradesToLoad, scalarMinMax, totalTrades, callback, dispatch) {
	augur.getOrderBook({ market: marketID, offset, numTradesToLoad, scalarMinMax }, (marketOrderBook) => {
		if (marketOrderBook == null || marketOrderBook.error != null) {
			console.error(`load-bids-asks.js: getOrderBook(${marketID}) error: %o`, marketOrderBook);
			loadBidsAsksLock[marketID] = false;
			if (callback) return callback(marketOrderBook);
		} else {
			if (!offset) {
				dispatch(clearMarketOrderBook(marketID));
			}

			dispatch(updateMarketOrderBook(marketID, marketOrderBook));
			dispatch(updateMarketDataTimestamp(marketID, new Date().getTime()));

			if (offset + numTradesToLoad < totalTrades) {
				return getOrderBookChunked(marketID, offset + numTradesToLoad, numTradesToLoad, scalarMinMax, totalTrades, callback, dispatch);
			}
			loadBidsAsksLock[marketID] = false;
			if (callback) callback(null, marketOrderBook);
		}
	});
}
