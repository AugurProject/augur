import generateDownloadAccountLink from './generate-download-account-link';
import getValue from 'utils/get-value';
import { formatRep, formatDai, formatEther, formatNone } from 'utils/format-number';
import { DAI, DEFAULT_PARA_TOKEN, USDC, USDT, WETH, ZERO } from 'modules/common/constants';
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
    usdt: formatDai(loginAccount.balances.usdt, {
      zeroStyled: false,
      decimalsRounded: 4,
    }),
    usdc: formatDai(loginAccount.balances.usdc, {
      zeroStyled: false,
      decimalsRounded: 4,
    }),
    weth: formatEther(loginAccount.balances.weth, {
      zeroStyled: false,
      decimalsRounded: 4,
    }),
  };
};

export const getAccountFunds = (loginAccount, paraToken) => {
  let totalAvailableTradingBalance = ZERO;
  let totalFrozenFunds = ZERO;
  let totalRealizedPL = ZERO;
  let totalOpenOrderFunds = loginAccount.totalOpenOrdersFrozenFunds
    ? loginAccount.totalOpenOrdersFrozenFunds
    : ZERO;

  if (paraToken === DAI) {
    if (loginAccount.balances.dai) {
      totalAvailableTradingBalance = createBigNumber(
        loginAccount.balances.dai
      ).minus(totalOpenOrderFunds);
    }
  } else if (paraToken === USDT) {
    if (loginAccount.balances.usdt) {
      totalAvailableTradingBalance = createBigNumber(
        loginAccount.balances.usdt
      ).minus(totalOpenOrderFunds);
    }
  } else if (paraToken === USDC) {
    if (loginAccount.balances.usdc) {
      totalAvailableTradingBalance = createBigNumber(
        loginAccount.balances.usdc
      ).minus(totalOpenOrderFunds);
    }
  } else if (paraToken === WETH) {
    if (loginAccount.balances.weth) {
      totalAvailableTradingBalance = createBigNumber(
        loginAccount.balances.weth
      ).minus(totalOpenOrderFunds);
    }
  }

  if (loginAccount.totalFrozenFunds) {
    totalFrozenFunds = createBigNumber(loginAccount.totalFrozenFunds);
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
  const { env: { paraDeploy, paraDeploys }, loginAccount } = AppStatus.get();
  const paraDetails = paraDeploy && paraDeploys && paraDeploys[paraDeploy] || paraDeploys[DEFAULT_PARA_TOKEN];
  if (!paraDetails) return null;


  if (paraDetails.name === DAI) {
    return createBigNumber(loginAccount.balances.dai).minus(
      loginAccount.totalOpenOrdersFrozenFunds
    );
  } else if (paraDetails.name === USDT) {
      return createBigNumber(loginAccount.balances.usdt).minus(
        loginAccount.totalOpenOrdersFrozenFunds
      );
  } else if (paraDetails.name === USDC) {
      return createBigNumber(loginAccount.balances.usdc).minus(
        loginAccount.totalOpenOrdersFrozenFunds
      );
  } else if (paraDetails.name === WETH) {
      return createBigNumber(loginAccount.balances.weth).minus(
        loginAccount.totalOpenOrdersFrozenFunds
      );
  }
}

export const getCoreStats = (isLogged, loginAccount, paraToken) => {
  const accountFunds = getAccountFunds(loginAccount, paraToken);
  if (!accountFunds) return null;

  const formatValue = (value) => {
    if (paraToken !== WETH) {
      return formatDai(value, { removeComma: true });
    }
    return formatEther(value, { removeComma: true });
  }

  const availableFunds = {
    label: 'Available Funds',
    value: formatValue(accountFunds.totalAvailableTradingBalance),
    useFull: true,
  };
  const frozenFunds = {
    label: 'Frozen Funds',
    value: formatValue(accountFunds.totalFrozenFunds),
    useFull: true,
  };
  const totalFunds = {
    label: 'Total Funds',
    value: formatValue(accountFunds.totalAccountValue),
    useFull: true,
  };
  const realizedPL = {
    label: '30 Day P/L',
    value: formatValue(accountFunds.totalRealizedPL),
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
