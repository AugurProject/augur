import { createBigNumber } from "utils/create-big-number";
import { GWEI_CONVERSION } from 'modules/common/constants';
import { AppStatusState } from "modules/app/store/app-status";

export default function() {
  const { gasPriceInfo } = AppStatusState.get();
  const gweiValue = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  return createBigNumber(gweiValue)
    .times(createBigNumber(GWEI_CONVERSION))
    .toNumber();
};
