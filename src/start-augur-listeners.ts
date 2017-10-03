import Augur = require("augur.js");
import { Database } from "sqlite3";
import { FormattedLog } from "./types";
import { logProcessors } from "./log-processors";
import { logError } from "./log-error";

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
  }, (blockNumber: string) => console.log("new block received:", parseInt(blockNumber, 16)), callback);
}
