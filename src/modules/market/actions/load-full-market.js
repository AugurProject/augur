import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { loadPriceHistory } from '../../market/actions/load-price-history';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from '../../my-positions/actions/load-account-trades';
import { updateMarketDataTimestamp } from '../../market/actions/update-market-data-timestamp';

export const MARKET_DATA_LOADING = 'MARKET_DATA_LOADING';

export function loadFullMarket(marketID) {
	return (dispatch, getState) => {
		dispatch(updateMarketDataLoading(marketID));

		// load price history, and other non-basic market details here, dispatching
		// the necessary actions to save each part in relevant state
		const loadDetails = () => {
			dispatch(loadBidsAsks(marketID, () => {
				dispatch(loadAccountTrades(marketID, () => {
					dispatch(loadPriceHistory(marketID));
					dispatch(updateMarketDataTimestamp(marketID, new Date().getTime()));
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

/**
 * @param {String} marketID
 * @return {{type: String, marketID: String}}
 */
function updateMarketDataLoading(marketID) {
	return {
		type: MARKET_DATA_LOADING,
		marketID
	};
}
