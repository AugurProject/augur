import { Database } from "sqlite3";
import { FormattedLog } from "../types";
import { logProcessors } from "./log-processors";
import { logError } from "../utils/log-error";

export function makeLogListener(db: Database, contractName: string, eventName: string) {
  return (log: FormattedLog) => {
    console.log(contractName, eventName, log);
    logProcessors[contractName][eventName](db, log, logError);
  };
}
