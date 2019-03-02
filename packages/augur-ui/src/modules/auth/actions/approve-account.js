import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import { updateNotification } from "modules/notifications/actions/notifications";
import { selectCurrentTimestampInSeconds } from "src/select-state";

export function checkAccountAllowance(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    if (loginAccount.allowance && loginAccount.allowance !== "0") {
      callback(null, loginAccount.allowance);
    } else {
      augur.api.Cash.allowance(
        {
          _tokenHolder: loginAccount.address,
          _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Augur
        },
        (err, allowance) => {
          if (err) callback(err);
          callback(null, allowance);
          dispatch(updateLoginAccount({ allowance }));
        }
      );
    }
  };
}

export function approveAccount(onSent = logError, onSuccess = logError) {
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
          updateNotification(res.hash, {
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
