import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'store';
import { Getters } from '@augurproject/sdk';

export const UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK';
export const CLEAR_ORDER_BOOK = 'CLEAR_ORDER_BOOK';

export const updateOrderBook = (
  marketId: string,
  orderBook: Getters.Markets.MarketOrderBook
) => ({
  type: UPDATE_ORDER_BOOK,
  data: {
    marketId,
    orderBook,
  },
});

export const clearOrderBook = () => ({
  type: CLEAR_ORDER_BOOK,
});

export const loadMarketOrderBook = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (marketId == null) {
    return callback('must specify market ID');
  }
  const { loginAccount } = getState();
  const augur = augurSdk.get();
  const expirationCutoffSeconds = await augur.getGasConfirmEstimate();
  console.log('expirationCutoffSeconds', expirationCutoffSeconds)
  let params = loginAccount.address
    ? { marketId, account: loginAccount.address, expirationCutoffSeconds }
    : { marketId };
  const Augur = augurSdk.get();
  const marketOrderBook = await Augur.getMarketOrderBook(params);
  dispatch(updateOrderBook(marketId, marketOrderBook));
  callback(null, marketOrderBook);
};
