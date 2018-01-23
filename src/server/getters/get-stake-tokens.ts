import * as Knex from "knex";
import * as _ from "lodash";
import { Address, ReportingState, DisputeTokensRowWithTokenState, DisputeTokenState, UIDisputeTokenInfo, UIDisputeTokens } from "../../types";
import { getMarketsWithReportingState, reshapeDisputeTokensRowToUIDisputeTokenInfo } from "./database";

export function getDisputeTokens(db: Knex, universe: Address, account: Address, disputeTokenState: DisputeTokenState|null, callback: (err: Error|null, result?: any) => void): void {
    if (universe == null || account == null) return callback(new Error("Must provide both universe and account"));
    const query: Knex.QueryBuilder = getMarketsWithReportingState(db, ["stake_tokens.*", "reports.claimed", "reports.winningToken", "market_state.reportingState"]).from("stake_tokens");
    query.sum("reports.amountStaked as amountStaked").groupBy("stake_tokens.stakeToken");
    query.join("markets", "markets.marketID", "stake_tokens.marketID").join("reports", "reports.stakeToken", "stake_tokens.stakeToken");
    query.where("universe", universe).where("reports.reporter", account);
    if ( disputeTokenState == null || disputeTokenState === DisputeTokenState.ALL ) {
      // currently, do nothing, leaving this in case we want to flavor how we group or present response
    } else if ( disputeTokenState === DisputeTokenState.UNFINALIZED ) {
      query.whereNot("market_state.reportingState", ReportingState.FINALIZED);
    } else if ( disputeTokenState === DisputeTokenState.UNCLAIMED ) {
      query.where("reports.winningToken", 1).where("reports.claimed", 0);
    } else {
      return callback(new Error("Invalid disputeTokenState"));
    }
    query.asCallback((err: Error|null, disputeTokens: Array<DisputeTokensRowWithTokenState>): void => {
      if (err) return callback(err);
      callback(null, disputeTokens.reduce((acc: UIDisputeTokens, cur) => {acc[cur.stakeToken] = reshapeDisputeTokensRowToUIDisputeTokenInfo(cur); return acc; }, {}));
    });
}
