import type { Getters } from '@augurproject/sdk';
import { AppState } from 'appStore';
import { NodeStyleCallback } from 'modules/types';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import logError from 'utils/log-error';
import { BIDS } from 'modules/common/constants';

export const UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK';
export const CLEAR_ORDER_BOOK = 'CLEAR_ORDER_BOOK';
export const UPDATE_INVALID_BIDS = 'UPDATE_INVALID_BIDS';

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

export const updateMarketInvalidBids = (
  marketId: string,
  orderBook: Getters.Markets.MarketOrderBook
) => ({
  type: UPDATE_INVALID_BIDS,
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
  const params = loginAccount.address
    ? { account: loginAccount.address, expirationCutoffSeconds }
    : { };
  const Augur = augurSdk.get();
  const marketOrderBook = await Augur.getMarketOrderBook({ ...params, marketId, ignoreCrossOrders: true });
  dispatch(updateOrderBook(marketId, marketOrderBook));
  callback(null, marketOrderBook);
};

export const getBestInvalidBid = (marketId, orderBooks) => {
  const marketOrderbook = orderBooks[marketId];
  if (!marketOrderbook || !marketOrderbook.orderBook) return null;
  const invalidOutcome = marketOrderbook.orderBook[0];
  if (!invalidOutcome) return null;
  const bids = invalidOutcome[BIDS];
  if (!bids || bids.length === 0) return null;
  return bids[0].price
};
