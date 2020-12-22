import { ParsedLog, Filter, Log } from '@augurproject/types';
import {
  EthersProviderBlockStreamAdapter,
  ExtendedLog,
} from '../../lib/blockstream-adapters';
import {
  Block,
  BlockAndLogStreamer,
  Log as BlockStreamLog,
} from 'ethereumjs-blockstream';
import * as _ from 'lodash';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { LogFilterAggregatorInterface } from '../logs/LogFilterAggregator';
import { AbstractSyncStrategy } from './AbstractSyncStrategy';
import { SyncStrategy } from './index';
import { BigNumber } from 'bignumber.js';
import { AsyncQueue, queue } from 'async';

interface BlockQueueTask {
  block: any;
}

// This matches the JSON-rpc spec.
export interface ExtendedFilter {
  blockhash?: string;
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string | string[];
  topics?: Array<string | string[]>;
}

export interface BlockAndLogStreamerInterface<
  TBlock extends Block,
  TLog extends BlockStreamLog
> {
  reconcileNewBlock: (block: TBlock) => Promise<void>;
  subscribeToOnBlockAdded: (onBlockAdded: (block: TBlock) => void) => string;
  subscribeToOnBlockRemoved: (
    onBlockRemoved: (block: TBlock) => void
  ) => string;
}

export interface BlockAndLogStreamerListenerDependencies {
  getLogs: (filter: Filter) => Promise<Log[]>;
  blockAndLogStreamer: BlockAndLogStreamerInterface<Block, ExtendedLog>;
  listenForNewBlocks: (callback: (block: Block) => Promise<void>) => void;
  onLogsAdded: (blockNumber: number, logs: Log[]) => Promise<void>;
}

type BlockCallback = (block: Block) => void;

export interface BlockAndLogStreamerListenerInterface {
  listenForBlockRemoved(callback: (blockNumber: number) => void): void;
  listenForBlockAdded(callback: (block: Block) => void): void;
}

export class BlockAndLogStreamerSyncStrategy extends AbstractSyncStrategy
  implements BlockAndLogStreamerListenerInterface, SyncStrategy {
  private currentSuspectBlocks: Block[] = [];
  private blockQueue: AsyncQueue<BlockQueueTask>;

  constructor(
    getLogs: (filter: Filter) => Promise<Log[]>,
    contractAddresses: string[],
    onLogsAdded: (blockNumber: number, logs: ParsedLog[]) => Promise<void>,
    private blockAndLogStreamer: BlockAndLogStreamerInterface<
      Block,
      ExtendedLog
    >,
    private listenForNewBlocks: (
      callback: (block: Block) => Promise<void>
    ) => void,
    protected parseLogs: (logs: Log[]) => ParsedLog[],
    private blockWindowWidth = 5
  ) {
    super(getLogs, contractAddresses, onLogsAdded);
    this.blockQueue = queue(
      async (task: BlockQueueTask) => {
        return this.processBlockAdded(task.block);
      },
      1
    );
    this.listenForBlockAdded(this.onBlockAdded);
  }

  static create(
    provider: EthersProvider,
    contractAddresses: string[],
    logFilterAggregator: LogFilterAggregatorInterface,
    parseLogs: (logs: Log[]) => ParsedLog[]
  ) {
    const {
      getLogs,
      getBlockByHash,
      startPollingForBlocks,
    } = new EthersProviderBlockStreamAdapter(provider);
    const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(
      getBlockByHash,
      getLogs,
      (error: Error) => {
        console.error(error);
      }
    );

    return new BlockAndLogStreamerSyncStrategy(
      provider.getLogs,
      contractAddresses,
      logFilterAggregator.onLogsAdded,
      blockAndLogStreamer,
      startPollingForBlocks,
      parseLogs
    );
  }

  listenForBlockAdded(callback: BlockCallback): void {
    const wrapper = (callback: BlockCallback) => (block: Block) => {
      callback(block);
    };
    this.blockAndLogStreamer.subscribeToOnBlockAdded(wrapper(callback));
  }

  listenForBlockRemoved(callback: (blockNumber: number) => void): void {
    const wrapper = (callback: (blockNumber: number) => void) => (
      block: Block
    ) => {
      const blockNumber: number = new BigNumber(block.number).toNumber();
      callback(blockNumber);
    };
    this.blockAndLogStreamer.subscribeToOnBlockRemoved(wrapper(callback));
  }

  async start(blockNumber: number) {
    console.log(`Syncing from ${blockNumber}`);

    // This kicks off ethers polling.
    this.listenForNewBlocks(this.onNewBlock);
    return 0;
  }

  onNewBlock = async (block: Block) => {
    if (block) {
      await this.blockAndLogStreamer.reconcileNewBlock(block);
    }
  };

  onBlockAdded = async (block: Block) => {
    return new Promise((resolve, reject) => {
      this.blockQueue.push({ block }, (err, results) => {
        if (err) {
          reject(err);
        }
          resolve(results);
      });
    });
  }

  processBlockAdded = async (block: Block) => {
    this.currentSuspectBlocks.push(block);

    const suspectBlockNumbers = this.currentSuspectBlocks.map(b => {
      return new BigNumber(b.number).toNumber();
    });

    // getAugurContractAddresses

    const logs = await this.getLogs({
      address: this.contractAddresses,
      fromBlock: Math.min(...suspectBlockNumbers),
      toBlock: Math.max(...suspectBlockNumbers),
    });

    const blocksReturned = logs.map(log => {
      return log.blockNumber;
    });

    const maxBlockNumberReturned = Math.max(...blocksReturned);
    const maxBlockIndex = Math.max(
      this.currentSuspectBlocks.findIndex(
        block =>
          new BigNumber(block.number).toNumber() === maxBlockNumberReturned
      ),
      this.currentSuspectBlocks.length - this.blockWindowWidth
    );

    const blocksToEmit = this.currentSuspectBlocks.slice(0, maxBlockIndex + 1);
    this.currentSuspectBlocks = this.currentSuspectBlocks.slice(
      maxBlockIndex + 1
    );

    for (let i = 0; i < blocksToEmit.length; i++) {
      const currentBlock = blocksToEmit[i];
      const currentBlockNumber = new BigNumber(currentBlock.number).toNumber();

      const logsToEmit = logs.filter(
        log => currentBlockNumber === new BigNumber(log.blockNumber).toNumber()
      );

      await this.onLogsAdded(currentBlockNumber, this.parseLogs(logsToEmit));
    }
  };

  onBlockRemoved = async (block: Block) => {
    // We have no suspect blocks. Letting other mechanisms handle actual log rollback.
    if (this.currentSuspectBlocks.length === 0) return;

    const mostRecentBlock = _.last(this.currentSuspectBlocks);
    if (
      mostRecentBlock.number === block.number &&
      mostRecentBlock.hash === block.hash
    ) {
      this.currentSuspectBlocks.pop();
      return;
    }

    throw new Error('Unknown block rolling back');
  };
}
