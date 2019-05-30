import { getAugurNodeNetworkId } from "modules/app/actions/get-augur-node-network-id";
import logError from "utils/log-error";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const checkIfMainnet = (callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
) => {
  dispatch(
    getAugurNodeNetworkId((err: any, augurNodeNetworkId: string) => {
      if (err) return callback(err);
      if (augurNodeNetworkId === "1") {
        // If any other networkId being used is 1 but this isnt we'll get a different error dialog anyway
        return callback(null, true);
      }
      callback(null, false);
    })
  );
};
