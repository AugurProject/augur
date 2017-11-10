import * as Knex from "knex";
import * as _ from "lodash";
import { Address, ReportingState, StakeTokensRowWithReportingState } from "../../types";
import { getMarketsWithReportingState } from "./database";

// Input: User Address
// Output: Unfinalized Stake Tokens
export function getUnfinalizedStakeTokens(db: Knex, universe: Address, account: Address, callback: (err: Error|null, result?: any) => void): void {
    const query: Knex.QueryBuilder = getMarketsWithReportingState(db, ["stake_tokens.*", "reports.amountStaked", "market_state.reportingState"]).from("stake_tokens");
    query.join("markets", "markets.marketID", "stake_tokens.marketID").join("reports", "reports.stakeToken", "stake_tokens.stakeToken");
    query.whereNot("market_state.reportingState", ReportingState.FINALIZED);
    query.where("universe", universe).where("reports.reporter", account);
    query.asCallback((err: Error|null, unfinalizedStakeTokens?: Array<StakeTokensRowWithReportingState>): void => {
      if (err) return callback(err);
      callback(null, _.keyBy(unfinalizedStakeTokens, (r: StakeTokensRowWithReportingState): Address => r.stakeToken));
    });

}
