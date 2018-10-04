import * as Knex from "knex";
import Augur from "augur.js";
import { isSyncFinished } from "../../blockchain/bulk-sync-augur-node-with-blockchain";
import * as t from "io-ts";
import { MarketsInfoParams } from "./get-markets-info";

export const NoParams = t.type({
});

export interface UISyncData {
  version: string;
  net_version: string;
  netId: string;
  isSyncFinished: boolean;
  addresses: {};
  highestBlock: {};
  lastProcessedBlock: {};
}

export async function getSyncData(db: Knex, augur: Augur, params: t.TypeOf<typeof MarketsInfoParams>): Promise<UISyncData> {
  const currentBlock = augur.rpc.getCurrentBlock();
  const highestBlock = {
    number: parseInt(currentBlock.number, 16),
    hash: currentBlock.hash,
    timestamp: parseInt(currentBlock.timestamp, 16),
  };
  const lastProcessedBlock = await db("blocks").first(["blockNumber as number", "blockHash as hash", "timestamp"]).orderBy("blockNumber", "DESC");
  return {
    version: augur.version,
    net_version: augur.rpc.getNetworkID(),
    netId: augur.rpc.getNetworkID(),
    isSyncFinished: isSyncFinished(),
    addresses: augur.contracts.addresses[augur.rpc.getNetworkID()],
    highestBlock,
    lastProcessedBlock,
  };
}
