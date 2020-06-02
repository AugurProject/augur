import { createBigNumber } from 'utils/create-big-number';
import { GWEI_CONVERSION, NOT_USE_ETH_RESERVE, USE_ETH_RESERVE } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

export default function() {
  const { gasPriceInfo } = AppStatus.get();
  const gweiValue = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  return createBigNumber(gweiValue)
    .times(createBigNumber(GWEI_CONVERSION))
    .toNumber();
}

export const getTransactionLabel = () => {
  const {
    loginAccount: { balances },
    env: {
      gsn: { minDaiForSignerETHBalanceInDAI },
    },
  } = AppStatus.get();
  const useEthReserve = createBigNumber(balances.dai).isGreaterThan(
    createBigNumber(minDaiForSignerETHBalanceInDAI)
  );
  if (useEthReserve) return USE_ETH_RESERVE;
  return NOT_USE_ETH_RESERVE;
};
