import { createSelector } from 'reselect';
import { createBigNumber } from 'utils/create-big-number';
import { selectLoginAccount } from './login-account';
import { formatAttoEth, formatEther } from 'utils/format-number';
import { FormattedNumber } from 'modules/types';
import { selectEnvState } from 'appStore/select-state';

export const getEthReserve = createSelector(
  selectLoginAccount,
  selectEnvState,
  (loginAccount, env) => {
    const { balances } = loginAccount;
    const ethNonSafeBN = createBigNumber(balances.ethNonSafe);
    let desiredSignerEthBalance = createBigNumber(
      formatAttoEth(env.gsn.desiredSignerBalanceInETH * 10**18).value
    );
    if (ethNonSafeBN.lt(desiredSignerEthBalance))
      desiredSignerEthBalance = ethNonSafeBN;
    const reserveEthAmount: FormattedNumber = formatEther(
      desiredSignerEthBalance,
      {
        zeroStyled: false,
        decimalsRounded: 4,
      }
    );
    return reserveEthAmount;
  }
);
