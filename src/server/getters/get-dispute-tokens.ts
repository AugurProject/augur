import * as Knex from "knex";
import * as _ from "lodash";
import { Address, ReportingState, DisputeTokensRowWithTokenState, DisputeTokenState, UIDisputeTokenInfo, UIDisputeTokens } from "../../types";
import { getMarketsWithReportingState, reshapeDisputeTokensRowToUIDisputeTokenInfo } from "./database";

export function getDisputeTokens(db: Knex, universe: Address, account: Address, disputeTokenState: DisputeTokenState|null, callback: (err: Error|null, result?: any) => void): void {
    if (universe == null || account == null) return callback(new Error("Must provide both universe and account"));
    const query: Knex.QueryBuilder = getMarketsWithReportingState(db, ["payouts.*", "disputes.crowdsourcerID as disputeToken", "disputes.claimed", "disputes.amountStaked", "market_state.reportingState"]).from("disputes");
    query.sum("disputes.amountStaked as amountStaked").groupBy("disputes.crowdsourcerID");
    query.join("markets", "markets.marketID", "crowdsourcers.marketID");
    query.join("crowdsourcers", "crowdsourcers.crowdsourcerID", "disputes.crowdsourcerID");
    query.join("payouts", "payouts.payoutID", "crowdsourcers.payoutID");
    query.where("universe", universe).where("disputes.reporter", account);
    if ( disputeTokenState == null || disputeTokenState === DisputeTokenState.ALL ) {
      // currently, do nothing, leaving this in case we want to flavor how we group or present response
    } else if ( disputeTokenState === DisputeTokenState.UNFINALIZED ) {
      query.whereNot("market_state.reportingState", ReportingState.FINALIZED);
    } else if ( disputeTokenState === DisputeTokenState.UNCLAIMED ) {
      query.where("payouts.winning", 1).where("disputes.claimed", 0);
    } else {
      return callback(new Error("Invalid disputeTokenState"));
    }
    query.asCallback((err: Error|null, disputeTokens: Array<DisputeTokensRowWithTokenState>): void => {
      if (err) return callback(err);
      callback(null, disputeTokens.reduce((acc: UIDisputeTokens, cur) => {acc[cur.disputeToken] = reshapeDisputeTokensRowToUIDisputeTokenInfo(cur); return acc; }, {}));
    });
}
