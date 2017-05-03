import { augur } from 'services/augurjs';
import { updateMarketPriceHistory } from 'modules/market/actions/update-market-price-history';
import { updateMarketTradesData } from 'modules/portfolio/actions/update-market-trades-data';

export const loadPriceHistory = (marketID, cb) => (dispatch, getState) => (
  augur.getMarketPriceHistory(marketID, { fromBlock: getState().marketsData[marketID].creationBlock }, (err, priceHistory) => {
    cb && cb();

    if (err) return console.error('loadPriceHistory', err);

    // TODO check if these data stores are redundant (remove one of them if so)
    dispatch(updateMarketTradesData({ [marketID]: priceHistory }));
    dispatch(updateMarketPriceHistory(marketID, priceHistory));
  })
);
