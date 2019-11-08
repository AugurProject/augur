import { createSelector } from "reselect";
import { selectGasPriceInfo } from "store/select-state";
import { createBigNumber } from "utils/create-big-number";
import store from "store";
import { GWEI_CONVERSION } from 'modules/common/constants';

export default function() {
  return getGasPrice(store.getState());
}

export const getGasPrice = createSelector(
  selectGasPriceInfo,
  gasPriceInfo => {
    const gweiValue = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
    return createBigNumber(gweiValue)
      .times(createBigNumber(GWEI_CONVERSION))
      .toNumber();
  }
);
