import {
  updateAuthStatus,
  IS_LOGGED,
} from "modules/auth/actions/auth-status";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import { toChecksumAddress } from "ethereumjs-util";
import LedgerSigner from "modules/auth/helpers/ledger-signer";
import { updateSdk } from "./update-sdk";
import { ACCOUNT_TYPES } from "modules/common/constants";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export default function loginWithLedger(
  address: string,
  ledgerLib: any,
  derivationPath: string
) {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    const signer = new LedgerSigner(address, derivationPath, ledgerLib, dispatch);

    const loginAccount = {
      address,
      displayAddress: toChecksumAddress(address),
      meta: {
        address,
        signer,
        accountType: ACCOUNT_TYPES.LEDGER,
        isWeb3: false,
      },
    };

    await dispatch(updateSdk(loginAccount, undefined, null));
    dispatch(updateAuthStatus(IS_LOGGED, true));
    dispatch(loadAccountData(loginAccount));
  };
}
