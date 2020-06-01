import { createBigNumber } from 'utils/create-big-number';
import { formatAttoEth, formatEther } from 'utils/format-number';
import { FormattedNumber } from 'modules/types';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { AppStatus } from 'modules/app/store/app-status';

 const userEthReserve = (balances, env): FormattedNumber => {
  const ethNonSafeBN = createBigNumber(balances.signerBalances.eth || 0);
  let desiredSignerEthBalance = createBigNumber(
    formatAttoEth(env.gsn.desiredSignerBalanceInETH * 10**18).value
  );
  if (ethNonSafeBN.lt(desiredSignerEthBalance)) {
    desiredSignerEthBalance = ethNonSafeBN;
  }

  return formatEther(
    desiredSignerEthBalance,
    {
      zeroStyled: false,
      decimalsRounded: 4,
    }
  );
}
export const getEthReserve = () => {
  const { loginAccount: { balances }, env } = AppStatus.get();
  return userEthReserve(balances, env);
}

export const getEthReserveInDai = () => {
  const { ethToDaiRate } = AppStatus.get();
  const ethReserve = getEthReserve();
  return ethToDai(ethReserve.value, createBigNumber(ethToDaiRate?.value || 0));
}
