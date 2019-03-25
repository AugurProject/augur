import * as _ from "lodash";
import Knex from "knex";
import { Augur, BlockDetail, ErrorCallback, FormattedEventLog } from "../types";
import { logProcessors } from "./log-processors";
import { BlockAndLogsQueue } from "./block-and-logs-queue";
import { BlockDirection, processBlockAndLogs } from "./process-block";

export function startAugurListeners(db: Knex, pouch: PouchDB.Database, augur: Augur, highestBlockNumber: number, databaseDir: string, isWarpSync: boolean, errorCallback: ErrorCallback): BlockAndLogsQueue {
  const blockAndLogsQueue = new BlockAndLogsQueue(async (direction: BlockDirection, block: BlockDetail, logs: Array<FormattedEventLog>) => {
    return processBlockAndLogs(db, pouch, augur, direction, block, false, logs, databaseDir, isWarpSync).catch((err) => {
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
