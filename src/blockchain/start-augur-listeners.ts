import Augur = require("augur.js");
import { Database } from "sqlite3";
import { makeLogListener } from "./make-log-listener";
import { onNewBlock } from "./on-new-block";
import { logError } from "../utils/log-error";

export function startAugurListeners(db: Database, augur: Augur, callback: () => void): void {
  augur.events.startListeners({
    Augur: {
      MarketCreated: makeLogListener(db, "Augur", "MarketCreated"),
      TokensTransferred: makeLogListener(db, "Augur", "TokensTransferred"),
      OrderCanceled: makeLogListener(db, "Augur", "OrderCanceled"),
      OrderCreated: makeLogListener(db, "Augur", "OrderCreated"),
      OrderFilled: makeLogListener(db, "Augur", "OrderFilled"),
      ProceedsClaimed: makeLogListener(db, "Augur", "ProceedsClaimed"),
      ReporterRegistered: makeLogListener(db, "Augur", "ReporterRegistered"),
      DesignatedReportSubmitted: makeLogListener(db, "Augur", "DesignatedReportSubmitted"),
      ReportSubmitted: makeLogListener(db, "Augur", "ReportSubmitted"),
      WinningTokensRedeemed: makeLogListener(db, "Augur", "WinningTokensRedeemed"),
      ReportsDisputed: makeLogListener(db, "Augur", "ReportsDisputed"),
      MarketFinalized: makeLogListener(db, "Augur", "MarketFinalized"),
      UniverseForked: makeLogListener(db, "Augur", "UniverseForked")
    },
    LegacyRepContract: {
      Transfer: makeLogListener(db, "LegacyRepContract", "Transfer"),
      Approval: makeLogListener(db, "LegacyRepContract", "Approval")
    }
  }, (blockNumber: string): void => onNewBlock(db, augur, blockNumber), callback);
}
