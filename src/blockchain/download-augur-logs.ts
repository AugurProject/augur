import { Augur } from "augur.js";
import { eachSeries, mapLimit, queue } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { BlockDetail, ErrorCallback, FormattedEventLog } from "../types";
import { processLog } from "./process-logs";
import { logProcessors } from "./log-processors";
import { processBlockByBlockDetails } from "./process-block";
import { logger } from "../utils/logger";

const BLOCK_DOWNLOAD_PARALLEL_LIMIT = 15;

interface BlockDetailsByBlock {
  [blockNumber: number]: BlockDetail;
}

async function fetchAllBlockDetails(augur: Augur, blockNumbers: Array<number>): Promise<BlockDetailsByBlock> {
  return new Promise<BlockDetailsByBlock>((resolve, reject) => {
    console.log("fetching blocks, ", blockNumbers[0], blockNumbers[blockNumbers.length - 1]);
    mapLimit(blockNumbers, BLOCK_DOWNLOAD_PARALLEL_LIMIT, (blockNumber, nextBlockNumber) => {
      augur.rpc.eth.getBlockByNumber([blockNumber, false], (err: Error|null, block: BlockDetail): void => {
        if (err || block == null) return nextBlockNumber(new Error("Could not get block"));
        nextBlockNumber(undefined, [blockNumber, block]);
      });
    }, (err: Error|undefined, blockDetails: Array<[number, BlockDetail]>) => {
      if (err) return reject(err);
      const blockDetailsByBlock = _.fromPairs(blockDetails);
      resolve(blockDetailsByBlock);
    });
  });
}

function processBatchOfLogs(db: Knex, augur: Augur, allAugurLogs: Array<FormattedEventLog>, blockNumbers: Array<number>, blockDetailsByBlockPromise: Promise<BlockDetailsByBlock>, callback: ErrorCallback) {
  blockDetailsByBlockPromise.then((blockDetailsByBlock) => {
    const logsByBlock: { [blockNumber: number]: Array<FormattedEventLog> } = _.groupBy(allAugurLogs, (log) => log.blockNumber);
    eachSeries(blockNumbers, (blockNumber: number, nextBlock: ErrorCallback) => {
      const logs = logsByBlock[blockNumber];
      db.transaction((trx: Knex.Transaction): void => {
        processBlockByBlockDetails(trx, augur, blockDetailsByBlock[blockNumber], (err: Error|null) => {
          if (err) {
            return nextBlock(err);
          }
          if (logs.length > 0) logger.info(`Processing ${logs.length} logs`);
          eachSeries(logs, (log: FormattedEventLog, nextLog: ErrorCallback) => {
            const contractName = log.contractName;
            const eventName = log.eventName;
            if (logProcessors[contractName] == null || logProcessors[contractName][eventName] == null) {
              logger.info("Log processor does not exist:", contractName, eventName);
              nextLog(null);
            } else {
              processLog(trx, augur, log, logProcessors[contractName][eventName], nextLog);
            }
          }, (err: Error|null) => {
            if (err) {
              trx.rollback(err);
              return nextBlock(err);
            } else {
              trx.commit();
              return nextBlock(null);
            }
          });
        });
      });
    }, callback);
  });
}

export function downloadAugurLogs(db: Knex, augur: Augur, fromBlock: number, toBlock: number, callback: ErrorCallback): void {
  const batchLogProcessQueue = queue((processFunction: (callback: ErrorCallback) => void, nextFunction: ErrorCallback): void => {
    processFunction(nextFunction);
  }, 1);

  logger.info(`Getting Augur logs from block ${fromBlock} to block ${toBlock}`);
  let lastBlockDetails = new Promise<BlockDetailsByBlock>((resolve) => resolve([]));
  augur.events.getAllAugurLogs({ fromBlock, toBlock }, (batchOfAugurLogs?: Array<FormattedEventLog>): void => {
    if (!batchOfAugurLogs || batchLogProcessQueue.paused) return;
    const blockNumbers = _.uniq(batchOfAugurLogs.map((augurLog) => augurLog.blockNumber));
    const blockDetailPromise = lastBlockDetails.then(() => fetchAllBlockDetails(augur, blockNumbers));
    lastBlockDetails = blockDetailPromise;
    batchLogProcessQueue.push((nextBatch) => processBatchOfLogs(db, augur, batchOfAugurLogs, blockNumbers, blockDetailPromise, (err: Error|null) => {
      if (err) {
        batchLogProcessQueue.kill();
        batchLogProcessQueue.pause();
        callback(err);
      } else {
        nextBatch(null);
      }
    }));
  }, (err) => {
    if (!batchLogProcessQueue.paused) {
      batchLogProcessQueue.push(() => {
        callback(err);
        batchLogProcessQueue.kill();
      });
    }
  });
}
