import Augur from "augur.js";
import * as Knex from "knex";
import { BlockDetail } from "../types";
import { makeLogListener } from "./make-log-listener";
import { processBlock, processBlockRemoval } from "./process-block";

export function startAugurListeners(db: Knex, augur: Augur, highestBlockNumber: number): void {
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
      feeWindowCreated: makeLogListener(db, augur, "Augur", "FeeWindowCreated"),
      UniverseForked: makeLogListener(db, augur, "Augur", "UniverseForked"),
      TimestampSet: makeLogListener(db, augur, "Augur", "TimestampSet"),
    },
    LegacyReputationToken: {
      Transfer: makeLogListener(db, augur, "LegacyReputationToken", "Transfer"),
      Approval: makeLogListener(db, augur, "LegacyReputationToken", "Approval"),
    },
  }, highestBlockNumber, (err: Error) => {
    augur.events.startBlockListeners({
      onAdded: (block: BlockDetail): void => processBlock(db, augur, block),
      onRemoved: (block: BlockDetail): void => processBlockRemoval(db, block),
    });
  });
}
