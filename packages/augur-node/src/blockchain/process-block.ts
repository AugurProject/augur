import * as _ from "lodash";
import * as Knex from "knex";
import { each } from "bluebird";
import Augur, { FormattedEventLog } from "augur.js";
import { augurEmitter } from "../events";
import { BlockDetail, BlocksRow, MarketsContractAddressRow, ReportingState, Address, DisputeWindowState, MarketIdUniverseDisputeWindow, TransactionHashesRow } from "../types";
import { getPouchRevFromId, updateActiveDisputeWindows, updateMarketState } from "./log-processors/database";
import { getMarketsWithReportingState } from "../server/getters/database";
import { logger } from "../utils/logger";
import { SubscriptionEventNames, DB_VERSION, DB_FILE, DB_WARP_SYNC_FILE, DUMP_EVERY_BLOCKS } from "../constants";
import { processLogByName } from "./process-logs";
import { BackupRestore } from "../sync/backup-restore";
import { checkOrphanedOrders } from "./check-orphaned-orders";

export type BlockDirection = "add" | "remove";

const overrideTimestamps = Array<number>();
let blockHeadTimestamp: number = 0;

export function getCurrentTime(): number {
  return getOverrideTimestamp() || blockHeadTimestamp;
}

export async function setOverrideTimestamp(db: Knex, overrideTimestamp: number) {
  overrideTimestamps.push(overrideTimestamp);
  return db("network_id").update("overrideTimestamp", overrideTimestamp);
}

export async function removeOverrideTimestamp(db: Knex, overrideTimestamp: number) {
  const removedTimestamp = overrideTimestamps.pop();
  const priorTimestamp = getOverrideTimestamp();
  if (removedTimestamp !== overrideTimestamp || priorTimestamp == null) {
    throw new Error(`Timestamp removal failed ${removedTimestamp} ${overrideTimestamp}`);
  }
  return db("network_id").update("overrideTimestamp", priorTimestamp);
}

export function getOverrideTimestamp(): number | null {
  if (overrideTimestamps.length === 0) return null;
  return overrideTimestamps[overrideTimestamps.length - 1];
}

export function clearOverrideTimestamp(): void {
  overrideTimestamps.splice(0, overrideTimestamps.length);
  blockHeadTimestamp = 0;
}

export async function processBlockAndLogs(db: Knex, pouch: PouchDB.Database, augur: Augur, direction: BlockDirection, block: BlockDetail, bulkSync: boolean, logs: Array<FormattedEventLog>, databaseDir: string, isWarpSync: boolean) {
  if (!block || !block.timestamp) throw new Error(JSON.stringify(block));
  const dbWritePromises = _.compact(logs.map((log) => processLogByName(augur, log, true)));
  const dbWriteFunctions = await Promise.all(dbWritePromises);
  const dbWritesFunction = async (db: Knex) => {
    if (dbWriteFunctions.length > 0) logger.info(`Processing ${dbWritePromises.length} logs`);
    for (const dbWriteFunction of dbWriteFunctions) {
      if (dbWriteFunction != null) await dbWriteFunction(db);
    }
  };
  await db.transaction(async (trx: Knex.Transaction) => {
    if (direction === "add") {
      await processBlockByBlockDetails(trx, augur, block, bulkSync);
      await dbWritesFunction(trx);
      await pouchUpsertBlockRow(pouch, block, logs, false);
    } else {
      logger.info(`block removed: ${parseInt(block.number, 16)} (${block.hash})`);
      await dbWritesFunction(trx);
      await db("transactionHashes")
        .transacting(trx)
        .where({ blockNumber: block.number })
        .update({ removed: 1 });
      await db("blocks")
        .transacting(trx)
        .where({ blockHash: block.hash })
        .del();
      // TODO: un-advance time
    }
  });
  await checkOrphanedOrders(db, augur);
  try {
    if (isWarpSync && parseInt(block.number, 16) % DUMP_EVERY_BLOCKS === 0) {
      // every X blocks export db to warp file.
      const networkId: string = augur.rpc.getNetworkID();
      await BackupRestore.export(DB_FILE, networkId, DB_VERSION, DB_WARP_SYNC_FILE, databaseDir);
    }
  } catch (err) {
    logger.error("ERROR: could not create warp sync file");
  }

}

