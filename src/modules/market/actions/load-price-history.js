import { augur } from '../../../services/augurjs';
import { updateMarketPriceHistory } from '../../market/actions/update-market-price-history';
import { updateMarketTradesData } from '../../portfolio/actions/update-market-trades-data';

export const loadPriceHistory = marketID => dispatch => (
  augur.getMarketPriceHistory(marketID, (err, priceHistory) => {
    if (err) return console.error('loadPriceHistory', err);
    // TODO check if these data stores are redundant (remove one of them if so)
    dispatch(updateMarketTradesData({ [marketID]: priceHistory }));
    dispatch(updateMarketPriceHistory(marketID, priceHistory));
  })
);
