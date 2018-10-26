import Augur from "augur.js";
import * as Knex from "knex";
import { each } from "bluebird";
import { augurEmitter } from "../events";
import { BlockDetail, BlocksRow, ErrorCallback, MarketsContractAddressRow, ReportingState, Address, FeeWindowState } from "../types";
import { updateActiveFeeWindows, updateMarketState } from "./log-processors/database";
import { processQueue, logQueueProcess } from "./process-queue";
import { getMarketsWithReportingState } from "../server/getters/database";
import { logger } from "../utils/logger";
import { SubscriptionEventNames } from "../constants";

interface MarketIdUniverseFeeWindow extends MarketsContractAddressRow {
  universe: Address;
  feeWindow: Address;
}

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

export function getOverrideTimestamp(): number|null {
  if (overrideTimestamps.length === 0) return null;
  return overrideTimestamps[overrideTimestamps.length - 1];
}

export function clearOverrideTimestamp(): void {
  overrideTimestamps.splice(0, overrideTimestamps.length);
  blockHeadTimestamp = 0;
}

async function processBlockDetailsAndLogs(db: Knex, augur: Augur, block: BlockDetail) {
  if (!block || !block.timestamp) throw new Error(JSON.stringify(block));
  const dbWrites = logQueueProcess(block.hash);
  db.transaction(async (trx: Knex.Transaction) => {
    await processBlockByBlockDetails(trx, augur, block);
    await dbWrites(db);
  });
}

export function processBlock(db: Knex, augur: Augur, block: BlockDetail, callback: ErrorCallback): void {
  processQueue.push((next) => processBlockDetailsAndLogs(db, augur, block).then(() => next(null)).catch(callback));
}

export function processBlockRemoval(db: Knex, block: BlockDetail, callback: ErrorCallback): void {
  processQueue.push((next) => _processBlockRemoval(db, block).then(() => next(null)).catch(callback));
}

export function processBlockByNumber(db: Knex, augur: Augur, blockNumber: number, callback: ErrorCallback): void {
  augur.rpc.eth.getBlockByNumber([blockNumber, false], async (err: Error|null, block: BlockDetail) => {
    if (err) return callback(err);
    try {
      await processBlockByBlockDetails(db, augur, block);
    } catch (err) {
      return callback(err);
    }
    callback(null);
  });
}

async function insertBlockRow(db: Knex, blockNumber: number, blockHash: string, timestamp: number) {
  const blocksRows: Array<BlocksRow> = await db("blocks").where({ blockNumber });
  let query: Knex.QueryBuilder;
  if (!blocksRows || !blocksRows.length) {
    query = db.insert({ blockNumber, blockHash, timestamp }).into("blocks");
  } else {
    query = db("blocks").where({ blockNumber }).update({ blockHash, timestamp });
  }
  return query;
}

export async function processBlockByBlockDetails(db: Knex, augur: Augur, block: BlockDetail) {
  if (!block || !block.timestamp) throw new Error(JSON.stringify(block));
  const blockNumber = parseInt(block.number, 16);
  const blockHash = block.hash;
  blockHeadTimestamp = parseInt(block.timestamp, 16);
  const timestamp = getOverrideTimestamp() || blockHeadTimestamp;
  logger.info("new block:", `${blockNumber}, ${timestamp} (${(new Date(timestamp * 1000)).toString()})`);
  await insertBlockRow(db, blockNumber, blockHash, timestamp);
  await advanceTime(db, augur, blockNumber, timestamp);
}

async function _processBlockRemoval(db: Knex, block: BlockDetail) {
  const blockNumber = parseInt(block.number, 16);
  logger.info("block removed:", `${blockNumber}`);
  const dbWrites = logQueueProcess(block.hash);
  db.transaction(async (trx: Knex.Transaction) => {
    // TODO: un-advance time
    await db("blocks").transacting(trx).where({ blockNumber }).del();
    await dbWrites(trx);
  });
}

