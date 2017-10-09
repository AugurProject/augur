import * as Knex from "knex";
import { FormattedLog } from "../types";
import { logProcessors } from "./log-processors";
import { logError } from "../utils/log-error";

export function makeLogListener(db: Knex, contractName: string, eventName: string) {
  return (log: FormattedLog) => {
    console.log(contractName, eventName, log);
    db.transaction((trx) => {
      logProcessors[contractName][eventName](db, trx, log, (err?: Error|null):void => {
        if(err) {
          trx.rollback();
        } else { 
          trx.commit();
        }
      });
    }).asCallback(logError);
  };
}
