import * as Knex from "knex";
import { FormattedLog } from "../types";
import { logProcessors } from "./log-processors";
import { logError } from "../utils/log-error";

export function makeLogListener(db: Knex, trx: Knex.Transaction, contractName: string, eventName: string) {
  return (log: FormattedLog) => {
    console.log(contractName, eventName, log);
    logProcessors[contractName][eventName](db, trx, log, logError);
  };
}
