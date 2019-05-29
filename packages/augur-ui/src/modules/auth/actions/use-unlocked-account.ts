import { updateIsLoggedAndLoadAccountData } from "modules/auth/actions/update-is-logged-and-load-account-data";
import isGlobalWeb3 from "modules/auth/helpers/is-global-web3";
import logError from "utils/log-error";
import { ACCOUNT_TYPES } from "modules/common-elements/constants";
import { isUnlocked } from "modules/contracts/actions/contractCalls";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

// Use unlocked local account or MetaMask account
export const useUnlockedAccount = (
  unlockedAddress: string,
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (unlockedAddress == null) return callback("no account address");
  if (isGlobalWeb3()) {
    dispatch(
      updateIsLoggedAndLoadAccountData(unlockedAddress, ACCOUNT_TYPES.METAMASK)
    );
    return callback(null);
  }
  isUnlocked(unlockedAddress)
    .then((isUnlocked: boolean) => {
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
    })
    .catch((err: Error) => {
      callback(err);
    });
};
