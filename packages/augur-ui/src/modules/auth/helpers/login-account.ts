import generateDownloadAccountLink from './generate-download-account-link';
import getValue from 'utils/get-value';
import { formatRep, formatDai, formatEther, formatNone } from 'utils/format-number';
import { ZERO } from 'modules/common/constants';
import { createBigNumber, BigNumber } from "utils/create-big-number";
import { AppStatus } from 'modules/app/store/app-status';

export const getLoginAccountFormatted = loginAccount => {
  const genAccountProperties = generateDownloadAccountLink(
    loginAccount.address,
    loginAccount.keystore,
    getValue(loginAccount, 'privateKey.data')
      ? loginAccount.privateKey.data
      : loginAccount.privateKey
  );

  return {
    ...loginAccount,
    ...genAccountProperties,
    rep: formatRep(loginAccount.balances.rep, {
      zeroStyled: false,
      decimalsRounded: 4,
    }),
    dai: formatDai(loginAccount.balances.dai, {
      zeroStyled: false,
      decimalsRounded: 2,
    }),
    eth: formatEther(loginAccount.balances.eth, {
      zeroStyled: false,
      decimalsRounded: 4,
    }),
  };
};

export const getAccountFunds = loginAccount => {
  let totalAvailableTradingBalance = ZERO;
  let totalFrozenFunds = ZERO;
  let totalRealizedPL = ZERO;
  let totalOpenOrderFunds = loginAccount.totalOpenOrdersFrozenFunds
    ? loginAccount.totalOpenOrdersFrozenFunds
    : ZERO;

  if (loginAccount.balances.dai && loginAccount.balances.dai) {
    totalAvailableTradingBalance = createBigNumber(
      loginAccount.balances.dai
    ).minus(totalOpenOrderFunds);
  }

  if (loginAccount.totalFrozenFunds) {
    totalFrozenFunds = createBigNumber(loginAccount.totalFrozenFunds).plus(
      totalOpenOrderFunds
    );
  }

  if (loginAccount.totalRealizedPL) {
    totalRealizedPL = createBigNumber(loginAccount.totalRealizedPL);
  }

  const totalAccountValue = totalAvailableTradingBalance.plus(totalFrozenFunds);

  return {
    totalAvailableTradingBalance,
    totalRealizedPL,
    totalFrozenFunds,
    totalAccountValue,
  };
};

export const totalTradingBalance = (): BigNumber =>
{
  const { loginAccount } = AppStatus.get();
  return createBigNumber(loginAccount.balances.dai).minus(
    loginAccount.totalOpenOrdersFrozenFunds
  );
}

export const getCoreStats = (isLogged, loginAccount) => {
  const accountFunds = getAccountFunds(loginAccount);
  const availableFunds = {
    label: 'Available Funds',
    value: formatDai(accountFunds.totalAvailableTradingBalance, {
      removeComma: true,
    }),
    useFull: true,
  };
  const frozenFunds = {
    label: 'Frozen Funds',
    value: formatDai(accountFunds.totalFrozenFunds, { removeComma: true }),
    useFull: true,
  };
  const totalFunds = {
    label: 'Total Funds',
    value: formatDai(accountFunds.totalAccountValue, { removeComma: true }),
    useFull: true,
  };
  const realizedPL = {
    label: '30 Day P/L',
    value: formatDai(accountFunds.totalRealizedPL, { removeComma: true }),
    useFull: true,
  };
  if (!isLogged) {
    availableFunds.value = formatNone();
    frozenFunds.value = formatNone();
    totalFunds.value = formatNone();
    realizedPL.value = formatNone();
  }
  return {
    availableFunds,
    frozenFunds,
    totalFunds,
    realizedPL,
  };
};
