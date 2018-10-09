import { createSelector } from "reselect";
import { selectGasPriceInfo } from "src/select-state";
import { augur } from "services/augurjs";
import { createBigNumber } from "utils/create-big-number";
import store from "src/store";

const GWEI_CONVERSION = 1000000000;

export default function() {
  return getGasPrice(store.getState());
}

export const getGasPrice = createSelector(selectGasPriceInfo, gasPriceInfo => {
  const gweiValue = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  let weiValue = augur.rpc.getGasPrice();

  if (gweiValue) {
    weiValue = createBigNumber(gweiValue)
      .times(createBigNumber(GWEI_CONVERSION))
      .toNumber();
  }
  return weiValue;
});
