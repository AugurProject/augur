import { augur } from "services/augurjs";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

export const registerUserDefinedGasPriceFunction = () => (
  dispatch: Function,
  getState: Function
) => {
  // TODO: how to set gasPrice in ethers
  augur.getGasPrice = (callback: Function) => {
    callback(getGasPrice(getState()));
  };
};
