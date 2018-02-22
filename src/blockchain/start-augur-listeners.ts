import Augur from "augur.js";
import * as Knex from "knex";
import { BlockDetail } from "../types";
import { makeLogListener } from "./make-log-listener";
import { processBlock, processBlockRemoval } from "./process-block";

export function startAugurListeners(db: Knex, augur: Augur, highestBlockNumber: number): void {
  augur.events.startBlockchainEventListeners({
    Augur: {
      MarketCreated: makeLogListener(augur, "Augur", "MarketCreated"),
      TokensTransferred: makeLogListener(augur, "Augur", "TokensTransferred"),
      TokensMinted: makeLogListener(augur, "Augur", "TokensMinted"),
      TokensBurned: makeLogListener(augur, "Augur", "TokensBurned"),
      OrderCanceled: makeLogListener(augur, "Augur", "OrderCanceled"),
      OrderCreated: makeLogListener(augur, "Augur", "OrderCreated"),
      OrderFilled: makeLogListener(augur, "Augur", "OrderFilled"),
      TradingProceedsClaimed: makeLogListener(augur, "Augur", "TradingProceedsClaimed"),
      DesignatedReportSubmitted: makeLogListener(augur, "Augur", "DesignatedReportSubmitted"),
      ReportSubmitted: makeLogListener(augur, "Augur", "ReportSubmitted"),
      WinningTokensRedeemed: makeLogListener(augur, "Augur", "WinningTokensRedeemed"),
      ReportsDisputed: makeLogListener(augur, "Augur", "ReportsDisputed"),
      MarketFinalized: makeLogListener(augur, "Augur", "MarketFinalized"),
      feeWindowCreated: makeLogListener(augur, "Augur", "FeeWindowCreated"),
      UniverseForked: makeLogListener(augur, "Augur", "UniverseForked"),
      TimestampSet: makeLogListener(augur, "Augur", "TimestampSet"),

    },
    LegacyReputationToken: {
      Transfer: makeLogListener(augur, "LegacyReputationToken", "Transfer"),
      Approval: makeLogListener(augur, "LegacyReputationToken", "Approval"),
    },
  }, highestBlockNumber, (err: Error) => {
    augur.events.startBlockListeners({
      onAdded: (block: BlockDetail): void => processBlock(db, augur, block),
      onRemoved: (block: BlockDetail): void => processBlockRemoval(db, block),
    });
  });
}
