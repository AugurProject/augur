import { createSelector } from 'reselect';
import { createBigNumber } from 'utils/create-big-number';
import { selectLoginAccount } from './login-account';
import { formatAttoEth, formatEther, formatNumber } from 'utils/format-number';
import { FormattedNumber } from 'modules/types';
import { selectEnvState, selectAppStatus } from 'appStore/select-state';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';

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

export const getEthReserve = createSelector(
  selectLoginAccount,
  selectEnvState,
  selectAppStatus,
  (loginAccount, env, appStatus): FormattedNumber => {
    const { balances } = loginAccount;
    const { walletStatus } = appStatus;
    if (walletStatus !== WALLET_STATUS_VALUES.CREATED) return formatNumber(0);
    return userEthReserve(balances, env);
  }
);

export const getEthReserveInDai = createSelector(
  selectLoginAccount,
  selectEnvState,
  selectAppStatus,
  (loginAccount, env, appStatus): FormattedNumber => {
    const { balances } = loginAccount;
    const ethReserve = userEthReserve(balances, env);
    return ethToDai(ethReserve.value, createBigNumber(appStatus.ethToDaiRate?.value || 0));
  }
)

