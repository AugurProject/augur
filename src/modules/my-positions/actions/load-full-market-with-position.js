import { MARKET_DATA_LOADING } from 'modules/app/actions/update-market-data-loading';

import { loadFullMarket } from 'modules/market/actions/load-full-market';

import getValue from 'utils/get-value';

export function loadFullMarketWithPosition(marketID) {
  return (dispatch, getState) => {
    const { requests } = getState();
    const isMarketLoading = getValue(requests, `${MARKET_DATA_LOADING}.${marketID}`);
    if (!isMarketLoading) dispatch(loadFullMarket(marketID));
  };
}
