import { augur } from '../../../services/augurjs';
import { clearMarketOrderBook, updateMarketOrderBook } from '../../bids-asks/actions/update-market-order-book';
import { selectMarket } from '../../market/selectors/market';

export function loadBidsAsks(marketID, cb) {
	return (dispatch, getState) => {
		const market = selectMarket(marketID);
		const scalarMinMax = {};
		if (market.type === 'scalar') {
			scalarMinMax.minValue = market.minValue;
			scalarMinMax.maxValue = market.maxValue;
		}
		augur.get_total_trades(marketID, (totalTrades) => {
			if (!totalTrades || totalTrades.error || !parseInt(totalTrades, 10)) {
				if (cb) cb(totalTrades);
			} else {
				getOrderBookChunked(marketID, 0, Math.min(parseInt(totalTrades, 10), 100), scalarMinMax, totalTrades, cb, dispatch);
			}
		});
	};
}

function getOrderBookChunked(marketID, offset, numTradesToLoad, scalarMinMax, totalTrades, callback, dispatch) {
	augur.getOrderBook({ market: marketID, offset, numTradesToLoad, scalarMinMax }, (marketOrderBook) => {
		if (marketOrderBook == null || marketOrderBook.error != null) {
			console.error(`load-bids-asks.js: getOrderBook(${marketID}) error: %o`, marketOrderBook);
			if (callback) return callback(marketOrderBook);
		} else {
			if (!offset) {
				dispatch(clearMarketOrderBook(marketID));
			}
			dispatch(updateMarketOrderBook(marketID, marketOrderBook));
			if (offset + numTradesToLoad < totalTrades) {
				return getOrderBookChunked(marketID, offset + numTradesToLoad, numTradesToLoad, scalarMinMax, totalTrades, callback, dispatch);
			}
			if (callback) callback(null, marketOrderBook);
		}
	});
}
