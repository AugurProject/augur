import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { updateLoginAccount } from "modules/account/actions/login-account";
import { updateAlert } from "modules/alerts/actions/alerts";
import { selectCurrentTimestampInSeconds } from "store/select-state";
import { getNetworkId } from "modules/contracts/actions/contractCalls";

export function checkAccountAllowance(callback: Function = logError) {
  return (dispatch: Function, getState: Function) => {
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

export function approveAccount(
  onSent: Function = logError,
  onSuccess: Function = logError
) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    const { address, meta } = loginAccount;
    augur.accounts.approveAugur({
      meta,
      address,
      onSent,
      onSuccess: res => {
        dispatch(checkAccountAllowance());
        onSuccess(null, res);
      },
      onFailed: res => {
        dispatch(
          updateAlert(res.hash, {
            id: res.hash,
            status: "Failed",
            timestamp: selectCurrentTimestampInSeconds(getState())
          })
        );
        logError(res);
      }
    });
  };
}
