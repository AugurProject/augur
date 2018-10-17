import Augur from "augur.js";
import { series } from "async";
import * as Knex from "knex";
import { each } from "async";
import { augurEmitter } from "../events";
import { BlockDetail, BlocksRow, AsyncCallback, ErrorCallback, MarketsContractAddressRow, ReportingState, Address, FeeWindowState } from "../types";
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

export function setOverrideTimestamp(db: Knex, overrideTimestamp: number, callback: ErrorCallback): void {
  overrideTimestamps.push(overrideTimestamp);
  db("network_id").update("overrideTimestamp", overrideTimestamp).asCallback(callback);
}

export function removeOverrideTimestamp(db: Knex, overrideTimestamp: number, callback: ErrorCallback): void {
  const removedTimestamp = overrideTimestamps.pop();
  const priorTimestamp = getOverrideTimestamp();
  if (removedTimestamp !== overrideTimestamp || priorTimestamp == null) {
    return callback(new Error(`Timestamp removal failed ${removedTimestamp} ${overrideTimestamp}`));
  }
  db("network_id").update("overrideTimestamp", priorTimestamp).asCallback(callback);
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
  db.transaction(async (trx: Knex.Transaction) => {
    await processBlockByBlockDetails(trx, augur, block);
    await logQueueProcess(trx, block.hash);
  });
}

export function processBlock(db: Knex, augur: Augur, block: BlockDetail, callback: ErrorCallback): void {
  processQueue.push((next) => processBlockDetailsAndLogs(db, augur, block).then(() => next(null)).catch(callback));
}