async function insertBlockRow(db: Knex, blockNumber: number, blockHash: string, bulkSync: boolean, timestamp: number) {
  const blocksRows: Array<BlocksRow> = await db("blocks").where({ blockNumber });
  let query: Knex.QueryBuilder;
  if (!blocksRows || !blocksRows.length) {
    query = db.insert({ blockNumber, blockHash, timestamp, bulkSync }).into("blocks");
  } else {
    query = db("blocks")
      .where({ blockNumber })
      .update({ blockHash, timestamp, bulkSync });
  }
  return query;
}

export async function pouchUpsert(pouch: PouchDB.Database, id: string, document: object) {
  const previousBlockRev = await getPouchRevFromId(pouch, id);
  return pouch.put(Object.assign(
    previousBlockRev ? { _rev: previousBlockRev } : {},
    { _id: id },
    document,
  ));
}

export async function pouchUpsertBlockRow(pouch: PouchDB.Database, blockDetail: BlockDetail, logs: Array<FormattedEventLog>, bulkSync: boolean) {
  const newBlockRow = Object.assign(
    blockDetail,
    { logs, bulkSync },
  );
  return pouchUpsert(pouch, blockDetail.number, newBlockRow);
}

export async function processBlockByBlockDetails(db: Knex, augur: Augur, block: BlockDetail, bulkSync: boolean) {
  if (!block || !block.timestamp) throw new Error(JSON.stringify(block));
  const blockNumber = parseInt(block.number, 16);
  const blockHash = block.hash;
  blockHeadTimestamp = parseInt(block.timestamp, 16);
  const timestamp = getOverrideTimestamp() || blockHeadTimestamp;
  logger.info("new block:", `${blockNumber}, ${timestamp} (${new Date(timestamp * 1000).toString()})`);
  await insertBlockRow(db, blockNumber, blockHash, bulkSync, timestamp);
  await advanceTime(db, augur, blockNumber, timestamp);
}

export async function insertTransactionHash(db: Knex, blockNumber: number, transactionHash: string) {
  if (transactionHash === null) throw new Error("Received null transactionHash from getLogs request. Your Ethereum node might be in light mode with bug: https://github.com/paritytech/parity-ethereum/issues/9929");
  const txHashRows: Array<TransactionHashesRow> = await db("transactionHashes").where({ transactionHash });
  if (!txHashRows || !txHashRows.length) {
    await db.insert({ blockNumber, transactionHash }).into("transactionHashes");
  }
}

async function advanceTime(db: Knex, augur: Augur, blockNumber: number, timestamp: number) {
  await advanceMarketReachingEndTime(db, augur, blockNumber, timestamp);
  await advanceMarketMissingDesignatedReport(db, augur, blockNumber, timestamp);
  await advanceDisputeWindowActive(db, augur, blockNumber, timestamp);
}

async function advanceMarketReachingEndTime(db: Knex, augur: Augur, blockNumber: number, timestamp: number) {
  const networkId: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkId].Universe;
  const designatedDisputeQuery = db("markets")
    .select("markets.marketId")
    .join("market_state", "market_state.marketStateId", "markets.marketStateId");
  designatedDisputeQuery.where("reportingState", augur.constants.REPORTING_STATE.PRE_REPORTING).where("endTime", "<", timestamp);
  const designatedDisputeMarketIds: Array<MarketsContractAddressRow> = await designatedDisputeQuery;
  await each(designatedDisputeMarketIds, async (marketIdRow) => {
    await updateMarketState(db, marketIdRow.marketId, blockNumber, augur.constants.REPORTING_STATE.DESIGNATED_REPORTING);
    augurEmitter.emit(SubscriptionEventNames.MarketState, {
      universe,
      marketId: marketIdRow.marketId,
      reportingState: augur.constants.REPORTING_STATE.DESIGNATED_REPORTING,
    });
  });
}

