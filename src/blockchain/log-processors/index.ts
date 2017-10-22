import { LogProcessor } from "../../types";
import { processMarketCreatedLog } from "./market-created";
import { processTokensTransferredLog } from "./tokens-transferred";
import { processOrderCanceledLog } from "./order-canceled";
import { processOrderCreatedLog } from "./order-created";
import { processOrderFilledLog } from "./order-filled";
import { processProceedsClaimedLog } from "./proceeds-claimed";
import { processDesignatedReportSubmittedLog } from "./designated-report-submitted";
import { processReportSubmittedLog } from "./report-submitted";
import { processWinningTokensRedeemedLog } from "./winning-tokens-redeemed";
import { processReportsDisputedLog } from "./reports-disputed";
import { processMarketFinalizedLog } from "./market-finalized";
import { processUniverseForkedLog } from "./universe-forked";
import { processTransferLog } from "./legacy-rep-contract/transfer";
import { processApprovalLog } from "./legacy-rep-contract/approval";

export const logProcessors: {[contractName: string]: {[eventName: string]: LogProcessor}} = {
  Augur: {
    MarketCreated: processMarketCreatedLog,
    TokensTransferred: processTokensTransferredLog,
    OrderCanceled: processOrderCanceledLog,
    OrderCreated: processOrderCreatedLog,
    OrderFilled: processOrderFilledLog,
    ProceedsClaimed: processProceedsClaimedLog,
    DesignatedReportSubmitted: processDesignatedReportSubmittedLog,
    ReportSubmitted: processReportSubmittedLog,
    WinningTokensRedeemed: processWinningTokensRedeemedLog,
    ReportsDisputed: processReportsDisputedLog,
    MarketFinalized: processMarketFinalizedLog,
    UniverseForked: processUniverseForkedLog,
  },
  LegacyRepContract: {
    Transfer: processTransferLog,
    Approval: processApprovalLog,
  },
};
