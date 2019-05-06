import { toChecksumAddress } from "ethereumjs-util";
import { augur } from "services/augurjs";
import { loadAccountData } from "modules/auth/actions/load-account-data";
import {
  updateAuthStatus,
  IS_LOGGED
} from "modules/auth/actions/update-auth-status";
import { clearLoginAccount } from "modules/auth/actions/update-login-account";

export const updateIsLoggedAndLoadAccountData = (
  unlockedAddress,
  accountType
) => dispatch => {
  augur.rpc.clear(); // clear ethrpc transaction history, registered callbacks, and alerts
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
