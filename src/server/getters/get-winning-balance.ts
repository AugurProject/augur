import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, ReportingState, PayoutRow } from "../../types";
import { getMarketsWithReportingState, groupByAndSum } from "./database";
import Augur from "augur.js";

interface WinningPayoutRows extends PayoutRow<BigNumber> {
  marketId: Address;
  reportingState: ReportingState;
  balance: BigNumber;
  outcome: number;
}

export interface MarketWinnings {
  marketId: Address;
  winnings: BigNumber;
}

export function getWinningBalance(db: Knex, augur: Augur, marketIds: Array<Address>, account: Address, callback: (err: Error|null, result?: Array<MarketWinnings>) => void): void {
  if (marketIds == null) return callback(new Error("must include marketIds parameter"));
  if (account == null) return callback(new Error("must include account parameter"));
  const marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db, ["markets.marketId", "balances.balance", "balances.owner", "shareTokens.outcome", "payouts.*"]);
  marketsQuery.whereIn("markets.marketId", marketIds);
  marketsQuery.whereIn("reportingState", [ReportingState.FINALIZED, ReportingState.AWAITING_FINALIZATION]);
  marketsQuery.join("tokens AS shareTokens", function () {
    this
      .on("shareTokens.marketId", "markets.marketId")
      .andOn("symbol", db.raw("?", "shares"));
  });
  marketsQuery.join("balances", function () {
    this
      .on("balances.token", "shareTokens.contractAddress")
      .andOn("balances.owner", db.raw("?", account));
  });
  marketsQuery.join("payouts", function () {
    this
      .on("payouts.marketId", "markets.marketId")
      .andOn("payouts.winning", db.raw("1"));
  });
  marketsQuery.asCallback(( err: Error|null, winningPayoutRows: Array<WinningPayoutRows>): void => {
    if (err != null) return callback(err);
    const calculatedWinnings = _.map(winningPayoutRows, (winningPayoutRow) => {
      const payoutKey = `payout${winningPayoutRow.outcome}` as keyof PayoutRow<BigNumber>;
      const payout = winningPayoutRow[payoutKey] as BigNumber;
      const winnings: BigNumber = payout.times(winningPayoutRow.balance);
      return {marketId: winningPayoutRow.marketId, winnings: winnings.decimalPlaces(0, BigNumber.ROUND_DOWN) };
    });
    callback(null, groupByAndSum(calculatedWinnings, ["marketId"], ["winnings"]));
  });
}
