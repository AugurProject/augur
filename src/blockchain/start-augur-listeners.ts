import Augur = require("augur.js");
import * as Knex from "knex";
import { FormattedLog } from "../types";
import { logProcessors } from "./log-processors";
import { logError } from "../utils/log-error";

export function startAugurListeners(db: Knex, augur: Augur, callback: () => void): void {
  augur.filters.startListeners({
    Augur: {
      MarketCreated: (log: FormattedLog) => {
        console.log("MarketCreated", log);
        logProcessors.Augur.MarketCreated(db, log, logError);
      },
      TokensTransferred: (log: FormattedLog) => {
        console.log("TokensTransferred", log);
        logProcessors.Augur.TokensTransferred(db, log, logError);
      }
    }
  }, (blockNumber: string): void => {
    augur.rpc.eth.getBlockByNumber([blockNumber, false], (block: any): void => {
      if (!block || block.error || !block.timestamp) return logError(new Error(JSON.stringify(block)));
      console.log("new block received:", parseInt(blockNumber, 16), parseInt(block.timestamp, 16));
      const dataToInsertOrReplace: (string|number)[] = [parseInt(blockNumber, 16), parseInt(block.timestamp, 16)];
      db.insert({block_number: parseInt(blockNumber, 16), bloc_timestamp: parseInt(block.timestamp)})
        .into("block")
        .asCallback(logError);
    });
  }, callback);
}
