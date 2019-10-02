import logError from 'utils/log-error';
import { BigNumber } from 'utils/create-big-number';
import { migrateThroughOneFork, migrateThroughOneForkEstimateGas } from 'modules/contracts/actions/contractCalls';

export const migrateMarketThroughOneFork = (
  marketId: string,
  payoutNumerators: BigNumber[],
  description = '',
  estimateGas = false,
  callback = logError
) => (dispatch, getState) => {
  console.log('in migrateThroughFork');
  if (estimateGas) {
    return migrateThroughOneForkEstimateGas(marketId, payoutNumerators, description);
  } else {
    return migrateThroughOneFork(marketId, payoutNumerators, description);
  }
};
