import { UPDATE_GAS_INFO } from 'modules/app/actions/update-gas-price-info';
import { RESET_STATE } from 'modules/app/actions/reset-state';
import { formatGasCostGwei } from 'utils/format-number';
import { BaseAction, GasPriceInfo } from 'modules/types';
import {
  DEFAULT_FALLBACK_GAS_AVERAGE,
  DEFAULT_FALLBACK_GAS_FAST,
  DEFAULT_FALLBACK_GAS_SAFELOW,
} from 'modules/common/constants';

const DEFAULT_STATE: GasPriceInfo = {
  userDefinedGasPrice: null,
  average: formatGasCostGwei(DEFAULT_FALLBACK_GAS_AVERAGE, {}).value,
  fast: formatGasCostGwei(DEFAULT_FALLBACK_GAS_FAST, {}).value,
  safeLow: formatGasCostGwei(DEFAULT_FALLBACK_GAS_SAFELOW, {}).value,
};

export default function(
  gasPriceInfo: GasPriceInfo = DEFAULT_STATE,
  { type, data }: BaseAction
): GasPriceInfo {
  switch (type) {
    case UPDATE_GAS_INFO:
      return {
        ...gasPriceInfo,
        ...data.gasPriceInfo,
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return gasPriceInfo;
  }
}
