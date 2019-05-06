import { augur } from "services/augurjs";
import {
  updateAuthStatus,
  IS_LOGGED
} from "modules/auth/actions/update-auth-status";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import trezorSigner from "modules/auth/helpers/trezor-signer";
import { toChecksumAddress } from "ethereumjs-util";

export default function loginWithTrezor(address, connect, addressPath) {
  return dispatch => {
    dispatch(updateAuthStatus(IS_LOGGED, true));
    dispatch(
      loadAccountData({
        address,
        displayAddress: toChecksumAddress(address),
        meta: {
          address,
          signer: async (...args) => {
            trezorSigner(connect, addressPath, dispatch, args);
          },
          accountType: augur.rpc.constants.ACCOUNT_TYPES.TREZOR
        }
      })
    );
  };
}
