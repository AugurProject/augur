import { augurSdk } from 'services/augursdk';
import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';

export const getMarketLiquidityRanking = async (
  params,
  callback: NodeStyleCallback = logError
) => {
  const Augur = augurSdk.get();
  const MarketLiquidityRanking = await Augur.getMarketLiquidityRanking(params);

  callback(null, MarketLiquidityRanking);
};
