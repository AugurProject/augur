import Augur from "augur.js";
import { isSyncFinished } from "../../blockchain/sync-augur-node-with-blockchain";

export function getContractAddresses(augur: Augur, callback: (err?: Error|null, result?: any) => void): void {
  callback(null, {
    version: augur.version,
    net_version: augur.rpc.getNetworkID(),
    netId: augur.rpc.getNetworkID(),
    isSyncFinished: isSyncFinished(),
    addresses: augur.contracts.addresses[augur.rpc.getNetworkID()],
  });
}
