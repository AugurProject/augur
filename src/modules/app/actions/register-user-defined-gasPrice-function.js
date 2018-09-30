import { augur } from "services/augurjs";
import { createBigNumber } from "utils/create-big-number";

export const registerUserDefinedGasPriceFunction = () => (
  dispatch,
  getState
) => {
  const { gasPriceInfo } = getState();
  const GWEI_CONVERSION = 1000000000;

  const userDefinedGasPriceFunction = callback => {
    const gweiValue = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
    let weiValue = augur.rpc.getGasPrice();

    if (gweiValue) {
      weiValue = createBigNumber(gweiValue)
        .times(createBigNumber(GWEI_CONVERSION))
        .toNumber();
    }
    callback(weiValue);
  };

  augur.setGasPriceFunction(userDefinedGasPriceFunction);
};
