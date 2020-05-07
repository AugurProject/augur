import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { Getters } from '@augurproject/sdk';
import { useMarketsStore, Markets } from 'modules/markets/store/markets';

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
  let params = loginAccount.address
    ? { marketId, account: loginAccount.address, expirationCutoffSeconds }
    : { marketId };
  const Augur = augurSdk.get();
  const marketOrderBook = await Augur.getMarketOrderBook(params);
  Markets.actions.updateOrderBook(marketId, marketOrderBook);
  callback(null, marketOrderBook);
};
