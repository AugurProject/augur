import Augur from "augur.js";
import * as Knex from "knex";
import { Address, UnclaimedFeeWindowsRow, UnclaimedFeeWindows, UnclaimedFeeWindowInfo } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { getCurrentTime } from "../../blockchain/process-block";
import { getCashAddress } from "./database";
import * as t from "io-ts";

export const FeeWindowsParams = t.type({
  universe: t.string,
  account: t.string,
  includeCurrent: t.union([t.boolean, t.null, t.undefined]),
});

export async function getFeeWindows(db: Knex, augur: Augur, params: t.TypeOf<typeof FeeWindowsParams>) {
  if (params.universe == null || params.account == null) throw new Error("Must provide both universe and account");

  let query = db.select(["fee_windows.feeWindow", "fee_windows.startTime", "fee_windows.endTime", "balances.balance", "participation_token.supply AS participationTokenStake", db.raw("IFNULL(fee_token.supply, 0) AS feeTokenStake"), db.raw("IFNULL(cash.balance, 0) as totalFees")]).from("fee_windows")
    .join("balances", "fee_windows.feeWindow", "balances.token")
    .join("token_supply AS participation_token", "participation_token.token", "fee_windows.feeWindow")
    .leftJoin("token_supply AS fee_token", "fee_token.token", "fee_windows.feeToken")
    .leftJoin("balances AS cash", function () {
      this
        .on("cash.owner", db.raw("fee_windows.feeWindow"))
        .andOn("cash.token", db.raw("?", getCashAddress(augur)));
    })
    .where("fee_windows.universe", params.universe)
    .where("balances.balance", ">", 0)
    .where("balances.owner", params.account);
  if (!params.includeCurrent) query = query.where("fee_windows.startTime", "<", getCurrentTime());

  const unclaimedFeeWindowsRows: Array<UnclaimedFeeWindowsRow<BigNumber>> = await query;
  return unclaimedFeeWindowsRows.reduce((acc: UnclaimedFeeWindows<string>, cur) => {
    const totalStake = cur.participationTokenStake.plus(cur.feeTokenStake);
    acc[cur.feeWindow] = formatBigNumberAsFixed<UnclaimedFeeWindowInfo<BigNumber>, UnclaimedFeeWindowInfo<string>>({
      startTime: cur.startTime,
      endTime: cur.endTime,
      balance: cur.balance,
      expectedFees: cur.balance.times(cur.totalFees).dividedBy(totalStake),
    });
    return acc;
  }, {});
}
