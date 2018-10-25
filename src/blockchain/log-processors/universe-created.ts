import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, Address } from "../../types";
import { insertPayout } from "./database";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export async function processUniverseCreatedLog(augur: Augur, log: FormattedEventLog) {
  const reputationToken: Address = await augur.api.Universe.getReputationToken({ tx: { to: log.childUniverse } });
  return async (db: Knex) => {
    const payoutId: number = await insertPayout(db, log.childUniverse, log.payoutNumerators, log.invalid, true);
    const universeToInsert = {
      universe: log.childUniverse,
      parentUniverse: log.parentUniverse,
      payoutId,
      reputationToken,
      forked: false,
    };
    await db.insert(universeToInsert).into("universes");
    augurEmitter.emit(SubscriptionEventNames.UniverseCreated, log);
    const repToken = [{
      contractAddress: reputationToken,
      symbol: "REP",
    }];
    await db("tokens").insert(repToken);
  };
}


export async function processUniverseCreatedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db("universes").where({ universe: log.childUniverse }).del();
    augurEmitter.emit(SubscriptionEventNames.UniverseCreated, log);
  };
}

