import Augur from "augur.js";
import * as Knex from "knex";
import { logError } from "../utils/log-error";
import { BlocksRow } from "../types";

export function processBlock(db: Knex, augur: Augur, blockNumberString: string): void {
  augur.rpc.eth.getBlockByNumber([blockNumberString, false], (block: any): void => {
    if (!block || block.error || !block.timestamp) return logError(new Error(JSON.stringify(block)));
    const blockNumber = parseInt(blockNumberString, 16);
    const timestamp = parseInt(block.timestamp, 16);
    console.log("new block:", blockNumber, timestamp);
    db.transaction((trx: Knex.Transaction): void => {
      trx("blocks").where({ blockNumber }).asCallback((err: Error|null, blocksRows?: Array<BlocksRow>): void => {
        if (err) return logError(err);
        let query: Knex.QueryBuilder;
        if (!blocksRows || !blocksRows.length) {
          query = db.transacting(trx).insert({ blockNumber, timestamp }).into("blocks");
        } else {
          query = db("blocks").transacting(trx).where({ blockNumber }).update({ timestamp });
        }
        query.asCallback((err: Error|null): void => {
          if (err) {
            trx.rollback();
            logError(err);
          } else {
            trx.commit();
          }
        });
      });
    });
  });
}

export function processBlockRemoval(db: Knex, blockNumberString: string): void {
  const blockNumber = parseInt(blockNumberString, 16);
  console.log("block removed:", blockNumber);
  db.transaction((trx: Knex.Transaction): void => {
    db("blocks").transacting(trx).where({ blockNumber }).del().asCallback((err: Error|null): void => {
      if (err) {
        trx.rollback();
        logError(err);
      } else {
        trx.commit();
      }
    });
  });
}
