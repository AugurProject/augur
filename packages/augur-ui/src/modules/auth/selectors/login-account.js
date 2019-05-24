import { createSelector } from "reselect";
import {
  selectLoginAccountState,
  selectAccountNameState
} from "store/select-state";
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
  selectAccountNameState,
  (loginAccount, accountName) => ({
    ...loginAccount,
    ...generateDownloadAccountLink(
      loginAccount.address,
      loginAccount.keystore,
      getValue(loginAccount, "privateKey.data")
        ? loginAccount.privateKey.data
        : loginAccount.privateKey
    ), // Ternary due to differences in the way data is stored between Airbitz + local -- TODO -- unify
    accountName,
    rep: formatRep(loginAccount.rep, { zeroStyled: false, decimalsRounded: 4 }),
    dai: formatDai(loginAccount.dai, { zeroStyled: false, decimalsRounded: 4 }),
    eth: formatEther(loginAccount.eth, {
      zeroStyled: false,
      decimalsRounded: 4
    })
  })
);

export const selectAccountFunds = createSelector(
  selectLoginAccount,
  loginAccount => {
    let totalAvailableTradingBalance = createBigNumber(0);
    let totalFrozenFunds = createBigNumber(0);

    if (loginAccount.dai && loginAccount.dai.value) {
      totalAvailableTradingBalance = createBigNumber(loginAccount.dai.value);
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
