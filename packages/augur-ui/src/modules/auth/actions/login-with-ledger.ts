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
      mixedCaseAddress: toChecksumAddress(address),
      meta: {
        address,
        signer,
        accountType: ACCOUNT_TYPES.LEDGER,
        isWeb3: false,
      },
    };

    dispatch(updateSdk(loginAccount, undefined));
  };
}
