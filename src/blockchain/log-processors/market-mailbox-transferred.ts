import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog} from "../../types";

//     event MarketMailboxTransferred(address indexed universe, address indexed market, address indexed mailbox, address from, address to);
export async function processMarketMailboxTransferredLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  return db("markets").update("marketCreatorMailboxOwner", log.to).where("marketId", log.market);
}

export async function processMarketMailboxTransferredLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {
  return db("markets").update("marketCreatorMailboxOwner", log.from).where("marketId", log.market);
}
