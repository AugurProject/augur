import Augur from "augur.js";
import { isSyncFinished } from "../../blockchain/bulk-sync-augur-node-with-blockchain";
import * as Knex from "knex";
import { getCashAddress } from "./database";

export function getSyncData(db: Knex, augur: Augur, callback: (err?: Error|null, result?: any) => void): void {
  const currentBlock = augur.rpc.getCurrentBlock();
  const highestBlock = {
    number: parseInt(currentBlock.number, 16),
    hash: currentBlock.hash,
    timestamp: parseInt(currentBlock.timestamp, 16),
  };
  db("blocks").first(["blockNumber as number", "blockHash as hash", "timestamp"]).orderBy("blockNumber", "DESC").asCallback((err: Error|null, lastProcessedBlock) => {
    if (err) return callback(err);
    callback(null, {
      version: augur.version,
      net_version: augur.rpc.getNetworkID(),
      netId: augur.rpc.getNetworkID(),
      isSyncFinished: isSyncFinished(),
      addresses: augur.contracts.addresses[augur.rpc.getNetworkID()],
      highestBlock,
      lastProcessedBlock,
    });
  });
}
