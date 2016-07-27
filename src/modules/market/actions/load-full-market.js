import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { loadPriceHistory } from '../../market/actions/load-price-history';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';

export function loadFullMarket(marketId) {
	return (dispatch, getState) => {
		const { marketsData } = getState();
		// load price history, and other non-basic market details here, dispatching
		// the necessary actions to save each part in relevant state
		const loadDetails = () => {
			dispatch(loadPriceHistory(marketId));
			dispatch(loadBidsAsks(marketId));
		};

		// if the basic data hasn't loaded yet, load it first
		if (!marketsData[marketId]) {
			dispatch(loadMarketsInfo([marketId], loadDetails));
		} else {
		// if the basic data is already loaded, just load the details
			loadDetails();
		}
	};
}