async function advanceTime(db: Knex, augur: Augur, blockNumber: number, timestamp: number) {
  await advanceMarketReachingEndTime(db, augur, blockNumber, timestamp);
  await advanceMarketMissingDesignatedReport(db, augur, blockNumber, timestamp);
  await advanceFeeWindowActive(db, augur, blockNumber, timestamp);
}

async function advanceMarketReachingEndTime(db: Knex, augur: Augur, blockNumber: number, timestamp: number) {
  const networkId: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkId].Universe;
  const designatedDisputeQuery = db("markets").select("markets.marketId").join("market_state", "market_state.marketStateId", "markets.marketStateId");
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

async function advanceMarketsToAwaitingFinalization(db: Knex, augur: Augur, blockNumber: number, expiredFeeWindows: Array<Address>) {
  const marketIds: Array<{ marketId: Address; universe: Address; }> = await getMarketsWithReportingState(db, ["markets.marketId", "markets.universe"])
    .join("universes", "markets.universe", "universes.universe")
    .where("universes.forked", 0)
    .whereIn("markets.feeWindow", expiredFeeWindows)
    .whereNot("markets.needsMigration", 1)
    .whereNot("markets.forking", 1);

  await each(marketIds, async (marketIdRow) => {
    await updateMarketState(db, marketIdRow.marketId, blockNumber, ReportingState.AWAITING_FINALIZATION);
    augurEmitter.emit(SubscriptionEventNames.MarketState, {
      universe: marketIdRow.universe,
      marketId: marketIdRow.marketId,
      reportingState: ReportingState.AWAITING_FINALIZATION,
    });
    return db("payouts").where({ marketId: marketIdRow.marketId }).update("winning", db.raw(`"tentativeWinning"`));
  });
}

export async function advanceFeeWindowActive(db: Knex, augur: Augur, blockNumber: number, timestamp: number) {
  const feeWindowModifications = await updateActiveFeeWindows(db, blockNumber, timestamp);
  if (feeWindowModifications != null && feeWindowModifications.expiredFeeWindows.length === 0 && feeWindowModifications.newActiveFeeWindows.length === 0) return;
  await advanceIncompleteCrowdsourcers(db, blockNumber, feeWindowModifications!.expiredFeeWindows || []);
  await advanceMarketsToAwaitingFinalization(db, augur, blockNumber, feeWindowModifications!.expiredFeeWindows || []);
  await advanceMarketsToCrowdsourcingDispute(db, augur, blockNumber, feeWindowModifications!.newActiveFeeWindows || []);
}

async function advanceMarketsToCrowdsourcingDispute(db: Knex, augur: Augur, blockNumber: number, newActiveFeeWindows: Array<Address>) {
  const marketIds: Array<MarketIdUniverseFeeWindow> = await getMarketsWithReportingState(db, ["markets.marketId", "markets.universe", "activeFeeWindow.feeWindow"])
    .join("universes", "markets.universe", "universes.universe")
    .join("fee_windows as activeFeeWindow", "activeFeeWindow.universe", "markets.universe")
    .whereIn("markets.feeWindow", newActiveFeeWindows)
    .where("activeFeeWindow.state", FeeWindowState.CURRENT)
    .where("reportingState", ReportingState.AWAITING_NEXT_WINDOW)
    .where("universes.forked", 0);

  await each(marketIds, async (marketIdRow) => {
    augurEmitter.emit(SubscriptionEventNames.MarketState, {
      universe: marketIdRow.universe,
      feeWindow: marketIdRow.feeWindow,
      marketId: marketIdRow.marketId,
      reportingState: ReportingState.CROWDSOURCING_DISPUTE,
    });
    return updateMarketState(db, marketIdRow.marketId, blockNumber, ReportingState.CROWDSOURCING_DISPUTE);
  });
}

async function advanceIncompleteCrowdsourcers(db: Knex, blockNumber: number, expiredFeeWindows: Array<Address>) {
  // Finds crowdsourcers rows that we don't know the completion of, but are attached to feeWindows that have ended
  // They did not reach their goal, so set completed to 0.
  return db("crowdsourcers").update("completed", 0)
    .whereNull("completed")
    .whereIn("feeWindow", expiredFeeWindows);
}
