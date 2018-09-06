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
const BLOCK_DETAIL_PROGRESS_INTERVAL_MS = 5000;

interface BlockDetailsByBlock {
  [blockNumber: number]: BlockDetail;
}

function extractBlockNumbers(batchOfAugurLogs: Array<FormattedEventLog>) {
  return _.uniq(batchOfAugurLogs.map((augurLog) => augurLog.blockNumber));
}

async function fetchAllBlockDetails(augur: Augur, blockNumbers: Array<number>): Promise<BlockDetailsByBlock> {
  return new Promise<BlockDetailsByBlock>((resolve, reject) => {
    if (blockNumbers.length === 0) return resolve([]);
    console.log(`Fetching blocks details from ${blockNumbers[0]} to ${blockNumbers[blockNumbers.length - 1]}`);
    let fetchedBlockCount = 0;
    let highestBlockFetched = 0;
    const progressInterval = setInterval(() => console.log(`Fetched ${fetchedBlockCount} / ${blockNumbers.length} block details (current: ${highestBlockFetched})`), BLOCK_DETAIL_PROGRESS_INTERVAL_MS);
    mapLimit(blockNumbers, BLOCK_DOWNLOAD_PARALLEL_LIMIT, (blockNumber, nextBlockNumber) => {
      augur.rpc.eth.getBlockByNumber([blockNumber, false], (err: Error|null, block: BlockDetail): void => {
        if (err || block == null) return nextBlockNumber(new Error("Could not get block"));
        fetchedBlockCount++;
        if (blockNumber > highestBlockFetched) highestBlockFetched = blockNumber;
        nextBlockNumber(undefined, [blockNumber, block]);
      });
    }, (err: Error|undefined, blockDetails: Array<[number, BlockDetail]>) => {
      clearInterval(progressInterval);
      if (err) return reject(err);
      const blockDetailsByBlock = _.fromPairs(blockDetails);
      resolve(blockDetailsByBlock);
    });
  });
}

async function processBatchOfLogs(db: Knex, augur: Augur, allAugurLogs: Array<FormattedEventLog>, blockNumbers: Array<number>, blockDetailsByBlockPromise: Promise<BlockDetailsByBlock>) {
  return new Promise(async (resolve, reject) => {
    const blockDetailsByBlock = await blockDetailsByBlockPromise;
    const logsByBlock: { [blockNumber: number]: Array<FormattedEventLog> } = _.groupBy(allAugurLogs, (log) => log.blockNumber);
    eachSeries(blockNumbers, (blockNumber: number, nextBlock: ErrorCallback) => {
      const logs = logsByBlock[blockNumber];
      db.transaction((trx: Knex.Transaction): void => {
        processBlockByBlockDetails(trx, augur, blockDetailsByBlock[blockNumber], (err: Error|null) => {
          if (err) {
            trx.rollback(err);
            return;
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
            if (err) trx.rollback(err);
            else trx.commit();
          });
        });
      }).then(() => {
        nextBlock(null);
      }).catch(nextBlock);
    }, (err) => {
      if (err) return reject(err);
      resolve();
    });
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
      const blockNumbers = extractBlockNumbers(batchOfAugurLogs);
      const blockDetailPromise = lastBlockDetails.then(() => fetchAllBlockDetails(augur, blockNumbers));
      lastBlockDetails = blockDetailPromise;
      batchLogProcessQueue.push(async (nextBatch) => {
        try {
          await processBatchOfLogs(db, augur, batchOfAugurLogs, blockNumbers, blockDetailPromise);
          nextBatch(null);
        } catch (err) {
          batchLogProcessQueue.kill();
          batchLogProcessQueue.pause();
          callback(err);
        }
      });
    },
    (err) => {
      if (!batchLogProcessQueue.paused) {
        batchLogProcessQueue.push(() => {
          callback(err);
          batchLogProcessQueue.kill();
        });
      }
    });
}
