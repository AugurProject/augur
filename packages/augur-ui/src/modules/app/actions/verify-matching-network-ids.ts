import { augur } from "services/augurjs";
import { getAugurNodeNetworkId } from "modules/app/actions/get-augur-node-network-id";
import isGlobalWeb3 from "modules/auth/helpers/is-global-web3";
import logError from "utils/log-error";

interface NetworkIdsObject {
  augurNode: String | null;
  middleware: String | null;
  netVersion?: String | null;
}

const allNetworkIdsMatch = (networkIds: NetworkIdsObject, callback: Function = logError) => {
  const networkIdValues: any = Object.values(networkIds);
  if (networkIdValues.indexOf(null) > -1) {
    return callback(
      `One or more network IDs not found: ${JSON.stringify(networkIds)}`
    );
  }
  if (new Set(networkIdValues).size > 1) {
    console.error(`Network ID mismatch: ${JSON.stringify(networkIds)}`);
    return callback(null, networkIds.augurNode); // augur-node's network id is the expected network id
  }
  callback(null);
};

export const verifyMatchingNetworkIds = (callback: Function = logError) => (dispatch: Function) =>
  dispatch(
    getAugurNodeNetworkId((err: any, augurNodeNetworkId: String) => {
      if (err) return callback(err);
      const networkIds: NetworkIdsObject = {
        augurNode: augurNodeNetworkId,
        middleware: augur.rpc.getNetworkID()
      };
      if (!isGlobalWeb3()) return allNetworkIdsMatch(networkIds, callback);
      augur.rpc.net.version((err: any, netVersion: String) => {
        if (err) return callback(err);
        networkIds.netVersion = netVersion;
        allNetworkIdsMatch({ ...networkIds, netVersion }, callback);
      });
    })
  );
