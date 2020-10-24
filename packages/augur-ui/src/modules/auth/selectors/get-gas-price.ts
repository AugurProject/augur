import { createSelector } from "reselect";
import { selectGasPriceInfo, selectEnvState } from "appStore/select-state";
import { createBigNumber } from "utils/create-big-number";
import store from "appStore";
import { GWEI_CONVERSION, USE_ETH_RESERVE, NOT_USE_ETH_RESERVE } from 'modules/common/constants';
import { selectLoginAccount } from "./login-account";

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

export const getTransactionLabel = createSelector(
  selectLoginAccount,
  selectEnvState,
  (loginAccount, env) => {
    return NOT_USE_ETH_RESERVE;
  }
)
