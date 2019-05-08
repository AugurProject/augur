import { augur } from "services/augurjs";
import { updateAlert } from "modules/alerts/actions/alerts";
import { updateAssets } from "modules/auth/actions/update-assets";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import logError from "utils/log-error";
import noop from "utils/noop";
import { augurApi } from "services/augurapi";
import { BigNumber } from "ethers/utils";

export default function(callback = logError) {
  return async (dispatch, getState) => {
    const { contracts } = augurApi.get();
    contracts.cash.faucet(new BigNumber(100000)).then(
      success => {
        console.log("success", success);
      },
      err => {
        console.log("failure", err);
      }
    );

    /*
      {
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
    */
  };
}
