import Augur from "augur.js";
import { parallel } from "async";
import * as Knex from "knex";
import { each } from "async";
import { logError } from "../utils/log-error";
import { Block, BlocksRow, AsyncCallback, ErrorCallback } from "../types";
import { updateMarketState } from "./log-processors/database";

function advanceTime(db: Knex, augur: Augur, trx: Knex.Transaction, blockNumber: number, timestamp: number, callback: AsyncCallback) {
  parallel( {
    advanceMarketReachingEndTime: (next: AsyncCallback) => advanceMarketReachingEndTime(db, augur, trx, blockNumber, timestamp, next),
  }, callback);
}

function advanceMarketReachingEndTime(db: Knex, augur: Augur, trx: Knex.Transaction, blockNumber: number, timestamp: number, callback: AsyncCallback) {
  const designatedDisputeQuery = db("markets").transacting(trx).select("markets.marketID").join("market_state", "market_state.marketStateID", "markets.marketStateID");
  designatedDisputeQuery.where("reportingState", augur.constants.REPORTING_STATE.PRE_REPORTING).where("endTime", ">", timestamp);
  designatedDisputeQuery.asCallback( (err: Error|null, designatedDisputeMarketIDs: Array<any> ) => {
    if (err) return callback(err);
    each(designatedDisputeMarketIDs, (marketIDRow, nextMarketID: ErrorCallback) => {
      updateMarketState(db, marketIDRow.marketID, trx, blockNumber, augur.constants.REPORTING_STATE.DESIGNATED_REPORTING, nextMarketID);
    }, callback);
  });
}

export function processBlock(db: Knex, augur: Augur, block: Block): void {
  if (!block || !block.timestamp) return logError(new Error(JSON.stringify(block)));
  const blockNumber = parseInt(block.number, 16);
  const blockHash = block.hash;
  const timestamp = parseInt(block.timestamp, 16);
  console.log("new block:", blockNumber, timestamp);
  db.transaction((trx: Knex.Transaction): void => {
    trx("blocks").where({ blockNumber }).asCallback((err: Error|null, blocksRows?: Array<BlocksRow>): void => {
      if (err) {
        trx.rollback();
        return logError(err);
      }
      let query: Knex.QueryBuilder;
      if (!blocksRows || !blocksRows.length) {
        query = db.transacting(trx).insert({ blockNumber, blockHash, timestamp }).into("blocks");
      } else {
        query = db("blocks").transacting(trx).where({ blockNumber }).update({ blockHash, timestamp });
      }
      query.asCallback((err: Error|null): void => {
        if (err) {
          trx.rollback(err);
          logError(err);
        } else {
          advanceTime(db, augur, trx, blockNumber, timestamp, (err: Error|null) => {
            if (err != null) {
              trx.rollback(err);
              logError(err);
            } else {
              trx.commit();
              console.log("finished block:", blockNumber, timestamp);
            }
          });
        }
      });
    });
  });
}

export function processBlockByNumber(db: Knex, augur: Augur, blockNumber: number): void {
  augur.rpc.eth.getBlockByNumber([blockNumber, false], (block: Block): void => {
    processBlock(db, augur, block);
  });
}

export function processBlockRemoval(db: Knex, block: Block): void {
  const blockNumber = parseInt(block.number, 16);
  console.log("block removed:", blockNumber);
  db.transaction((trx: Knex.Transaction): void => {
    db("blocks").transacting(trx).where({ blockNumber }).del().asCallback((err: Error|null): void => {
      if (err) {
        trx.rollback(err);
        logError(err);
      } else {
        trx.commit();
      }
    });
  });
}
