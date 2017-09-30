import { AugurJs, SqlLiteDb, FormattedLog } from "./types";
import { logProcessors } from "./log-processors";
import { logError } from "./log-error";

export function startAugurListeners(db: SqlLiteDb, augur: AugurJs, callback: () => void): void {
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
