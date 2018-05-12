import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";

export function processMarketParticipantsDisavowedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("crowdsourcers").where("marketId", log.market).update({ disavowed: db.raw("disavowed + 1")}).asCallback(callback);
}

export function processMarketParticipantsDisavowedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("crowdsourcers").where("marketId", log.market).update({ disavowed: db.raw("disavowed - 1")}).asCallback(callback);
}
