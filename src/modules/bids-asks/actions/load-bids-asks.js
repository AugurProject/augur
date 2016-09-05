import { augur } from '../../../services/augurjs';
import { updateMarketOrderBook } from '../../bids-asks/actions/update-market-order-book';
import { selectMarket } from '../../market/selectors/market';

export function loadBidsAsks(marketID, cb) {
	return (dispatch, getState) => {
		const market = selectMarket(marketID);
		var scalarMinMax = {};
		if (market.type === 'scalar') {
			scalarMinMax.minValue = market.minValue;
			scalarMinMax.maxValue = market.maxValue;
		}
		augur.getOrderBook(marketID, scalarMinMax, (marketOrderBook) => {
			if (marketOrderBook == null || marketOrderBook.error != null) {
				console.error(`load-bids-asks.js: getOrderBook(${marketID}) error: %o`, marketOrderBook);
				if (cb) return cb(marketOrderBook);
				// todo: how do we handle failures in UI? retry ???
			} else {
				dispatch(updateMarketOrderBook(marketID, marketOrderBook));
				if (cb) cb(null, marketOrderBook);
			}
		});
	};
}
