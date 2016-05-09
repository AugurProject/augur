import * as AugurJS from '../../../services/augurjs';

import { loadBasicMarket } from '../../market/actions/load-basic-market';
import { loadPriceHistory } from '../../market/actions/load-price-history';
import { updateMarketsData } from '../../markets/actions/update-markets-data';

export function loadFullMarket() {
	return function(dispatch, getState) {
		var { isConnected, selectedMarketID, marketsData } = getState();

		if (!isConnected || !selectedMarketID) {
			return;
		}

		// if the basic data hasn't loaded yet, load it first
		if (!marketsData[selectedMarketID]) {
			loadBasicMarket(selectedMarketID, loadDetails);
		}

		// if the basic data is already loaded, just load the details
		else {
			loadDetails();
		}

		// load price history, and other non-basic market details here, dispatching the necessary actions to save each part in relevant state
		function loadDetails() {

		}
	};
}