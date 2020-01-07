import TrezorSigner from "modules/auth/helpers/trezor-signer";
import { getAddress } from "ethers/utils/address";"
import { ACCOUNT_TYPES } from "modules/common/constants";
import { updateSdk } from "modules/auth/actions/update-sdk";


export default function loginWithTrezor(
  address: string,
  addressPath: string
) {
  return async (dispatch: Function) => {

    const signer = new TrezorSigner(address, addressPath, dispatch);

    const loginAccount = {
      address,
      mixedCaseAddress: getAddress(address),
      meta: {
        address,
        signer,
        accountType: ACCOUNT_TYPES.TREZOR,
        isWeb3: false,
      },
    };

    await dispatch(updateSdk(loginAccount, undefined));

  };
}
