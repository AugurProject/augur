import * as Knex from "knex";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { Address, ReportingState, DisputeTokensRowWithTokenState, DisputeTokenState, UIDisputeTokens, UIDisputeTokenInfo } from "../../types";
import { getMarketsWithReportingState, reshapeDisputeTokensRowToUIDisputeTokenInfo } from "./database";

export function getDisputeTokens(db: Knex, universe: Address, account: Address, disputeTokenState: DisputeTokenState|null, callback: (err: Error|null, result?: any) => void): void {
    if (universe == null || account == null) return callback(new Error("Must provide both universe and account"));
    const query: Knex.QueryBuilder = getMarketsWithReportingState(db, ["payouts.*", "disputes.crowdsourcerId as disputeToken", "balances.balance", "market_state.reportingState"]).from("disputes");
    query.join("markets", "markets.marketId", "crowdsourcers.marketId");
    query.join("crowdsourcers", "crowdsourcers.crowdsourcerId", "disputes.crowdsourcerId");
    query.join("payouts", "payouts.payoutId", "crowdsourcers.payoutId");
    query.join("balances", "crowdsourcers.crowdsourcerId", "balances.token");
    query.where("universe", universe).where("disputes.reporter", account).where("balances.balance", ">", 0).where("balances.owner", account);
    if ( disputeTokenState == null || disputeTokenState === DisputeTokenState.ALL ) {
      // currently, do nothing, leaving this in case we want to flavor how we group or present response
    } else if ( disputeTokenState === DisputeTokenState.UNFINALIZED ) {
      query.whereNot("market_state.reportingState", ReportingState.FINALIZED);
    } else if ( disputeTokenState === DisputeTokenState.UNCLAIMED ) {
      query.where("payouts.winning", 1);
    } else {
      return callback(new Error("Invalid disputeTokenState"));
    }
    query.asCallback((err: Error|null, disputeTokens: Array<DisputeTokensRowWithTokenState<BigNumber>>): void => {
      if (err) return callback(err);
      callback(null, disputeTokens.reduce((acc: UIDisputeTokens<string>, cur) => {
        const tokenInfo = reshapeDisputeTokensRowToUIDisputeTokenInfo(cur);
        acc[cur.disputeToken] = formatBigNumberAsFixed<UIDisputeTokenInfo<BigNumber>, UIDisputeTokenInfo<string>>(tokenInfo);
        return acc;
      }, {}));
    });
}
