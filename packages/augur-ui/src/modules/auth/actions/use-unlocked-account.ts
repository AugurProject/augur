import { augur } from "services/augurjs";
import { updateIsLoggedAndLoadAccountData } from "modules/auth/actions/update-is-logged-and-load-account-data";
import isGlobalWeb3 from "modules/auth/helpers/is-global-web3";
import logError from "utils/log-error";
import { ACCOUNT_TYPES } from "modules/common-elements/constants";

// Use unlocked local account or MetaMask account
export const useUnlockedAccount = (
  unlockedAddress: String,
  callback: Function = logError
) => (dispatch: Function) => {
  if (unlockedAddress == null) return callback("no account address");
  if (isGlobalWeb3()) {
    dispatch(
      updateIsLoggedAndLoadAccountData(unlockedAddress, ACCOUNT_TYPES.METAMASK)
    );
    return callback(null);
  }
  augur.rpc.isUnlocked(unlockedAddress, (err: any, isUnlocked: Boolean) => {
    if (err) return callback(err);
    if (isUnlocked === false) {
      console.warn(`account ${unlockedAddress} is locked`);
      return callback(null);
    }
    dispatch(
      updateIsLoggedAndLoadAccountData(
        unlockedAddress,
        ACCOUNT_TYPES.UNLOCKED_ETHEREUM_NODE
      )
    );
    callback(null);
  });
};
