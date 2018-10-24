import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog } from "../../types";

export async function processMarketParticipantsDisavowedLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  await db.update({
    needsDisavowal: db.raw("needsDisavowal - 1"),
  }).into("markets").where("marketId", log.market);
  return db.from("crowdsourcers").where("marketId", log.market).update({ disavowed: db.raw("disavowed + 1")});
}

export async function processMarketParticipantsDisavowedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {
  await db.update({
    needsDisavowal: db.raw("needsDisavowal + 1"),
  }).into("markets").where("marketId", log.market);
  return db.from("crowdsourcers").where("marketId", log.market).update({ disavowed: db.raw("disavowed - 1")});
}
