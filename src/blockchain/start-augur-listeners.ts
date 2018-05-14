import Augur from "augur.js";
import * as _ from "lodash";
import * as Knex from "knex";
import { BlockDetail, ErrorCallback } from "../types";
import { makeLogListener } from "./make-log-listener";
import { processBlock, processBlockRemoval } from "./process-block";
import { logProcessors } from "./log-processors";

export function startAugurListeners(db: Knex, augur: Augur, highestBlockNumber: number, callback: ErrorCallback): void {
  const eventCallbacks = _.mapValues(logProcessors, (contractEvents, contractName) => {
    return _.mapValues(contractEvents, (eventFunctions, eventName) => makeLogListener(augur, contractName, eventName));
  });
  augur.events.startBlockchainEventListeners(
    eventCallbacks,
    highestBlockNumber,
    (err: Error) => {
      if (err) return callback(err);
      augur.events.startBlockListeners({
        onAdded: (block: BlockDetail): void => processBlock(db, augur, block, callback),
        onRemoved: (block: BlockDetail): void => processBlockRemoval(db, block, callback),
      });
      callback(null);
    },
  );
}
