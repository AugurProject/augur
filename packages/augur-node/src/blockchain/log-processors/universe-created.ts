import { Address, Augur, FormattedEventLog } from "../../types";
import Knex from "knex";
import { insertPayout } from "./database";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export async function processUniverseCreatedLog(augur: Augur, log: FormattedEventLog) {
  const reputationToken: Address = await augur.contracts.universe.getReputationToken_();
  return async (db: Knex) => {
    const payoutId: number = await insertPayout(db, log.childUniverse, log.payoutNumerators, true);
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
