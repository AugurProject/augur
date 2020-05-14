import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { AppState } from 'appStore';
import { Markets } from 'modules/markets/store/markets';
import { AppStatus } from 'modules/app/store/app-status';

export const loadMarketOrderBook = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => async () => {
  if (marketId == null) {
    return callback('must specify market ID');
  }
  const { loginAccount: { address: account } } = AppStatus.get();
  const augur = augurSdk.get();
  const expirationCutoffSeconds = await augur.getGasConfirmEstimate();
  let params = account
    ? { marketId, account, expirationCutoffSeconds }
    : { marketId };
  const Augur = augurSdk.get();
  const marketOrderBook = await Augur.getMarketOrderBook(params);
  callback(null, marketOrderBook);
  return {orderBook: marketOrderBook};
};
