import { createSelector } from "reselect";
import { selectGasPriceInfo } from "src/select-state";
import { augur } from "services/augurjs";
import { createBigNumber } from "utils/create-big-number";

const GWEI_CONVERSION = 1000000000;

const getGasPriceSelector = () =>
  createSelector(selectGasPriceInfo, gasPriceInfo => {
    const gweiValue = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
    let weiValue = augur.rpc.getGasPrice();

    if (gweiValue) {
      weiValue = createBigNumber(gweiValue)
        .times(createBigNumber(GWEI_CONVERSION))
        .toNumber();
    }
    return weiValue;
  });

export const getGasPrice = getGasPriceSelector();
