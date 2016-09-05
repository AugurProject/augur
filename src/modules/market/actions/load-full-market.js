import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { loadPriceHistory } from '../../market/actions/load-price-history';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadMarketTrades } from '../../portfolio/actions/load-market-trades';
import { sellCompleteSets } from '../../my-positions/actions/sell-complete-sets';

export function loadFullMarket(marketID) {
	return (dispatch, getState) => {
		// load price history, and other non-basic market details here, dispatching
		// the necessary actions to save each part in relevant state
		const loadDetails = () => {
			dispatch(loadPriceHistory(marketID));
			dispatch(loadBidsAsks(marketID));
			dispatch(loadMarketTrades(marketID));
			dispatch(sellCompleteSets(marketID));
		};

		// if the basic data hasn't loaded yet, load it first
		if (!getState().marketsData[marketID]) {
			dispatch(loadMarketsInfo([marketID], loadDetails));
		} else {
		// if the basic data is already loaded, just load the details
			loadDetails();
		}
	};
}
