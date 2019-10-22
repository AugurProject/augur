import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Filter, Log, ParsedLog } from '@augurproject/types';
import {
  EthersProviderBlockStreamAdapter,
  ExtendedLog,
} from 'blockstream-adapters';
import {
  Block,
  BlockAndLogStreamer,
  Log as BlockStreamLog,
} from 'ethereumjs-blockstream';
import * as _ from 'lodash';
import { LogFilterAggregatorInterface } from '../logs/LogFilterAggregator';
import { AbstractSyncStrategy } from './AbstractSyncStrategy';
import { SyncStrategy } from './index';

// This matches the JSON-rpc spec. Sadly Ethers doesn't support it fully.
export interface ExtendedFilter {
  blockhash?: string;
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: Array<string | string[]>;
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
  buildFilter: () => ExtendedFilter;
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

  constructor(
    getLogs: (filter: Filter) => Promise<Log[]>,
    buildFilter: () => ExtendedFilter,
    onLogsAdded: (blockNumber: number, logs: Log[]) => Promise<void>,
    private blockAndLogStreamer: BlockAndLogStreamerInterface<
      Block,
      ExtendedLog
    >,
    private listenForNewBlocks: (
      callback: (block: Block) => Promise<void>
    ) => void,
    private blockWindowWidth = 5
  ) {
    super(getLogs, buildFilter, onLogsAdded);
  }

  static create(
    provider: EthersProvider,
    logFilterAggregator: LogFilterAggregatorInterface
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
      logFilterAggregator.buildFilter,
      logFilterAggregator.onLogsAdded,
      blockAndLogStreamer,
      startPollingForBlocks
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
      const blockNumber: number = parseInt(block.number, 16);
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
    this.currentSuspectBlocks.push(block);

    const suspectBlockNumbers = this.currentSuspectBlocks.map(b => {
      return parseInt(b.number, 16);
    });
    // Ethers doesn't support multiple addresses. Filter by topic
    // on node and filter by address on our side.
    // See: https://github.com/ethers-io/ethers.js/issues/473
    const { address, ...filter } = this.buildFilter();

    // With a wide open filter we get events from unknown sources.
    if (_.isEmpty(filter.topics)) return;

    const logs = await this.getLogs({
      ...filter,

      fromBlock: Math.min(...suspectBlockNumbers),
      toBlock: Math.max(...suspectBlockNumbers),
    });

    const blocksReturned = logs.map(log => {
      return log.blockNumber;
    });

    const maxBlockNumberReturned = Math.max(...blocksReturned);
    const maxBlockIndex = Math.max(
      this.currentSuspectBlocks.findIndex(
        block => parseInt(block.number, 16) === maxBlockNumberReturned
      ),
      this.currentSuspectBlocks.length - this.blockWindowWidth
    );

    const blocksToEmit = this.currentSuspectBlocks.slice(0, maxBlockIndex + 1);
    this.currentSuspectBlocks = this.currentSuspectBlocks.slice(
      maxBlockIndex + 1
    );

    for (let i = 0; i < blocksToEmit.length; i++) {
      const currentBlock = blocksToEmit[i];
      const logsToEmit = logs.filter(
        log => parseInt(currentBlock.number, 16) === log.blockNumber
      );
      const currentBlockNumber = parseInt(currentBlock.number, 16);
      await this.onLogsAdded(currentBlockNumber, logsToEmit);
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
