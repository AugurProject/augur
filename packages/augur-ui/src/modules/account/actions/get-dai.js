import { updateAlert } from "modules/alerts/actions/alerts";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import logError from "utils/log-error";
import { augurApi } from "services/augurapi";
import { BigNumber } from "ethers/utils";

export default function(callback = logError) {
  return async (dispatch, getState) => {
    const { contracts } = augurApi.get();
    contracts.cash.faucet(new BigNumber("100000000000000000000000")).then(
      success => {
        // TODO: SDK will management pending tx queue
        console.log("get-dai was success");
        callback(null);
      },
      err => {
        console.log("failure", err);
        dispatch(
          updateAlert("blah-blah", {
            id: "blah-blah",
            status: "Failed",
            timestamp: selectCurrentTimestampInSeconds(getState())
          })
        );
        logError("blah-blah");
      }
    );
  };
}