async function advanceMarketMissingDesignatedReport(db: Knex, augur: Augur, blockNumber: number, timestamp: number) {
  const networkId: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkId].Universe;
  const marketsMissingDesignatedReport = getMarketsWithReportingState(db, ["markets.marketId"])
    .where("endTime", "<", timestamp - augur.constants.CONTRACT_INTERVAL.DESIGNATED_REPORTING_DURATION_SECONDS)
    .where("reportingState", augur.constants.REPORTING_STATE.DESIGNATED_REPORTING);
  const marketAddressRows: Array<MarketsContractAddressRow> = await marketsMissingDesignatedReport;
  await each(marketAddressRows, async (marketIdRow) => {
    await updateMarketState(db, marketIdRow.marketId, blockNumber, augur.constants.REPORTING_STATE.OPEN_REPORTING);
    augurEmitter.emit(SubscriptionEventNames.MarketState, {
      universe,
      marketId: marketIdRow.marketId,
      reportingState: augur.constants.REPORTING_STATE.OPEN_REPORTING,
    });
  });
}

async function advanceMarketsToAwaitingFinalization(db: Knex, augur: Augur, blockNumber: number, expiredDisputeWindows: Array<Address>) {
  const marketIds: Array<{ marketId: Address; universe: Address; }> = await getMarketsWithReportingState(db, ["markets.marketId", "markets.universe"])
    .join("universes", "markets.universe", "universes.universe")
    .where("universes.forked", 0)
    .whereIn("markets.disputeWindow", expiredDisputeWindows)
    .whereNot("markets.needsMigration", 1)
    .whereNot("markets.forking", 1);

  await each(marketIds, async (marketIdRow) => {
    await updateMarketState(db, marketIdRow.marketId, blockNumber, ReportingState.AWAITING_FINALIZATION);
    augurEmitter.emit(SubscriptionEventNames.MarketState, {
      universe: marketIdRow.universe,
      marketId: marketIdRow.marketId,
      reportingState: ReportingState.AWAITING_FINALIZATION,
    });
    return db("payouts")
      .where({ marketId: marketIdRow.marketId })
      .update("winning", db.raw(`"tentativeWinning"`));
  });
}

export async function advanceDisputeWindowActive(db: Knex, augur: Augur, blockNumber: number, timestamp: number) {
  const disputeWindowModifications = await updateActiveDisputeWindows(db, blockNumber, timestamp);
  if (disputeWindowModifications != null && disputeWindowModifications.expiredDisputeWindows.length === 0 && disputeWindowModifications.newActiveDisputeWindows.length === 0) return;
  await advanceIncompleteCrowdsourcers(db, blockNumber, disputeWindowModifications!.expiredDisputeWindows || []);
  await advanceMarketsToAwaitingFinalization(db, augur, blockNumber, disputeWindowModifications!.expiredDisputeWindows || []);
  await advanceMarketsToCrowdsourcingDispute(db, augur, blockNumber, disputeWindowModifications!.newActiveDisputeWindows || []);
}

async function advanceMarketsToCrowdsourcingDispute(db: Knex, augur: Augur, blockNumber: number, newActiveDisputeWindows: Array<Address>) {
  const marketIds: Array<MarketIdUniverseDisputeWindow> = await getMarketsWithReportingState(db, ["markets.marketId", "markets.universe", "activeDisputeWindow.disputeWindow"])
    .join("universes", "markets.universe", "universes.universe")
    .join("dispute_windows as activeDisputeWindow", "activeDisputeWindow.universe", "markets.universe")
    .whereIn("markets.disputeWindow", newActiveDisputeWindows)
    .where("activeDisputeWindow.state", DisputeWindowState.CURRENT)
    .where("reportingState", ReportingState.AWAITING_NEXT_WINDOW)
    .where("universes.forked", 0);

  await each(marketIds, async (marketIdRow) => {
    augurEmitter.emit(SubscriptionEventNames.MarketState, {
      universe: marketIdRow.universe,
      disputeWindow: marketIdRow.disputeWindow,
      marketId: marketIdRow.marketId,
      reportingState: ReportingState.CROWDSOURCING_DISPUTE,
    });
    return updateMarketState(db, marketIdRow.marketId, blockNumber, ReportingState.CROWDSOURCING_DISPUTE);
  });
}

async function advanceIncompleteCrowdsourcers(db: Knex, blockNumber: number, expiredDisputeWindows: Array<Address>) {
  // Finds crowdsourcers rows that we don't know the completion of, but are attached to disputeWindows that have ended
  // They did not reach their goal, so set completed to 0.
  return db("crowdsourcers")
    .update("completed", 0)
    .whereNull("completed")
    .whereIn("disputeWindow", expiredDisputeWindows);
}
