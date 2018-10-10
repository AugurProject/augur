import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";

//     event MarketMailboxTransferred(address indexed universe, address indexed market, address indexed mailbox, address from, address to);
export function processMarketMailboxTransferredLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("markets").update("marketCreatorMailboxOwner", log.to).where("marketId", log.market).asCallback(callback);
}

export function processMarketMailboxTransferredLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("markets").update("marketCreatorMailboxOwner", log.from).where("marketId", log.market).asCallback(callback);
}
