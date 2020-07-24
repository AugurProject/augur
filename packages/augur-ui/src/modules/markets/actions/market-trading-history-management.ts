import logError from 'utils/log-error';
import {
  NodeStyleCallback,
} from 'modules/types';
import { augurSdk } from 'services/augursdk';

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

export const bulkLoadMarketTradingHistory = async(
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError
) => {
  if (!marketIds || marketIds.length === 0) return callback(null);
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingHistory({ marketIds });
  if (tradingHistory == null) return callback(null);
  callback(null, tradingHistory);
  return {keyedMarketTradingHistory: tradingHistory}
};
