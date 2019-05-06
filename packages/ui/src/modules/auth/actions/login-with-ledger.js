import { augur } from "services/augurjs";
import {
  updateAuthStatus,
  IS_LOGGED
} from "modules/auth/actions/update-auth-status";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import { toChecksumAddress } from "ethereumjs-util";
import ledgerSigner from "modules/auth/helpers/ledger-signer";

export default function loginWithLedger(address, ledgerLib, derivationPath) {
  return dispatch => {
    dispatch(updateAuthStatus(IS_LOGGED, true));
    dispatch(
      loadAccountData({
        address,
        ledgerLib,
        displayAddress: toChecksumAddress(address),
        meta: {
          address,
          signer: async (...args) => {
            ledgerSigner(args, ledgerLib, derivationPath, dispatch);
          },
          accountType: augur.rpc.constants.ACCOUNT_TYPES.LEDGER
        }
      })
    );
  };
}
