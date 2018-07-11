import Augur from "augur.js";
import * as Knex from "knex";
import { promisify } from "util";
import { downloadAugurLogs } from "./download-augur-logs";
import { augurEmitter } from "../events";
import { logger } from "../utils/logger";
import { saveBulkSyncDatabase } from "../setup/check-and-initialize-augur-db";

const BLOCKSTREAM_HANDOFF_BLOCKS = 5;
let syncFinished = false;

interface HighestBlockNumberRow {
  highestBlockNumber: number;
}

export function isSyncFinished() {
  return syncFinished;
}

function setSyncFinished() {
  syncFinished = true;
  augurEmitter.emit("SyncFinished");
}

export async function bulkSyncAugurNodeWithBlockchain(db: Knex, augur: Augur): Promise<number> {
  const row: HighestBlockNumberRow|null = await db("blocks").max("blockNumber as highestBlockNumber").first();
  const lastSyncBlockNumber: number|null|undefined = row!.highestBlockNumber;
  const uploadBlockNumber: number = augur.contracts.uploadBlockNumbers[augur.rpc.getNetworkID()] || 0;
  const highestBlockNumber: number = parseInt(augur.rpc.getCurrentBlock().number, 16);
  let fromBlock: number;
  if (uploadBlockNumber > highestBlockNumber) {
    logger.info(`Synchronization started at (${uploadBlockNumber}), which exceeds the current block from the ethereum node (${highestBlockNumber}), starting from 0 instead`);
    fromBlock = 0;
  } else {
    fromBlock = lastSyncBlockNumber == null ? uploadBlockNumber : lastSyncBlockNumber + 1;
  }
  let handoffBlockNumber = highestBlockNumber - BLOCKSTREAM_HANDOFF_BLOCKS;
  if (handoffBlockNumber < fromBlock) {
    handoffBlockNumber = fromBlock;
    if (handoffBlockNumber > highestBlockNumber) {
      throw new Error(`Not enough blocks to start blockstream reliably, wait at least ${BLOCKSTREAM_HANDOFF_BLOCKS} from ${fromBlock}. Current Block: ${highestBlockNumber}`);
    }
    logger.warn(`Not leaving at least ${BLOCKSTREAM_HANDOFF_BLOCKS} between batch download and blockstream hand off during re-org can cause data quality issues`);
  }
  await promisify(downloadAugurLogs)(db, augur, fromBlock, handoffBlockNumber);
  setSyncFinished();
  await db.insert({ highestBlockNumber }).into("blockchain_sync_history");
  await saveBulkSyncDatabase(augur.rpc.getNetworkID());
  logger.info(`Finished batch load from ${fromBlock} to ${handoffBlockNumber}`);
  return handoffBlockNumber;
}
