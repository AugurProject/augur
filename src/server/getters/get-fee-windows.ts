import * as Knex from "knex";
import { Address, UnclaimedFeeWindowsRow } from "../../types";

export function getFeeWindows(db: Knex, universe: Address, account: Address, includeCurrent: boolean, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null || account == null) return callback(new Error("Must provide both universe and account"));
  const query = db.select(["fee_windows.feeWindow", "fee_windows.start_time", "fee_windows.end_time", "balances.balance", "sum('participation_token.supply', 'fee_token.supply')", "cash.balance"]).from("fee_windows")
    .join("balances", "fee_windows.feeWindow", "balances.token")
    .join("token_supply AS participation_token", "participation_token.token", "fee_windows.fee_window")
    .join("token_supply AS fee_token", "fee_token.token", "fee_windows.fee_token")
    .join("balances AS cash", "cash.token", "CASH_ADDRESS_TODO")
    .where("fee_windows.universe", universe)
    .where("balances.balance", ">", 0)
    .where("balances.owner", account)
    .where("cash.owner", "fee_window.feeWindow");
  query.asCallback((err: Error|null, disputeTokens: Array<UnclaimedFeeWindowsRow>): void => {
    if (err) return callback(err);
    // callback(null, disputeTokens.reduce((acc: UIDisputeTokens, cur) => {acc[cur.disputeToken] = reshapeDisputeTokensRowToUIDisputeTokenInfo(cur); return acc; }, {}));
  });
}
