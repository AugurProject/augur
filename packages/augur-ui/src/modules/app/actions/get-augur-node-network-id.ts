import { augur } from "services/augurjs";
import { updateAugurNodeNetworkId } from "modules/app/actions/update-connection";
import logError from "utils/log-error";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

export const getAugurNodeNetworkId = (callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const { connection } = getState();
  if (connection.augurNodeNetworkId != null)
    return callback(null, connection.augurNodeNetworkId);
    // @ts-ignore
  augur.augurNode.getSyncData((err: any, contractAddresses: any) => {
    if (err) return callback(err);
    const augurNodeNetworkId = getNetworkId();
    dispatch(updateAugurNodeNetworkId(augurNodeNetworkId));
    callback(null, augurNodeNetworkId);
  });
};