export function processBlockRemoval(db: Knex, block: BlockDetail, callback: ErrorCallback): void {
  processQueue.push((next) => _processBlockRemoval(db, block, (err: Error|null): void => {
    if (err) return callback(err);
    return next(null);
  }));
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

function _processBlockRemoval(db: Knex, block: BlockDetail, callback: ErrorCallback): void {
  const blockNumber = parseInt(block.number, 16);
  logger.info("block removed:", `${blockNumber}`);
  db.transaction(async (trx: Knex.Transaction) => {
    const blockHash = block.hash;
    try {
      await logQueueProcess(trx, blockHash);
      // TODO: un-advance time
      await db("blocks").transacting(trx).where({ blockNumber }).del();
    } catch (err) {
      trx.rollback(err);
      return callback(err);
    }
    trx.commit();
    return callback(null);
  });
}

function advanceTime(db: Knex, augur: Augur, blockNumber: number, timestamp: number) {
  return new Promise((resolve, reject) => {
    series([
      (next: AsyncCallback) => advanceMarketReachingEndTime(db, augur, blockNumber, timestamp, next),
      (next: AsyncCallback) => advanceMarketMissingDesignatedReport(db, augur, blockNumber, timestamp, next),
      (next: AsyncCallback) => advanceFeeWindowActive(db, augur, blockNumber, timestamp, next),
    ], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function advanceMarketReachingEndTime(db: Knex, augur: Augur, blockNumber: number, timestamp: number, callback: AsyncCallback) {
  const networkId: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkId].Universe;
  const designatedDisputeQuery = db("markets").select("markets.marketId").join("market_state", "market_state.marketStateId", "markets.marketStateId");
  designatedDisputeQuery.where("reportingState", augur.constants.REPORTING_STATE.PRE_REPORTING).where("endTime", "<", timestamp);
  designatedDisputeQuery.asCallback((err: Error|null, designatedDisputeMarketIds: Array<MarketsContractAddressRow>) => {
    if (err) return callback(err);
    each(designatedDisputeMarketIds, (marketIdRow, nextMarketId: ErrorCallback) => {
      updateMarketState(db, marketIdRow.marketId, blockNumber, augur.constants.REPORTING_STATE.DESIGNATED_REPORTING, (err: Error|null) => {
        if (err) return nextMarketId(err);
        augurEmitter.emit(SubscriptionEventNames.MarketState, {
          universe,
          marketId: marketIdRow.marketId,
          reportingState: augur.constants.REPORTING_STATE.DESIGNATED_REPORTING,
        });
        nextMarketId(null);
      });
    }, callback);
  });
}

function advanceMarketMissingDesignatedReport(db: Knex, augur: Augur, blockNumber: number, timestamp: number, callback: AsyncCallback) {
  const networkId: string = augur.rpc.getNetworkID();
  const universe: string = augur.contracts.addresses[networkId].Universe;
  const marketsMissingDesignatedReport = getMarketsWithReportingState(db, ["markets.marketId"])
    .where("endTime", "<", timestamp - augur.constants.CONTRACT_INTERVAL.DESIGNATED_REPORTING_DURATION_SECONDS)
    .where("reportingState", augur.constants.REPORTING_STATE.DESIGNATED_REPORTING);
  marketsMissingDesignatedReport.asCallback((err, marketAddressRows: Array<MarketsContractAddressRow>) => {
    if (err) return callback(err);
    each(marketAddressRows, (marketIdRow, nextMarketIdRow: ErrorCallback) => {
      updateMarketState(db, marketIdRow.marketId, blockNumber, augur.constants.REPORTING_STATE.OPEN_REPORTING, (err: Error|null) => {
        if (err) return callback(err);
        augurEmitter.emit(SubscriptionEventNames.MarketState, {
          universe,
          marketId: marketIdRow.marketId,
          reportingState: augur.constants.REPORTING_STATE.OPEN_REPORTING,
        });
        nextMarketIdRow(null);
      });
    }, callback);
  });
}

function advanceMarketsToAwaitingFinalization(db: Knex, augur: Augur, blockNumber: number, expiredFeeWindows: Array<Address>, callback: ErrorCallback) {
  getMarketsWithReportingState(db, ["markets.marketId", "markets.universe"])
    .join("universes", "markets.universe", "universes.universe")
    .where("universes.forked", 0)
    .whereIn("markets.feeWindow", expiredFeeWindows)
    .whereNot("markets.needsMigration", 1)
    .whereNot("markets.forking", 1)
    .asCallback((err: Error|null, marketIds: Array<{ marketId: Address; universe: Address; }>) => {
      if (err) return callback(err);
      each(marketIds, (marketIdRow, nextMarketIdRow: ErrorCallback) => {
        updateMarketState(db, marketIdRow.marketId, blockNumber, ReportingState.AWAITING_FINALIZATION, (err: Error|null) => {
          if (err) return callback(err);
          augurEmitter.emit(SubscriptionEventNames.MarketState, {
            universe: marketIdRow.universe,
            marketId: marketIdRow.marketId,
            reportingState: ReportingState.AWAITING_FINALIZATION,
          });
          db("payouts").where({ marketId: marketIdRow.marketId }).update("winning", db.raw(`"tentativeWinning"`)).asCallback(nextMarketIdRow);
        });
      }, callback);
    });
}

export function advanceFeeWindowActive(db: Knex, augur: Augur, blockNumber: number, timestamp: number, callback: AsyncCallback) {
  updateActiveFeeWindows(db, blockNumber, timestamp, (err, feeWindowModifications) => {
    if (err || (feeWindowModifications != null && feeWindowModifications.expiredFeeWindows.length === 0 && feeWindowModifications.newActiveFeeWindows.length === 0)) return callback(err);
    advanceIncompleteCrowdsourcers(db, blockNumber, feeWindowModifications!.expiredFeeWindows || [], (err: Error|null) => {
      if (err) return callback(err);
      advanceMarketsToAwaitingFinalization(db, augur, blockNumber, feeWindowModifications!.expiredFeeWindows || [], (err: Error|null) => {
        if (err) return callback(err);
        advanceMarketsToCrowdsourcingDispute(db, augur, blockNumber, feeWindowModifications!.newActiveFeeWindows || [], (err: Error|null) => {
          if (err) return callback(err);
          callback(null);
        });
      });
    });
  });
}

function advanceMarketsToCrowdsourcingDispute(db: Knex, augur: Augur, blockNumber: number, newActiveFeeWindows: Array<Address>, callback: AsyncCallback) {
  getMarketsWithReportingState(db, ["markets.marketId", "markets.universe", "activeFeeWindow.feeWindow"])
    .join("universes", "markets.universe", "universes.universe")
    .join("fee_windows as activeFeeWindow", "activeFeeWindow.universe", "markets.universe")
    .whereIn("markets.feeWindow", newActiveFeeWindows)
    .where("activeFeeWindow.state", FeeWindowState.CURRENT)
    .where("reportingState", ReportingState.AWAITING_NEXT_WINDOW)
    .where("universes.forked", 0)
    .asCallback((err: Error|null, marketIds: Array<MarketIdUniverseFeeWindow>) => {
      if (err) return callback(err);
      each(marketIds, (marketIdRow, nextMarketIdRow: ErrorCallback) => {
        augurEmitter.emit(SubscriptionEventNames.MarketState, {
          universe: marketIdRow.universe,
          feeWindow: marketIdRow.feeWindow,
          marketId: marketIdRow.marketId,
          reportingState: ReportingState.CROWDSOURCING_DISPUTE,
        });
        updateMarketState(db, marketIdRow.marketId, blockNumber, ReportingState.CROWDSOURCING_DISPUTE, nextMarketIdRow);
      }, callback);
    });
}

function advanceIncompleteCrowdsourcers(db: Knex, blockNumber: number, expiredFeeWindows: Array<Address>, callback: AsyncCallback) {
  // Finds crowdsourcers rows that we don't know the completion of, but are attached to feeWindows that have ended
  // They did not reach their goal, so set completed to 0.
  db("crowdsourcers").update("completed", 0)
    .whereNull("completed")
    .whereIn("feeWindow", expiredFeeWindows)
    .asCallback(callback);
}
