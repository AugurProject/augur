import * as Knex from "knex";
import { Address, CompleteSetsRow, UICompleteSetsRow } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

export interface CompleteSets {
  [orderId: string]: CompleteSetsRow<string>;
}

export function getCompleteSets(db: Knex, universe: Address, account: Address, callback: (err: Error|null, result?: CompleteSets) => void): void {
  const query = db.select("*").from("completeSets")
    .where("account", account)
    .where("universe", universe);
  query.leftJoin("blocks", "completeSets.blockNumber", "blocks.blockNumber");
  query.asCallback((err: Error|null, completeSets?: Array<CompleteSetsRow<BigNumber>>): void => {
    if (err) return callback(err);
    if (!completeSets) return callback(err, {});
    callback(null, completeSets.reduce((acc: CompleteSets, cur: UICompleteSetsRow<BigNumber>) => {
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
    }, {}));
  });
}
