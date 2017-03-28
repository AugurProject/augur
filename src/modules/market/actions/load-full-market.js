import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { loadBidsAsks } from 'modules/bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades';
import { loadPriceHistory } from 'modules/market/actions/load-price-history';

import { updateMarketDataLoading } from 'modules/app/actions/update-market-data-loading';

export function loadFullMarket(marketID) {
  return (dispatch, getState) => {
    dispatch(updateMarketDataLoading(marketID, true));

    // load price history, and other non-basic market details here, dispatching
    // the necessary actions to save each part in relevant state
    const loadDetails = () => {
      dispatch(loadBidsAsks(marketID, () => {
        dispatch(loadAccountTrades(marketID, () => {
          dispatch(loadPriceHistory(marketID, () => {
            dispatch(updateMarketDataLoading(marketID, false));
          }));
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
