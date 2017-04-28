import { augur } from '../../../services/augurjs';
import { updateMarketPriceHistory } from '../../market/actions/update-market-price-history';
import { updateMarketTradesData } from '../../portfolio/actions/update-market-trades-data';

export const loadPriceHistory = (marketID, callback) => (dispatch, getState) => (
  augur.logs.getMarketPriceHistory({
    market: marketID,
    filter: { fromBlock: getState().marketsData[marketID].creationBlock }
  }, (err, priceHistory) => {
    if (callback) callback();
    if (err) return console.error('loadPriceHistory', err);

    // TODO check if these data stores are redundant (remove one of them if so)
    dispatch(updateMarketTradesData({ [marketID]: priceHistory }));
    dispatch(updateMarketPriceHistory(marketID, priceHistory));
  })
);
