export const UPDATE_GAS_INFO = "UPDATE_GAS_INFO";

export const updateGasInfo = gasInfo => ({
  type: UPDATE_GAS_INFO,
  data: { gasInfo }
});
