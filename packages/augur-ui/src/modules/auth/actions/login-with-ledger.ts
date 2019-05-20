import {
  updateAuthStatus,
  AUTH_STATUS,
} from "modules/auth/actions/auth-status";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import { toChecksumAddress } from "ethereumjs-util";
import ledgerSigner from "modules/auth/helpers/ledger-signer";

export default function loginWithLedger(
  address: string,
  ledgerLib: any,
  derivationPath: string
) {
  return (dispatch: Function) => {
    dispatch(updateAuthStatus(AUTH_STATUS.IS_LOGGED, true));
    dispatch(
      loadAccountData({
        address,
        ledgerLib,
        displayAddress: toChecksumAddress(address),
        meta: {
          address,
          signer: async (...args: any) => {
            ledgerSigner(args, ledgerLib, derivationPath, dispatch);
          },
          accountType: ACCOUNT_TYPES.LEDGER
        }
      })
    );
  };
}
