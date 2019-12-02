import { UPDATE_GAS_INFO } from 'modules/app/actions/update-gas-price-info';
import { RESET_STATE } from 'modules/app/actions/reset-state';
import { formatGasCost } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import { BaseAction, GasPriceInfo } from 'modules/types';
import { GWEI_CONVERSION } from 'modules/common/constants';

const gasPriceSafeLow = 1000000000; // default value safeLow
const gasPriceAverage = 2000000000; // default value average
const gasPriceFast = 20000000000; // default value fast

const inGwei = (gasPrice) => {
  return createBigNumber(gasPrice).dividedBy(
    createBigNumber(GWEI_CONVERSION)
  );
}

const DEFAULT_STATE: GasPriceInfo = {
  userDefinedGasPrice: null,
  average: formatGasCost(inGwei(gasPriceAverage), {}).value,
  fast: formatGasCost(inGwei(gasPriceFast), {}).value,
  safeLow: formatGasCost(inGwei(gasPriceSafeLow), {}).value
};

export default function(gasPriceInfo: GasPriceInfo = DEFAULT_STATE, { type, data }: BaseAction): GasPriceInfo {
  switch (type) {
    case UPDATE_GAS_INFO:
      return {
        ...gasPriceInfo,
        ...data.gasPriceInfo
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return gasPriceInfo;
  }
}
