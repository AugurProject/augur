import Augur from "augur.js";
import * as Knex from "knex";
import { Address, UnclaimedFeeWindowsRow, UnclaimedFeeWindows } from "../../types";
import { getCurrentTime } from "../../blockchain/process-block";

export function getFeeWindows(db: Knex, augur: Augur, universe: Address, account: Address, includeCurrent: boolean, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null || account == null) return callback(new Error("Must provide both universe and account"));

  let query = db.select(["fee_windows.feeWindow", "fee_windows.startTime", "fee_windows.endTime", "balances.balance", "participation_token.supply AS participationTokenStake", "fee_token.supply AS feeTokenStake", "cash.balance as totalFees"]).from("fee_windows")
    .join("balances", "fee_windows.feeWindow", "balances.token")
    .join("token_supply AS participation_token", "participation_token.token", "fee_windows.feeWindow")
    .leftJoin("token_supply AS fee_token", "fee_token.token", "fee_windows.feeToken")
    .leftJoin("balances AS cash", function () {
      this
        .on("cash.owner", db.raw("fee_windows.feeWindow"));
      })
    .where("cash.token", augur.contracts.addresses[augur.rpc.getNetworkID()].Cash)
    .where("fee_windows.universe", universe)
    .where("balances.balance", ">", 0)
    .where("balances.owner", account);
  if (!includeCurrent) query = query.where("fee_windows.startTime", "<", getCurrentTime());
  query.asCallback((err: Error|null, unclaimedFeeWindowsRows: Array<UnclaimedFeeWindowsRow>): void => {
    if (err) return callback(err);
    callback(null, unclaimedFeeWindowsRows.reduce((acc: UnclaimedFeeWindows, cur) => {
      const totalStake = Number(cur.participationTokenStake) + Number(cur.feeTokenStake);
      acc[cur.feeWindow] = {
        startTime: cur.startTime,
        endTime: cur.endTime,
        balance: cur.balance,
        expectedFees: cur.balance * cur.totalFees / totalStake,
      };
      return acc;
    }, {}));
  });
}
