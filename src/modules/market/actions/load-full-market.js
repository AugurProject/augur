import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { loadPriceHistory } from '../../market/actions/load-price-history';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';

export function loadFullMarket(marketID) {
	return (dispatch, getState) => {
		// load price history, and other non-basic market details here, dispatching
		// the necessary actions to save each part in relevant state
		const loadDetails = () => {
			console.info('loadBidsAsks', marketID);
			dispatch(loadBidsAsks(marketID, () => {
				console.info('loadAccountTrades', marketID);
				dispatch(loadAccountTrades(marketID, false, () => {
					console.info('loadPriceHistory', marketID);
					dispatch(loadPriceHistory(marketID));
				}));
			}));
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
