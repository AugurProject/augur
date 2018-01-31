import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback} from "../../types";
import { augurEmitter } from "../../events";

/*          "name": "universe",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "feeWindow",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "startTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "endTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
          */

export function processFeeWindowCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const feeWindowToInsert = {
    feeWindow: log.feeWindow,
    feeWindowID: log.id,
    universe: log.universe,
    startBlockNumber: log.blockNumber,
    startTime: log.startTime,
    endBlockNumber: null,
    endTime: log.endTime,
    fees: 0,
  };
  augurEmitter.emit("FeeWindowCreated", feeWindowToInsert);
  db.transacting(trx).from("fee_windows").insert(feeWindowToInsert).asCallback(callback);
}

export function processFeeWindowCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("FeeWindowCreated", log);
  db.transacting(trx).from("fee_windows").where({feeWindow: log.feeWindow}).del().asCallback(callback);
}
