import Augur from "augur.js";

// Returning marketIds should likely be more generalized, since it is a single line change for most getters (awaiting reporting, by user, etc)
export function getContractAddresses(augur: Augur, callback: (err?: Error|null, result?: any) => void): void {
  callback(null, {
    version: augur.version,
    net_version: augur.rpc.getNetworkID(),
    addresses: augur.contracts.addresses[augur.rpc.getNetworkID()],
  });
}
