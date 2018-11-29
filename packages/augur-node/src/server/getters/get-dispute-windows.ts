import * as t from "io-ts";
import Augur from "augur.js";
import * as Knex from "knex";
import { UnclaimedDisputeWindowsRow, UnclaimedDisputeWindows, UnclaimedDisputeWindowInfo } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { getCurrentTime } from "../../blockchain/process-block";
import { getCashAddress } from "./database";

export const DisputeWindowsParams = t.type({
  universe: t.string,
  account: t.string,
  includeCurrent: t.union([t.boolean, t.null, t.undefined]),
});

export async function getDisputeWindows(db: Knex, augur: Augur, params: t.TypeOf<typeof DisputeWindowsParams>) {
  if (params.universe == null || params.account == null) throw new Error("Must provide both universe and account");

  let query = db.select(["dispute_windows.disputeWindow", "dispute_windows.startTime", "dispute_windows.endTime", "balances.balance", "participation_token.supply AS participationTokenStake", db.raw("IFNULL(fee_token.supply, 0) AS feeTokenStake"), db.raw("IFNULL(cash.balance, 0) as totalFees")]).from("dispute_windows")
    .join("balances", "dispute_windows.disputeWindow", "balances.token")
    .join("token_supply AS participation_token", "participation_token.token", "dispute_windows.disputeWindow")
    .leftJoin("token_supply AS fee_token", "fee_token.token", "dispute_windows.feeToken")
    .leftJoin("balances AS cash", function () {
      this
        .on("cash.owner", db.raw("dispute_windows.disputeWindow"))
        .andOn("cash.token", db.raw("?", getCashAddress(augur)));
    })
    .where("dispute_windows.universe", params.universe)
    .where("balances.balance", ">", 0)
    .where("balances.owner", params.account);
  if (!params.includeCurrent) query = query.where("dispute_windows.startTime", "<", getCurrentTime());

  const unclaimedDisputeWindowsRows: Array<UnclaimedDisputeWindowsRow<BigNumber>> = await query;
  return unclaimedDisputeWindowsRows.reduce((acc: UnclaimedDisputeWindows<string>, cur) => {
    const totalStake = cur.participationTokenStake.plus(cur.feeTokenStake);
    acc[cur.disputeWindow] = formatBigNumberAsFixed<UnclaimedDisputeWindowInfo<BigNumber>, UnclaimedDisputeWindowInfo<string>>({
      startTime: cur.startTime,
      endTime: cur.endTime,
      balance: cur.balance,
      expectedFees: cur.balance.times(cur.totalFees).dividedBy(totalStake),
    });
    return acc;
  }, {});
}
