import Augur = require("augur.js");
import { Database } from "sqlite3";
import { FormattedLog } from "../types";
import { logProcessors } from "./log-processors";
import { logError } from "../utils/log-error";

export function startAugurListeners(db: Database, augur: Augur, callback: () => void): void {
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
      db.run(`INSERT OR REPLACE INTO blocks (block_number, block_timestamp) VALUES (?, ?)`, dataToInsertOrReplace, logError);
    });
  }, callback);
}
