import { loadBasicMarket } from '../../market/actions/load-basic-market';
import { loadPriceHistory } from '../../market/actions/load-price-history';

export function loadFullMarket(marketId) {
	return function(dispatch, getState) {
		var { marketsData } = getState();

		// if the basic data hasn't loaded yet, load it first
		if (!marketsData[marketId]) {
			dispatch(loadBasicMarket(marketId, loadDetails));
		}

		// if the basic data is already loaded, just load the details
		else {
			loadDetails();
		}

		// load price history, and other non-basic market details here, dispatching the necessary actions to save each part in relevant state
		function loadDetails() {
			dispatch(loadPriceHistory(marketId));
		}
	};
}