import { augur } from "services/augurjs";
import {
  updateNotification,
  addNotification
} from "modules/notifications/actions";
import { updateAssets } from "modules/auth/actions/update-assets";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import LogError from "utils/log-error";

export function fundNewAccount(callback = LogError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    if (augur.rpc.getNetworkID() !== "1") {
      augur.api.LegacyReputationToken.faucet({
        meta: loginAccount.meta,
        onSent: res => {
          dispatch(
            addNotification({
              id: res.hash,
              status: "Pending",
              params: {
                type: "faucet"
              },
              timestamp: selectCurrentTimestampInSeconds(getState())
            })
          );
        },
        onSuccess: res => {
          dispatch(
            updateNotification(res.hash, {
              id: res.hash,
              status: "Confirmed",
              timestamp: selectCurrentTimestampInSeconds(getState())
            })
          );
          dispatch(updateAssets());
          callback(null);
        },
        onFailed: callback
      });
    }
  };
}
