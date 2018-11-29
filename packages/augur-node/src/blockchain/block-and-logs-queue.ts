import * as async from "async";
import { FormattedEventLog, BlockDetail } from "augur.js";
import { ErrorCallback } from "../types";
import { BlockDirection } from "./process-block";

interface LogQueue {
  [blockHash: string]: Array<FormattedEventLog>;
}

interface BlockQueue {
  [blockHash: string]: BlockDetail;
}

type BlockAndLogsProcessor = (direction: BlockDirection, block: BlockDetail, logs: Array<FormattedEventLog>) => Promise<void>;

export class BlockAndLogsQueue {
  private processQueue = async.queue((processFunction: (callback: ErrorCallback) => void, nextFunction: ErrorCallback): void => {
    processFunction(nextFunction);
  }, 1);
  private readonly logsQueue = {
    add: {} as LogQueue,
    remove: {} as LogQueue,
  };
  private readonly blockQueue = {
    add: {} as BlockQueue,
    remove: {} as BlockQueue,
  };
  constructor(private processor: BlockAndLogsProcessor) {
  }

  // Blockstream specifies specific ordering when adding and removing blocks+logs.
  // Add: Block, then logs
  // Remove: Logs, then block
  // Logs Add and Block Remove are both "sentinel events"
  public acceptAddLogs = (blockHash: string, logs: Array<FormattedEventLog>) => {
      const block = this.blockQueue.add[blockHash];
      delete this.blockQueue.add[blockHash];
      this.enqueueBlockProcessing("add", block, logs);
  }

  public acceptRemoveLogs = (blockHash: string, logs: Array<FormattedEventLog>) => {
      this.logsQueue.remove[blockHash] = logs;
  }

  public acceptAddBlock = (block: BlockDetail) => {
    this.blockQueue.add[block.hash] = block;
  }

  public acceptRemoveBlock = (block: BlockDetail) => {
    const logs = this.logsQueue.remove[block.hash];
    delete this.logsQueue.remove[block.hash];
    this.enqueueBlockProcessing("remove", block, logs);
  }

  public stop = () => {
    this.processQueue.pause();
  }

  private enqueueBlockProcessing(direction: BlockDirection, block: BlockDetail, logs: Array<FormattedEventLog>) {
    this.processQueue.push((next) => this.processor(direction, block, logs).then(() => next(null)).catch(next));
  }
}
