import { UPDATE_GAS_INFO } from "modules/app/actions/update-gas-price-info";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { formatGasCost } from "utils/format-number";
import { createBigNumber } from "utils/create-big-number";
import { BaseAction, GasPriceInfo } from "modules/types";
import { GWEI_CONVERSION } from 'modules/common/constants';

const gasPrice = 20000000000; // default value
const inGwei = createBigNumber(gasPrice).dividedBy(
  createBigNumber(GWEI_CONVERSION)
);

const DEFAULT_STATE: GasPriceInfo = {
  blockNumber: '0',
  userDefinedGasPrice: '',
  average: formatGasCost(inGwei, {}).value,
  fast: formatGasCost(inGwei, {}).value,
  safeLow: formatGasCost(inGwei, {}).value
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
