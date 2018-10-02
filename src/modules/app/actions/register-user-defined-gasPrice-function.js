import { augur } from "services/augurjs";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

export const registerUserDefinedGasPriceFunction = () => (
  dispatch,
  getState
) => {
  augur.getGasPrice = callback => {
    callback(getGasPrice(getState()));
  };
};
