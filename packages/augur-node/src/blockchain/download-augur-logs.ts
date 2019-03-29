import Knex from "knex";
import * as _ from "lodash";
import { mapLimit, queue } from "async";
import { each } from "bluebird";
import { Augur, BlockDetail, BlockRange, ErrorCallback, FormattedEventLog } from "../types";
import { processLogByName } from "./process-logs";
import { insertTransactionHash, processBlockByBlockDetails } from "./process-block";
import { logger } from "../utils/logger";
import { logProcessors } from "./log-processors";
import { Log } from "@augurproject/api";

const BLOCK_DOWNLOAD_PARALLEL_LIMIT = 15;

interface BlockDetailsByBlock {
  [blockNumber: number]: BlockDetail;
}

function extractBlockNumbers(batchOfAugurLogs: Array<FormattedEventLog>): Array<number> {
  const ublockNumbers = _.map(batchOfAugurLogs, "blockNumber");
  const blockNumbers = _.compact<number>(ublockNumbers);
  return _.uniqBy<number>(blockNumbers, "blockNumber");
}

function getBlockNumbersInRange(blockRange: BlockRange): Array<number> {
  const middleBlockNumber = Math.floor((blockRange.fromBlock + blockRange.toBlock) / 2);
  return _.uniq([blockRange.fromBlock, middleBlockNumber, blockRange.toBlock]);
}

async function fetchAllBlockDetails(augur: Augur, blockNumbers: Array<number>): Promise<BlockDetailsByBlock> {
  return new Promise<BlockDetailsByBlock>((resolve, reject) => {
    if (blockNumbers.length === 0) return resolve([]);
    console.log(`Fetching blocks details from ${blockNumbers[0]} to ${blockNumbers[blockNumbers.length - 1]}`);
    let fetchedBlockCount = 0;
    let highestBlockFetched = 0;
    mapLimit(blockNumbers, BLOCK_DOWNLOAD_PARALLEL_LIMIT, async (blockNumber, nextBlockNumber) => {
      try {
        const block = await augur.provider.getBlock(blockNumber);
        if (block == null) return nextBlockNumber(new Error(`Block ${blockNumber} returned null response. This is usually an issue with a partially sync'd parity warp node. See: https://github.com/paritytech/parity-ethereum/issues/7411`));

        fetchedBlockCount++;
        if (fetchedBlockCount % 10 === 0) console.log(`Fetched ${fetchedBlockCount} / ${blockNumbers.length} block details (current: ${highestBlockFetched})`);
        if (blockNumber > highestBlockFetched) highestBlockFetched = blockNumber;
        nextBlockNumber(undefined, [blockNumber, block]);
      } catch (e) {
        return nextBlockNumber(new Error("Could not get block"));
      }
    }, (err: Error|undefined, blockDetails: Array<[number, BlockDetail]>) => {
      if (err) return reject(err);
      const blockDetailsByBlock = _.fromPairs(blockDetails);
      resolve(blockDetailsByBlock);
    });
  });
}

async function processBatchOfLogs(db: Knex, augur: Augur, allAugurLogs: Array<Log>, blockNumbers: Array<number>, blockDetailsByBlockPromise: Promise<BlockDetailsByBlock>) {
  const blockDetailsByBlock = await blockDetailsByBlockPromise;
  const logsByBlock: { [blockNumber: number]: Array<Log> } = _.groupBy(allAugurLogs, (log) => log.blockNumber);
  await each(blockNumbers, async (blockNumber: number) => {
    const blockDetail = blockDetailsByBlock[blockNumber];
    const logs = logsByBlock[blockNumber];
    if (logs === undefined || logs.length === 0) return;
    const dbWritePromises: Array<Promise<(db: Knex) => Promise<void>>> = [];
    await each(logs, async (log: Log) => {
      const dbWritePromise = processLogByName(augur, log, false);
      if (dbWritePromise != null) {
        dbWritePromises.push(dbWritePromise);
      } else {
        logger.info("Log processor does not exist:", JSON.stringify(log));
      }
    });
    const dbWriteFunctions = await Promise.all(dbWritePromises);
    await db.transaction(async (trx: Knex.Transaction) => {
      await processBlockByBlockDetails(trx, augur, blockDetail, true);
      await each(logs, async (log) => await insertTransactionHash(trx, blockNumber, log.transactionHash));
      logger.info(`Processing ${dbWriteFunctions.length} logs`);
      for (const dbWriteFunction of dbWriteFunctions) {
        await dbWriteFunction(trx);
      }
    });
  });
}

export async function downloadAugurLogs(db: Knex, augur: Augur, fromBlock: number, endBlockNumber: number, blocksPerChunk: number|undefined=50):Promise<void>  {
  const batchLogProcessQueue = queue((processFunction: (callback: ErrorCallback) => void, nextFunction: ErrorCallback): void => {
    processFunction(nextFunction);
  }, 1);

  logger.info(`Getting Augur logs from block ${fromBlock} to block ${endBlockNumber}`);
  let lastBlockDetails = new Promise<BlockDetailsByBlock>((resolve) => resolve([]));
  let highestSyncedBlockNumber = fromBlock;
  const goalBlock = endBlockNumber;

  while (highestSyncedBlockNumber < goalBlock) {
    const toBlock = Math.min(highestSyncedBlockNumber + blocksPerChunk, endBlockNumber);

    const logsPromises = Object.keys(logProcessors.Augur).map(async (event) => {
      const topics: Array<string | Array<string>> = augur.events.getEventTopics(event);
      return await augur.provider.getLogs({
        fromBlock: highestSyncedBlockNumber,
        toBlock,
        address: augur.addresses.Augur,
        topics
      });
    });
    const deepLogs = await Promise.all(logsPromises);
    const batchOfAugurLogs = _.flatten(deepLogs);
    const blockNumbers = batchOfAugurLogs.length > 0 ? extractBlockNumbers(batchOfAugurLogs) : getBlockNumbersInRange({
      fromBlock: highestSyncedBlockNumber,
      toBlock
    });

    const blockDetailPromise = fetchAllBlockDetails(augur, blockNumbers);
    await processBatchOfLogs(db, augur, batchOfAugurLogs, blockNumbers, blockDetailPromise);

    highestSyncedBlockNumber = toBlock;
  }

  // augur.events.getAllAugurLogs({ fromBlock, toBlock, blocksPerChunk }, (batchOfAugurLogs: Array<FormattedEventLog>, blockRange: BlockRange): void => {
  //     if (!batchOfAugurLogs || batchLogProcessQueue.paused) return;
  //     const blockNumbers = batchOfAugurLogs.length > 0 ? extractBlockNumbers(batchOfAugurLogs) : getBlockNumbersInRange(blockRange);
  //     const blockDetailPromise = lastBlockDetails.then(() => fetchAllBlockDetails(augur, blockNumbers));
  //     lastBlockDetails = blockDetailPromise;
  //     batchLogProcessQueue.push(async (nextBatch) => {
  //       try {
  //         await processBatchOfLogs(db, augur, batchOfAugurLogs, blockNumbers, blockDetailPromise);
  //         nextBatch(null);
  //       } catch (err) {
  //         batchLogProcessQueue.kill();
  //         batchLogProcessQueue.pause();
  //         callback(err);
  //       }
  //     });
  //   },
  //   (err: Error) => {
  //     if (!batchLogProcessQueue.paused) {
  //       batchLogProcessQueue.push(() => {
  //         callback(err);
  //         batchLogProcessQueue.kill();
  //       });
  //     }
  //   });
}
