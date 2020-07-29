import { createSelector } from "reselect";
import { selectLoginAccountState } from "appStore/select-state";
import { formatRep, formatEther, formatDaiPrice, formatDai } from "utils/format-number";
import generateDownloadAccountLink from "modules/auth/helpers/generate-download-account-link";
import store from "appStore";

import getValue from "utils/get-value";
import { createBigNumber, BigNumber } from "utils/create-big-number";
import { ZERO } from "modules/common/constants";
import { LoginAccount } from "modules/types";

export default function() {
  return selectLoginAccount(store.getState());
}

export const selectLoginAccount = createSelector(
  selectLoginAccountState,
  loginAccount => {
    const genAccountProperties = generateDownloadAccountLink(
      loginAccount.address,
      loginAccount.keystore,
      getValue(loginAccount, "privateKey.data")
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
      })
    };
  }
);

export const selectAccountFunds = createSelector(
  selectLoginAccount,
  loginAccount => {
    let totalAvailableTradingBalance = ZERO;
    let totalFrozenFunds = ZERO;
    let totalRealizedPL = ZERO;
    let totalOpenOrderFunds = loginAccount.totalOpenOrdersFrozenFunds
      ? loginAccount.totalOpenOrdersFrozenFunds
      : ZERO;

    if (loginAccount.balances.dai && loginAccount.balances.dai) {
      totalAvailableTradingBalance = createBigNumber(loginAccount.balances.dai).minus(totalOpenOrderFunds);
    }

    if (loginAccount.totalFrozenFunds) {
      totalFrozenFunds = createBigNumber(loginAccount.totalFrozenFunds).plus(
        totalOpenOrderFunds
      );
    }

    if (loginAccount.totalRealizedPL) {
      totalRealizedPL = createBigNumber(loginAccount.totalRealizedPL);
    }

    const totalAccountValue = totalAvailableTradingBalance.plus(
      totalFrozenFunds
    );

    return {
      totalAvailableTradingBalance,
      totalRealizedPL,
      totalFrozenFunds,
      totalAccountValue
    };
  }
);

export const totalTradingBalance = (loginAccount: LoginAccount): BigNumber => {
  return createBigNumber(loginAccount.balances.dai).minus(
    loginAccount.totalOpenOrdersFrozenFunds
  );
};
