import Augur from "augur.js";
import * as Knex from "knex";
import { Int256, FormattedEventLog, Block } from "../types";
import { logProcessors } from "./log-processors";
import { makeLogListener } from "./make-log-listener";
import { processBlock, processBlockRemoval } from "./process-block";
import { logError } from "../utils/log-error";

export function startAugurListeners(db: Knex, augur: Augur, callback: (err: Error|null) => void): void {
  augur.events.startBlockListeners({
    onAdded: (block: Block): void => processBlock(db, augur, block),
    onRemoved: (block: Block): void => processBlockRemoval(db, block),
  });
  augur.events.startBlockchainEventListeners({
    Augur: {
      MarketCreated: makeLogListener(db, augur, "Augur", "MarketCreated"),
      TokensTransferred: makeLogListener(db, augur, "Augur", "TokensTransferred"),
      OrderCanceled: makeLogListener(db, augur, "Augur", "OrderCanceled"),
      OrderCreated: makeLogListener(db, augur, "Augur", "OrderCreated"),
      OrderFilled: makeLogListener(db, augur, "Augur", "OrderFilled"),
      TradingProceedsClaimed: makeLogListener(db, augur, "Augur", "TradingProceedsClaimed"),
      DesignatedReportSubmitted: makeLogListener(db, augur, "Augur", "DesignatedReportSubmitted"),
      ReportSubmitted: makeLogListener(db, augur, "Augur", "ReportSubmitted"),
      WinningTokensRedeemed: makeLogListener(db, augur, "Augur", "WinningTokensRedeemed"),
      ReportsDisputed: makeLogListener(db, augur, "Augur", "ReportsDisputed"),
      MarketFinalized: makeLogListener(db, augur, "Augur", "MarketFinalized"),
      UniverseForked: makeLogListener(db, augur, "Augur", "UniverseForked"),
    },
    LegacyReputationToken: {
      Transfer: makeLogListener(db, augur, "LegacyReputationToken", "Transfer"),
      Approval: makeLogListener(db, augur, "LegacyReputationToken", "Approval"),
    },
  }, callback);
}
