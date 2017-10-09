import Augur = require("augur.js");
import * as Knex from "knex";
import { FormattedLog } from "../types";
import { logProcessors } from "./log-processors";
import { makeLogListener } from "./make-log-listener";
import { onNewBlock } from "./on-new-block";
import { logError } from "../utils/log-error";

export function startAugurListeners(db: Knex, trx: Knex.Transaction, augur: Augur, callback: () => void): void {
  augur.events.startListeners({
    Augur: {
      MarketCreated: makeLogListener(db, trx, "Augur", "MarketCreated"),
      TokensTransferred: makeLogListener(db, trx, "Augur", "TokensTransferred"),
      OrderCanceled: makeLogListener(db, trx, "Augur", "OrderCanceled"),
      OrderCreated: makeLogListener(db, trx, "Augur", "OrderCreated"),
      OrderFilled: makeLogListener(db, trx, "Augur", "OrderFilled"),
      ProceedsClaimed: makeLogListener(db, trx, "Augur", "ProceedsClaimed"),
      ReporterRegistered: makeLogListener(db, trx, "Augur", "ReporterRegistered"),
      DesignatedReportSubmitted: makeLogListener(db, trx, "Augur", "DesignatedReportSubmitted"),
      ReportSubmitted: makeLogListener(db, trx, "Augur", "ReportSubmitted"),
      WinningTokensRedeemed: makeLogListener(db, trx, "Augur", "WinningTokensRedeemed"),
      ReportsDisputed: makeLogListener(db, trx, "Augur", "ReportsDisputed"),
      MarketFinalized: makeLogListener(db, trx, "Augur", "MarketFinalized"),
      UniverseForked: makeLogListener(db, trx, "Augur", "UniverseForked")
    },
    LegacyRepContract: {
      Transfer: makeLogListener(db, trx, "LegacyRepContract", "Transfer"),
      Approval: makeLogListener(db, trx, "LegacyRepContract", "Approval")
    }
  }, (blockNumber: string): void => onNewBlock(db, trx, augur, blockNumber), callback);
}
