import logError from 'utils/log-error';
import { NodeStyleCallback } from 'modules/types';
import { createMarketEstimateGas } from 'modules/contracts/actions/contractCalls';
import { NEW_MARKET_GAS_ESTIMATE } from 'modules/common/constants';

export const estimateSubmitNewMarket = async (
  newMarket: any,
  callback: NodeStyleCallback = logError
) => {
  try {
    const gasLimit = await createMarketEstimateGas(newMarket, false);
    callback(null, gasLimit);
  }
  catch (error) {
    console.error('error could estimate gas', error);
    return NEW_MARKET_GAS_ESTIMATE;
  }
};
