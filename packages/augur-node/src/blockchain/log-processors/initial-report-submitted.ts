import { Address, Augur, FormattedEventLog, ReportingState } from "../../types";
import Knex from "knex";
import {
  insertPayout,
  refreshMarketMailboxEthBalance,
  rollbackMarketState,
  updateDisputeRound,
  updateMarketDisputeWindow,
  updateMarketState
} from "./database";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export async function processInitialReportSubmittedLog(augur: Augur, log: FormattedEventLog) {
  const market = await augur.getMarket(log.market);
  const initialReporter: Address = await market.getInitialReporter_();
  return async (db: Knex) => {
    const universeRow: { forked: boolean } = await db("universes").first("forked").where({ universe: log.universe });
    if (universeRow == null) throw new Error(`No universe in initial report. Universe: ${log.universe}`);
    const marketState = universeRow.forked ? ReportingState.AWAITING_FORK_MIGRATION : ReportingState.AWAITING_NEXT_WINDOW;
    await updateMarketState(db, log.market, log.blockNumber, marketState);
    const payoutId = await insertPayout(db, log.market, log.payoutNumerators, true);
    const reportToInsert = {
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      marketId: log.market,
      isDesignatedReporter: log.isDesignatedReporter,
      reporter: log.reporter,
      amountStaked: log.amountStaked,
      payoutId,
      redeemed: false,
    };
    await db.insert({ ...reportToInsert, initialReporter }).into("initial_reports");
    await db("markets").update({ initialReportSize: log.amountStaked }).where({ marketId: log.market });
    await updateMarketDisputeWindow(db, augur, log.universe, log.market, true);
    await updateDisputeRound(db, log.market);
    await refreshMarketMailboxEthBalance(db, augur, log.market);
    augurEmitter.emit(SubscriptionEventNames.InitialReportSubmitted, log);
  };
}

export async function processInitialReportSubmittedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await rollbackMarketState(db, log.market, ReportingState.AWAITING_NEXT_WINDOW);
    await db("initial_reports").delete().where({ marketId: log.market });
    await db("markets").update({ initialReportSize: null }).where({ marketId: log.market });
    await updateMarketDisputeWindow(db, augur, log.universe, log.market, false);
    await refreshMarketMailboxEthBalance(db, augur, log.market);
    augurEmitter.emit(SubscriptionEventNames.InitialReportSubmitted, log);
  };
}
