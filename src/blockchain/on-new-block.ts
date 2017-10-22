import Augur from "augur.js";
import * as Knex from "knex";
import { logError } from "../utils/log-error";
import { BlocksRow } from "../types";

export function onNewBlock(db: Knex, augur: Augur, blockNumberString: string) {
  augur.rpc.eth.getBlockByNumber([blockNumberString, false], (block: any): void => {
    if (!block || block.error || !block.timestamp) return logError(new Error(JSON.stringify(block)));
    const blockNumber: number = parseInt(blockNumberString, 16);
    const blockTimestamp: number = parseInt(block.timestamp, 16);
    console.log("new block:", blockNumber, blockTimestamp);
    db.transaction((trx) => {
      let query: Knex.Raw|null = null;
      switch (db.client.config.client) {
        case "pg":
          query = trx.raw(`INSERT INTO blocks ("blockNumber", "blockTimestamp") VALUES(?,?) ON CONFLICT ON CONSTRAINT blocks_pkey DO UPDATE SET "blockTimestamp" = ?`, [blockNumber, blockTimestamp, blockTimestamp]);
          break;
        case "sqlite3":
          query = trx.raw(`INSERT OR REPLACE INTO blocks ("blockNumber", "blockTimestamp") VALUES(?,?)`, [blockNumber, blockTimestamp]);
          break;
      }

      if (query === null) return logError(new Error("Using unsupported DBMS"));

      query.asCallback((err: Error | null, result?: any): void => {
        if (err) {
          trx.rollback();
          logError(err);
        } else {
          trx.commit();
          logError(null);
        }
      });
    });
  });
}
