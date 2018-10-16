import * as t from "io-ts";
import * as Knex from "knex";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { InitialReportersRow, UIInitialReporters } from "../../types";

export const InitialReportersParams = t.type({
  universe: t.string,
  reporter: t.string,
  redeemed: t.union([t.boolean, t.null, t.undefined]),
  withRepBalance: t.union([t.boolean, t.null, t.undefined]),
});

export async function getInitialReporters(db: Knex, augur: {}, params: t.TypeOf<typeof InitialReportersParams>) {
  const query = db("initial_reports")
    .select(["marketID", "reporter", "amountStaked", "initialReporter", "redeemed", "isDesignatedReporter", "balances.balance AS repBalance"])
    .select(["transactionHash", "initial_reports.blockNumber", "logIndex", "blocks.timestamp"])
    .join("balances", "balances.owner", "=", "initial_reports.initialReporter")
    .join("universes", "universes.reputationToken", "balances.token")
    .join("blocks", "initial_reports.blockNumber", "blocks.blockNumber")
    .where("reporter", params.reporter)
    .where("universes.universe", params.universe);
  if (params.withRepBalance) query.where("repBalance", ">", "0");
  if (params.redeemed != null) query.where("redeemed", params.redeemed);
  const initialReporters: Array<InitialReportersRow<BigNumber>> = await query;
  return initialReporters.reduce((acc: UIInitialReporters<string>, cur) => {
    acc[cur.initialReporter] = formatBigNumberAsFixed<InitialReportersRow<BigNumber>, InitialReportersRow<string>>(cur);
    return acc;
  }, {});
}
