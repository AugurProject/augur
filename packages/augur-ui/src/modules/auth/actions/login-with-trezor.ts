import {
updateAuthStatus,
IS_LOGGED,
} from "modules/auth/actions/auth-status";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import trezorSigner from "modules/auth/helpers/trezor-signer";
import { toChecksumAddress } from "ethereumjs-util";
import { ACCOUNT_TYPES } from "modules/common-elements/constants";

export default function loginWithTrezor(
  address: string,
  connect: Function,
  addressPath: string
) {
  return (dispatch: Function) => {
    dispatch(updateAuthStatus(IS_LOGGED, true));
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
