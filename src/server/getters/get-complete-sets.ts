import * as Knex from "knex";
import { Address, CompleteSetsRow, UICompleteSetsRow } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import * as t from "io-ts";

export const CompleteSetsParams = t.type({
  universe: t.string,
  account: t.string,
});

export interface CompleteSets {
  [orderId: string]: CompleteSetsRow<string>;
}

export async function getCompleteSets(db: Knex, augur: {}, params: t.TypeOf<typeof CompleteSetsParams>): Promise<CompleteSets> {
  const query = db.select("*").from("completeSets")
    .where("account", params.account)
    .where("universe", params.universe);
  query.leftJoin("blocks", "completeSets.blockNumber", "blocks.blockNumber");
  const completeSets: Array<CompleteSetsRow<BigNumber>> = await query;
  return completeSets.reduce((acc: CompleteSets, cur: UICompleteSetsRow<BigNumber>) => {
    acc[cur.transactionHash] = formatBigNumberAsFixed<UICompleteSetsRow<BigNumber>, UICompleteSetsRow<string>>({
      account: cur.account,
      eventName: cur.eventName,
      timestamp: cur.timestamp,
      universe: cur.universe,
      blockNumber: cur.blockNumber,
      transactionHash: cur.transactionHash,
      logIndex: cur.logIndex,
      tradeGroupId: cur.tradeGroupId,
      numCompleteSets: cur.numCompleteSets,
      numPurchasedOrSold: cur.numPurchasedOrSold,
      marketId: cur.marketId,
    });
    return acc;
  }, {});
}
