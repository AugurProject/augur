import Augur from "augur.js";
import * as Knex from "knex";
import { Address, UnclaimedFeeWindowsRow, UnclaimedFeeWindows, UnclaimedFeeWindowInfo } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { getCurrentTime } from "../../blockchain/process-block";

export function getFeeWindows(db: Knex, augur: Augur, universe: Address, account: Address, includeCurrent: boolean, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null || account == null) return callback(new Error("Must provide both universe and account"));

  let query = db.select(["fee_windows.feeWindow", "fee_windows.startTime", "fee_windows.endTime", "balances.balance", "participation_token.supply AS participationTokenStake", db.raw("IFNULL(fee_token.supply, 0) AS feeTokenStake"), db.raw("IFNULL(cash.balance, 0) as totalFees")]).from("fee_windows")
    .join("balances", "fee_windows.feeWindow", "balances.token")
    .join("token_supply AS participation_token", "participation_token.token", "fee_windows.feeWindow")
    .leftJoin("token_supply AS fee_token", "fee_token.token", "fee_windows.feeToken")
    .leftJoin("balances AS cash", function () {
      this
        .on("cash.owner", db.raw("fee_windows.feeWindow"))
        .andOn("cash.token", db.raw("?", augur.contracts.addresses[augur.rpc.getNetworkID()].Cash));
      })
    .where("fee_windows.universe", universe)
    .where("balances.balance", ">", 0)
    .where("balances.owner", account);
  if (!includeCurrent) query = query.where("fee_windows.startTime", "<", getCurrentTime());

  query.asCallback((err: Error|null, unclaimedFeeWindowsRows: Array<UnclaimedFeeWindowsRow<BigNumber>>): void => {
    if (err) return callback(err);
    callback(null, unclaimedFeeWindowsRows.reduce((acc: UnclaimedFeeWindows<string>, cur) => {
      const totalStake = cur.participationTokenStake.plus(cur.feeTokenStake);
      acc[cur.feeWindow] = formatBigNumberAsFixed<UnclaimedFeeWindowInfo<BigNumber>, UnclaimedFeeWindowInfo<string>>({
        startTime: cur.startTime,
        endTime: cur.endTime,
        balance: cur.balance,
        expectedFees: cur.balance.times(cur.totalFees).dividedBy(totalStake),
      });
      return acc;
    }, {}));
  });
}
