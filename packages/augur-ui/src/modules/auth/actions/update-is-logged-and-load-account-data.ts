import { toChecksumAddress } from "ethereumjs-util";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import {
  updateAuthStatus,
  IS_LOGGED,
} from "modules/auth/actions/auth-status";
import { clearLoginAccount } from "modules/account/actions/login-account";
import { clearUserTx } from "modules/contracts/actions/contractCalls";

export const updateIsLoggedAndLoadAccountData = (
  unlockedAddress: string,
  accountType: string
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  clearUserTx();
  dispatch(clearLoginAccount()); // clear the loginAccount data in local state
  const displayAddress = toChecksumAddress(unlockedAddress);
  const address = unlockedAddress;
  const loginAccount = {
    address,
    displayAddress,
    meta: { accountType, address, signer: null }
  };

  dispatch(updateAuthStatus(IS_LOGGED, true));
  dispatch(loadAccountData(loginAccount));
};
