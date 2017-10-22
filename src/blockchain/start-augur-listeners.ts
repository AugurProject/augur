import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog } from "../types";
import { logProcessors } from "./log-processors";
import { makeLogListener } from "./make-log-listener";
import { onNewBlock } from "./on-new-block";
import { logError } from "../utils/log-error";

export function startAugurListeners(db: Knex, augur: Augur, callback: (blockNumber: string) => void): void {
  let seenFirstBlock: boolean = false;
  augur.events.startListeners({
    Augur: {
      MarketCreated: makeLogListener(db, augur, "Augur", "MarketCreated"),
      TokensTransferred: makeLogListener(db, augur, "Augur", "TokensTransferred"),
      OrderCanceled: makeLogListener(db, augur, "Augur", "OrderCanceled"),
      OrderCreated: makeLogListener(db, augur, "Augur", "OrderCreated"),
      OrderFilled: makeLogListener(db, augur, "Augur", "OrderFilled"),
      ProceedsClaimed: makeLogListener(db, augur, "Augur", "ProceedsClaimed"),
      DesignatedReportSubmitted: makeLogListener(db, augur, "Augur", "DesignatedReportSubmitted"),
      ReportSubmitted: makeLogListener(db, augur, "Augur", "ReportSubmitted"),
      WinningTokensRedeemed: makeLogListener(db, augur, "Augur", "WinningTokensRedeemed"),
      ReportsDisputed: makeLogListener(db, augur, "Augur", "ReportsDisputed"),
      MarketFinalized: makeLogListener(db, augur, "Augur", "MarketFinalized"),
      UniverseForked: makeLogListener(db, augur, "Augur", "UniverseForked"),
    },
    LegacyRepContract: {
      Transfer: makeLogListener(db, augur, "LegacyRepContract", "Transfer"),
      Approval: makeLogListener(db, augur, "LegacyRepContract", "Approval"),
    },
  }, (blockNumber: string): void => {
    if (!seenFirstBlock) {
      callback(blockNumber);
      seenFirstBlock = true;
    }
    onNewBlock(db, augur, blockNumber);
  }, (): void => {});
}
