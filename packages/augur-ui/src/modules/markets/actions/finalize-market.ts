import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { finalizeMarket } from 'modules/contracts/actions/contractCalls';

export const sendFinalizeMarket = (
  marketId,
  callback: NodeStyleCallback = logError
) => {
  if (!marketId) return;
  finalizeMarket(marketId);
  if (callback) callback(null);
};
