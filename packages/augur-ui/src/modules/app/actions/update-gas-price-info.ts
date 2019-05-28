import { GasPriceInfo } from "modules/types";

export const UPDATE_GAS_INFO = "UPDATE_GAS_INFO";

export const updateGasPriceInfo = (gasPriceInfo: GasPriceInfo) => ({
  type: UPDATE_GAS_INFO,
  data: { gasPriceInfo }
});
