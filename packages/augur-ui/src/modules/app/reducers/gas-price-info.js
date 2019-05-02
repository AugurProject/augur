import { UPDATE_GAS_INFO } from "modules/app/actions/update-gas-price-info";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { formatGasCost } from "utils/format-number";
import { createBigNumber } from "utils/create-big-number";

const GWEI_CONVERSION = 1000000000;
const gasPrice = 20000000000; // default value
const inGwei = createBigNumber(gasPrice).dividedBy(
  createBigNumber(GWEI_CONVERSION)
);
const DEFAULT_STATE = {
  average: formatGasCost(inGwei).value,
  fast: formatGasCost(inGwei).value,
  safeLow: formatGasCost(inGwei).value
};

export default function(gasPriceInfo = DEFAULT_STATE, { type, data }) {
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
