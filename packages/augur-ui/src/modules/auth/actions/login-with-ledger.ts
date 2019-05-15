import { augur } from "services/augurjs";
import {
  updateAuthStatus,
  IS_LOGGED
} from "modules/auth/actions/update-auth-status";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import { toChecksumAddress } from "ethereumjs-util";
import ledgerSigner from "modules/auth/helpers/ledger-signer";

export default function loginWithLedger(
  address: String,
  ledgerLib: any,
  derivationPath: String
) {
  return (dispatch: Function) => {
    dispatch(updateAuthStatus(IS_LOGGED, true));
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
