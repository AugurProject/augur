export const UPDATE_GAS_INFO = "UPDATE_GAS_INFO";

export const updateGasPriceInfo = gasPriceInfo => ({
  type: UPDATE_GAS_INFO,
  data: { gasPriceInfo }
});
