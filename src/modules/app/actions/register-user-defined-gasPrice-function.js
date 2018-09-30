import { augur } from "services/augurjs";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

export const registerUserDefinedGasPriceFunction = () => (
  dispatch,
  getState
) => {
  const userDefinedGasPriceFunction = callback =>
    callback(getGasPrice(getState()));

  augur.setGasPriceFunction(userDefinedGasPriceFunction);
};
