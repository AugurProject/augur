import { loadFullMarket, MARKET_DATA_LOADING } from 'modules/market/actions/load-full-market';

import getValue from 'utils/get-value';

export function loadFullMarketsWithPositions(data) {
  return (dispatch, getState) => {
    console.log('## loadFullMarketsWithPositions -- ', data);
    const { requests } = getState();
    Object.keys(data).forEach((marketID) => {
      const isMarketLoading = getValue(requests, `${MARKET_DATA_LOADING}.${marketID}`);
      if (!isMarketLoading) dispatch(loadFullMarket(marketID));
    });
  };
}
