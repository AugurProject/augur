import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { DataCallback } from "modules/types";
import { AppState } from "store";

export const registerUserDefinedGasPriceFunction = () => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  // TODO: how to set gasPrice in ethers
  /*
  augur.getGasPrice = (callback: DataCallback) => {
    callback(getGasPrice(getState()));
  };
  */
};
