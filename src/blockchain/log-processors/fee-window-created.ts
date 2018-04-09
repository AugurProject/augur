import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address } from "../../types";
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

export function processFeeWindowCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augur.api.FeeWindow.getFeeToken({ tx: { to: log.feeWindow }}, (err: Error|null, feeToken?: Address): void => {
    if (err) return callback(err);
    const feeWindowToInsert = {
      feeWindow: log.feeWindow,
      feeWindowId: log.id,
      universe: log.universe,
      startBlockNumber: log.blockNumber,
      startTime: log.startTime,
      endBlockNumber: null,
      endTime: log.endTime,
      fees: 0,
      feeToken,
    };
    augurEmitter.emit("FeeWindowCreated", Object.assign({}, log, feeWindowToInsert));
    console.log(Object.assign({}, log, feeWindowToInsert));
    db.from("fee_windows").insert(feeWindowToInsert).asCallback(callback);
  });
}

export function processFeeWindowCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("FeeWindowCreated", log);
  db.from("fee_windows").where({feeWindow: log.feeWindow}).del().asCallback(callback);
}
