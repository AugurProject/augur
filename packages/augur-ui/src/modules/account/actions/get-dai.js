import { augur } from "services/augurjs";
import { updateAlert } from "modules/alerts/actions/alerts";
import { updateAssets } from "modules/auth/actions/update-assets";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import logError from "utils/log-error";
import noop from "utils/noop";

export default function(callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    augur.api.Cash.faucet({
      tx: { to: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash },
      _amount: 1000000000000000000000,
      meta: loginAccount.meta,
      onSent: noop,
      onSuccess: res => {
        dispatch(
          updateAlert(res.hash, {
            id: res.hash,
            status: "Confirmed",
            timestamp: selectCurrentTimestampInSeconds(getState())
          })
        );
        dispatch(updateAssets());
        callback(null);
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
