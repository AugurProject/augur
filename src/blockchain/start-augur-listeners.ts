import { Augur, FormattedEventLog } from "augur.js";
import * as _ from "lodash";
import * as Knex from "knex";
import { BlockDetail, ErrorCallback } from "../types";
import { logProcessors } from "./log-processors";
import { BlockAndLogsQueue } from "./block-and-logs-queue";
import { BlockDirection, processBlockAndLogs } from "./process-block";

export function startAugurListeners(db: Knex, augur: Augur, highestBlockNumber: number, errorCallback: ErrorCallback): BlockAndLogsQueue {
  const blockAndLogsQueue = new BlockAndLogsQueue(async (direction: BlockDirection, block: BlockDetail, logs: Array<FormattedEventLog>) => {
    return processBlockAndLogs(db, augur, direction, block, logs).catch((err) => {
      errorCallback(err);
      throw(err);
    });
  });
  const eventsToSubscribe = _.mapValues(logProcessors, (contractEvents) => {
    return _.keys(contractEvents);
  });
  augur.events.startBlockchainEventListeners(
    eventsToSubscribe,
    highestBlockNumber,
    blockAndLogsQueue.acceptAddLogs,
    blockAndLogsQueue.acceptRemoveLogs,
  );
  augur.events.startBlockListeners({
    onAdded: blockAndLogsQueue.acceptAddBlock,
    onRemoved: blockAndLogsQueue.acceptRemoveBlock,
  });
  return blockAndLogsQueue;
}
