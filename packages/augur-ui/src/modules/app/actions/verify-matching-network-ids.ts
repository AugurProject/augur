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

const allNetworkIdsMatch = (networkIds: NetworkIdsObject, callback: NodeStyleCallback = logError) => {
  const networkIdValues: any = Object.values(networkIds);
  if (networkIdValues.indexOf(null) > -1) {
    return callback(
      `One or more network IDs not found: ${JSON.stringify(networkIds)}`,
    );
  }

  callback(null);
};

export const verifyMatchingNetworkIds = (callback: NodeStyleCallback = logError) => (dispatch: ThunkDispatch<void, any, Action>) =>
  dispatch(
    getAugurNodeNetworkId((err: any, augurNodeNetworkId: string) => {
      if (err) return callback(err);
      const networkIds: NetworkIdsObject = {
        augurNode: augurNodeNetworkId,
        middleware: getNetworkId(),
      };
      if (!isGlobalWeb3()) return allNetworkIdsMatch(networkIds, callback);
      allNetworkIdsMatch({ ...networkIds }, callback);
    }),
  );
