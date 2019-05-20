import {
updateAuthStatus,
AUTH_STATUS,
} from "modules/common/types/auth-status";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import trezorSigner from "modules/auth/helpers/trezor-signer";
import { toChecksumAddress } from "ethereumjs-util";
import { ACCOUNT_TYPES } from "modules/common-elements/constants";

export default function loginWithTrezor(
  address: String,
  connect: Function,
  addressPath: String
) {
  return (dispatch: Function) => {
    dispatch(updateAuthStatus(AUTH_STATUS.IS_LOGGED, true));
    dispatch(
      loadAccountData({
        address,
        displayAddress: toChecksumAddress(address),
        meta: {
          address,
          signer: async (...args: any) => {
            trezorSigner(connect, addressPath, dispatch, args);
          },
          accountType: ACCOUNT_TYPES.TREZOR
        }
      })
    );
  };
}
