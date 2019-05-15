import { augur } from "services/augurjs";
import { getAugurNodeNetworkId } from "modules/app/actions/get-augur-node-network-id";
import isGlobalWeb3 from "modules/auth/helpers/is-global-web3";
import logError from "utils/log-error";
import { getNetworkId } from "modules/contracts/actions/contractCalls";

interface NetworkIdsObject {
  augurNode: string | null;
  middleware: string | null;
  netVersion?: string | null;
}

const allNetworkIdsMatch = (networkIds: NetworkIdsObject, callback: Function = logError) => {
  const networkIdValues: any = Object.values(networkIds);
  if (networkIdValues.indexOf(null) > -1) {
    return callback(
      `One or more network IDs not found: ${JSON.stringify(networkIds)}`,
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
    getAugurNodeNetworkId((err: any, augurNodeNetworkId: string) => {
      if (err) return callback(err);
      const networkIds: NetworkIdsObject = {
        augurNode: augurNodeNetworkId,
        middleware: getNetworkId().toString()
      };
      if (!isGlobalWeb3()) return allNetworkIdsMatch(networkIds, callback);
      allNetworkIdsMatch({ ...networkIds }, callback);
    }),
  );
