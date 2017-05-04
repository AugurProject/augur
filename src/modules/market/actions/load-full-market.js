import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { loadBidsAsks } from 'modules/bids-asks/actions/load-bids-asks';
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades';
import { loadPriceHistory } from 'modules/market/actions/load-price-history';
import { updateMarketDataLoading } from 'modules/app/actions/update-market-data-loading';

export const loadFullMarket = marketID => (dispatch, getState) => {
  dispatch(updateMarketDataLoading(marketID, true));

  // if the basic data is already loaded, just load the details
  if (getState().marketsData[marketID]) {
    return dispatch(loadMarketDetails(marketID));
  }

  // if the basic data hasn't loaded yet, load it first
  dispatch(loadMarketsInfo([marketID], () => dispatch(loadMarketDetails(marketID))));
};

// load price history, and other non-basic market details here, dispatching
// the necessary actions to save each part in relevant state
export const loadMarketDetails = marketID => dispatch => (
  dispatch(loadBidsAsks(marketID, () => (
    dispatch(loadAccountTrades({ market: marketID }, () => (
      dispatch(loadPriceHistory(marketID, () => (
        dispatch(updateMarketDataLoading(marketID, false))
      )))
    )))
  )))
);
