export const UPDATE_GAS_INFO = "UPDATE_GAS_INFO";

interface GasPriceInfo {
  average: number;
  fast: number;
  slow: number;
}

export const updateGasPriceInfo = (gasPriceInfo: GasPriceInfo) => ({
  type: UPDATE_GAS_INFO,
  data: { gasPriceInfo }
});
