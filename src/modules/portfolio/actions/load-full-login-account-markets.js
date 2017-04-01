import reselectMarkets from 'modules/markets/selectors/markets-all';
import { loadFullMarket } from 'modules/market/actions/load-full-market';
import { loadMarketCreatorFees } from 'modules/my-markets/actions/load-market-creator-fees';

export const loadFullLoginAccountMarkets = () => (dispatch, getState) => {
  const { address } = getState().loginAccount;
  reselectMarkets().filter(market => market.author === address).forEach((market) => {
    const marketID = market.id;
    dispatch(loadFullMarket(marketID));
    dispatch(loadMarketCreatorFees(marketID));
  });
};
