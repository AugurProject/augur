import logError from 'utils/log-error';
import { formatGasCostToEther } from 'utils/format-number';
import { closeModal } from 'modules/modal/actions/close-modal';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';

export const migrateMarketThroughOneFork = (
  marketId,
  estimateGas = false,
  callback = logError
) => (dispatch, getState) => {
  // TBD
  console.log('in migrateThroughFork');
};
