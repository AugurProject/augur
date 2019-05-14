import { augur } from "services/augurjs";
import { updateAugurNodeNetworkId } from "modules/app/actions/update-connection";
import logError from "utils/log-error";

export const getAugurNodeNetworkId = (callback: Function = logError) => (
  dispatch: Function,
  getState: Function
) => {
  const { connection } = getState();
  if (connection.augurNodeNetworkId != null)
    return callback(null, connection.augurNodeNetworkId);
  augur.augurNode.getSyncData((err: any, contractAddresses: any) => {
    if (err) return callback(err);
    const augurNodeNetworkId = contractAddresses.net_version;
    dispatch(updateAugurNodeNetworkId(augurNodeNetworkId));
    callback(null, augurNodeNetworkId);
  });
};
