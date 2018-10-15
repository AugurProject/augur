import * as t from "io-ts";
import * as Knex from "knex";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { ReportingState, DisputeTokensRowWithTokenState, UIDisputeTokens, UIDisputeTokenInfo } from "../../types";
import { reshapeDisputeTokensRowToUIDisputeTokenInfo } from "./database";

export const DisputeTokenState = t.keyof({
  ALL: null,
  UNCLAIMED: null,
  UNFINALIZED: null,
});

export const DisputeTokensParams = t.type({
  universe: t.string,
  account: t.string,
  stakeTokenState: t.union([DisputeTokenState, t.null, t.undefined]),
});

export async function getDisputeTokens(db: Knex, augur: {}, params: t.TypeOf<typeof DisputeTokensParams>) {
  const query: Knex.QueryBuilder = db.select(["payouts.*", "disputes.crowdsourcerId as disputeToken", "balances.balance", "market_state.reportingState"]).from("disputes");
  query.join("markets", "markets.marketId", "crowdsourcers.marketId");
  query.leftJoin("market_state", "markets.marketStateId", "market_state.marketStateId");
  query.leftJoin("blocks", "markets.creationBlockNumber", "blocks.blockNumber");
  query.join("crowdsourcers", "crowdsourcers.crowdsourcerId", "disputes.crowdsourcerId");
  query.join("payouts", "payouts.payoutId", "crowdsourcers.payoutId");
  query.join("balances", "crowdsourcers.crowdsourcerId", "balances.token");
  query.where("universe", params.universe).where("disputes.reporter", params.account).where("balances.balance", ">", 0).where("balances.owner", params.account);
  if (params.stakeTokenState == null || params.stakeTokenState === "ALL") {
    // currently, do nothing, leaving this in case we want to flavor how we group or present response
  } else if (params.stakeTokenState === "UNFINALIZED") {
    query.whereNot("market_state.reportingState", ReportingState.FINALIZED);
  } else if (params.stakeTokenState === "UNCLAIMED") {
    query.where("payouts.winning", 1);
  } else {
    throw new Error("Invalid disputeTokenState");
  }
  const disputeTokens: Array<DisputeTokensRowWithTokenState<BigNumber>> = await query;
  return disputeTokens.reduce((acc: UIDisputeTokens<string>, cur) => {
    const tokenInfo = reshapeDisputeTokensRowToUIDisputeTokenInfo(cur);
    acc[cur.disputeToken] = formatBigNumberAsFixed<UIDisputeTokenInfo<BigNumber>, UIDisputeTokenInfo<string>>(tokenInfo);
    return acc;
  }, {});
}
