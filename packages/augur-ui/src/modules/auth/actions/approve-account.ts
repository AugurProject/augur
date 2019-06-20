import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { updateLoginAccount } from "modules/account/actions/login-account";
import { updateAlert } from "modules/alerts/actions/alerts";
import { selectCurrentTimestampInSeconds } from "store/select-state";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { approveToTrade } from "modules/contracts/actions/contractCalls";
import { createBigNumber } from "utils/create-big-number";
import { TEN_TO_THE_EIGHTEENTH_POWER } from "modules/common/constants";

export function checkAccountAllowance(callback: NodeStyleCallback = logError): ThunkAction<any, any, any, any> {
  return (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    const { loginAccount } = getState();
    if (loginAccount.allowance && loginAccount.allowance !== "0") {
      callback(null, loginAccount.allowance);
    } else {
      augur.api.Cash.allowance(
        {
          _owner: loginAccount.address,
          _spender: augur.contracts.addresses[getNetworkId()].Augur
        },
        (err: any, allowance: string) => {
          if (err) callback(err);
          callback(null, allowance);
          dispatch(updateLoginAccount({ allowance }));
        }
      );
    }
  };
}

export function approveAccount() {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    const { address, meta } = loginAccount;
    // TODO: when we get design this number will come from modal
    const allowance = createBigNumber(1000000).times(TEN_TO_THE_EIGHTEENTH_POWER);
    approveToTrade(address, allowance);
  };
}
