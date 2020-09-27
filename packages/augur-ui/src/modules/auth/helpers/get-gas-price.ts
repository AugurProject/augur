import { createBigNumber } from 'utils/create-big-number';
import { GWEI_CONVERSION } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

export default function() {
  const { gasPriceInfo } = AppStatus.get();
  const gweiValue = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  return createBigNumber(gweiValue)
    .times(createBigNumber(GWEI_CONVERSION))
    .toNumber();
}

export const getTransactionLabel = () => {
  return 'Est. TX Fee';
};
