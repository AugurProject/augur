import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { augurSdk } from 'services/augursdk';
import { AppStatus } from 'modules/app/store/app-status';

export const loadMarketOrderBook = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => async () => {
  if (marketId == null) {
    return callback('must specify market ID');
  }
  const augur = augurSdk.get();
  const { loginAccount: { address: account } } = AppStatus.get();
  const expirationCutoffSeconds = await augur.getGasConfirmEstimate();
  let params = account
    ? { marketId, account, expirationCutoffSeconds, ignoreCrossOrders: true }
    : { marketId, ignoreCrossOrders: true };
  const orderBook = await augur.getMarketOrderBook(params);
  callback(null, orderBook);
  return { orderBook };
};
