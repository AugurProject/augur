import * as t from "io-ts";
import Knex from "knex";
import { Augur } from "../../types";
import { isSyncFinished } from "../../blockchain/bulk-sync-augur-node-with-blockchain";
import { version } from "../../version";
import { Addresses } from "@augurproject/artifacts";

export const NoParams = t.type({
});

export interface UISyncData {
  version: string;
  augurNodeVersion: string;
  net_version: string;
  netId: string;
  isSyncFinished: boolean;
  addresses: {};
  highestBlock: {};
  lastProcessedBlock: {};
}

export async function getSyncData(db: Knex, augur: Augur, params: t.TypeOf<typeof NoParams>): Promise<UISyncData> {
  const currentBlockNumber = await augur.provider.getBlockNumber()
  const highestBlock = await augur.provider.getBlock(currentBlockNumber);
  const lastProcessedBlock = await db("blocks").first(["blockNumber as number", "blockHash as hash", "timestamp"]).orderBy("blockNumber", "DESC");
  return {
    version: "0.0.0.0.0.0.0.0.1",
    augurNodeVersion: version,
    net_version: augur.networkId,
    netId: augur.networkId,
    isSyncFinished: isSyncFinished(),
    addresses: Addresses[augur.networkId],
    highestBlock,
    lastProcessedBlock,
  };
}
