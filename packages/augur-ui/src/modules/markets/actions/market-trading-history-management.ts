import logError from 'utils/log-error';
import {
  NodeStyleCallback,
} from 'modules/types';
import { augurSdk } from 'services/augursdk';

export const UPDATE_USER_FILLED_ORDERS = 'UPDATE_USER_FILLED_ORDERS';
export const REFRESH_USER_OPEN_ORDERS = 'REFRESH_USER_OPEN_ORDERS';

export const loadMarketTradingHistory = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => async () => {
  if (!marketId) return callback(null);
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingHistory({ marketIds: [marketId] });
  if (tradingHistory == null) return callback(null);
  callback(null, tradingHistory);
  return {keyedMarketTradingHistory: tradingHistory}
};

