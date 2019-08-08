import { createSelector } from "reselect";
import { selectLoginAccountState } from "store/select-state";
import { formatRep, formatEther, formatDai } from "utils/format-number";
import generateDownloadAccountLink from "modules/auth/helpers/generate-download-account-link";
import store from "store";

import getValue from "utils/get-value";
import { createBigNumber } from "utils/create-big-number";

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
        decimalsRounded: 4
      }),
      dai: formatDai(loginAccount.balances.dai, {
        zeroStyled: false,
        decimalsRounded: 4
      }),
      eth: formatEther(loginAccount.balances.eth, {
        zeroStyled: false,
        decimalsRounded: 4
      })
    };
  }
);

export const selectAccountFunds = createSelector(
  selectLoginAccount,
  loginAccount => {
    let totalAvailableTradingBalance = createBigNumber(0);
    let totalFrozenFunds = createBigNumber(0);

    if (loginAccount.balances.dai && loginAccount.balances.dai) {
      totalAvailableTradingBalance = createBigNumber(loginAccount.balances.dai);
    }

    if (loginAccount.totalFrozenFunds) {
      totalFrozenFunds = createBigNumber(loginAccount.totalFrozenFunds);
    }

    const totalAccountValue = totalAvailableTradingBalance.plus(
      totalFrozenFunds
    );

    return {
      totalAvailableTradingBalance,
      totalFrozenFunds,
      totalAccountValue
    };
  }
);
