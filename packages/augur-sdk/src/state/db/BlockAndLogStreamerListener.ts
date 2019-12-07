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
import * as fp from 'lodash/fp';

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
  subscribeToOnLogsAdded: (
    onLogsAdded: (blockHash: string, logs: TLog[]) => void
  ) => string;
  subscribeToOnLogsRemoved: (
    onLogsRemoved: (blockHash: string, logs: TLog[]) => void
  ) => string;
}

export interface BlockAndLogStreamerListenerDependencies {
  blockAndLogStreamer: BlockAndLogStreamerInterface<Block, ExtendedLog>;
  getBlockByHash: (hashOrTag: string) => Promise<Block>;
  getLogs: (filter: Filter) => Promise<Log[]>;
  getEventTopics: (eventName: string) => string[];
  parseLogs: (logs: Log[]) => ParsedLog[];
  listenForNewBlocks: (callback: (block: Block) => Promise<void>) => void;
  getEventContractAddress: (eventName: string) => string;
}

type GenericLogCallbackType<T, P> = (blockIdentifier: T, logs: P[]) => void;

type BlockCallback = (block: Block) => void;

export type LogCallbackType = GenericLogCallbackType<number, ParsedLog>;

export interface BlockAndLogStreamerListenerInterface {
  listenForEvent(
    eventName: string | string[],
    onLogsAdded: LogCallbackType,
    onLogRemoved?: LogCallbackType
  ): void;
  listenForAllEvents(onLogsAdded: LogCallbackType): void;
  notifyNewBlockAfterLogsProcess(onLogsAdded: LogCallbackType);
  listenForBlockRemoved(callback: (blockNumber: number) => void): void;
  listenForBlockAdded(callback: (block: Block) => void): void;
  startBlockStreamListener(): void;
}

type EventTopics = string | string[];

interface LogCallbackMetaData {
  contractAddress: string;
  eventNames: EventTopics;
  onLogsAdded: LogCallbackType;
  topics: string[];
}

export class BlockAndLogStreamerListener
  implements BlockAndLogStreamerListenerInterface {
  private logCallbackMetaData: LogCallbackMetaData[] = [];
  private allLogsCallbackMetaData: LogCallbackType[] = [];
  private notifyNewBlockAfterLogsProcessMetadata: LogCallbackType[] = [];
  private currentSuspectBlocks: Block[] = [];

  constructor(private deps: BlockAndLogStreamerListenerDependencies, private blockWindowWidth = 5) {
    deps.blockAndLogStreamer.subscribeToOnBlockAdded(this.onBlockAdded);
    deps.blockAndLogStreamer.subscribeToOnBlockRemoved(this.onBlockRemoved);
  }

  static create(
    provider: EthersProvider,
    getEventTopics: (eventName: string) => string[],
    parseLogs: (logs: Log[]) => ParsedLog[],
    getEventContractAddress: (eventName: string) => string
  ) {
    const dependencies = new EthersProviderBlockStreamAdapter(provider);
    const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(
      dependencies.getBlockByHash,
      dependencies.getLogs,
      (error: Error) => {
        console.error(error);
      }
    );

    return new BlockAndLogStreamerListener({
      blockAndLogStreamer,
      getEventTopics,
      getBlockByHash: dependencies.getBlockByHash,
      listenForNewBlocks: dependencies.startPollingForBlocks,
      parseLogs,
      getLogs: provider.getLogs,
      getEventContractAddress,
    });
  }

  private filterCallbackByContractAddressAndTopic(
    contractAddress: string,
    topics: EventTopics,
    callback: LogCallbackType
  ): LogCallbackType {
    if (!Array.isArray(topics)) topics = [topics];
    return (blockNumber: number, logs: Log[]) => {
      const filteredLogs = logs
        .filter(log => log.address === contractAddress)
        .filter(log => !_.isEmpty(_.intersection(log.topics, topics)));
      const parsedLogs = this.deps.parseLogs(filteredLogs);

      callback(blockNumber, parsedLogs);
    };
  }

  listenForEvent(
    eventNames: string | string[],
    onLogsAdded: LogCallbackType,
    onLogsRemoved?: LogCallbackType
  ): void {
    if (!Array.isArray(eventNames)) eventNames = [eventNames];

    // Group by contract address
    const eventNamesByContractAddress = _.groupBy(
      eventNames,
      this.deps.getEventContractAddress
    );

    // For each contract address update the logCallbackMetaData and update the respctive filter for that contract
    _.forEach(
      eventNamesByContractAddress,
      (contractEventNames, contractAddress) => {
        // get all topics for the provided eventNames
        const topics = contractEventNames.reduce((acc, eventName) => {
          const topics = this.deps.getEventTopics(eventName);
          return [...acc, ...topics];
        }, []);

        // Update the callbacks list with these events and the specified callback
        this.logCallbackMetaData.push({
          contractAddress,
          eventNames: contractEventNames,
          topics,
          onLogsAdded: this.filterCallbackByContractAddressAndTopic(
            contractAddress,
            topics,
            onLogsAdded
          ),
        });
      }
    );
  }

  // Note: this assumes we only have one topic per filter.
  buildFilter = (): ExtendedFilter => {
    const getTopics = fp.compose(
      (items:string[]) => {
        if(items.length > 0) {
          return [ items ];
        } else {
          return items;
        }
      },
      fp.uniq,
      fp.flatten,
      fp.map('topics'),
    );

    const getAddresses = fp.compose(
      fp.uniq,
      fp.map('contractAddress')
    );

    return {
      address: getAddresses(this.logCallbackMetaData),
      topics: getTopics(this.logCallbackMetaData),
    };
  };

  notifyNewBlockAfterLogsProcess(onBlockAdded: LogCallbackType) {
    this.notifyNewBlockAfterLogsProcessMetadata.push(onBlockAdded);
  }

  /**
   * @description Register a callback that will receive the sum total of all registered filters.
   * @param {LogCallbackType} onLogsAdded
   */
  listenForAllEvents(onLogsAdded: LogCallbackType): void {
    this.allLogsCallbackMetaData.push(onLogsAdded);
  }

  listenForBlockAdded(callback: BlockCallback): void {
    const wrapper = (callback: BlockCallback) => (block: Block) => {
      callback(block);
    };
    this.deps.blockAndLogStreamer.subscribeToOnBlockAdded(wrapper(callback));
  }

  listenForBlockRemoved(callback: (blockNumber: number) => void): void {
    const wrapper = (callback: (blockNumber: number) => void) => (
      block: Block
    ) => {
      const blockNumber: number = parseInt(block.number);
      callback(blockNumber);
    };
    this.deps.blockAndLogStreamer.subscribeToOnBlockRemoved(wrapper(callback));
  }

  onLogsAdded = async (blockHash: string, logs: Log[]) => {
    const block = await this.deps.getBlockByHash(blockHash);

    if (block) {
      const blockNumber: number = parseInt(block.number);

      const logCallbackPromises = this.logCallbackMetaData.map(cb =>
        cb.onLogsAdded(blockNumber, logs)
      );

      // Assuming all db updates will be complete when these promises resolve.
      await Promise.all(logCallbackPromises);

    // Fire this after all "filtered" log callbacks are processed.
      const allLogsCallbackMetaDataPromises = this.allLogsCallbackMetaData.map(
        cb => cb(blockNumber, this.deps.parseLogs(logs))
      );
      await Promise.all(allLogsCallbackMetaDataPromises);

      // let the controller know a new block was added so it can update the UI
      const notifyNewBlockAfterLogsProcessMetadataPromises = this.notifyNewBlockAfterLogsProcessMetadata.map(
        cb => cb(blockNumber, this.deps.parseLogs(logs))
      );
      await Promise.all(notifyNewBlockAfterLogsProcessMetadataPromises);
    }
  };

  startBlockStreamListener(): void {
    this.deps.listenForNewBlocks(this.onNewBlock);
  }

  onNewBlock = async (block: Block) => {
    if (block) {
      await this.deps.blockAndLogStreamer.reconcileNewBlock(block);
    }
  };

  onBlockAdded = async (block: Block) => {
    this.currentSuspectBlocks.push(block);

    const suspectBlockNumbers = this.currentSuspectBlocks.map(b => {
      return parseInt(b.number);
    });
    // Ethers doesn't support multople addresses. FIlter by topic
    // on node and filter by address on our side.
    // See: https://github.com/ethers-io/ethers.js/issues/473
    const { address, ...filter } = this.buildFilter();

    // With a wide open filter we get events from unknow sources.
    if(_.isEmpty(filter.topics)) return;

    const logs = await this.deps.getLogs({
      ...filter,

      fromBlock: Math.min(...suspectBlockNumbers),
      toBlock: Math.max(...suspectBlockNumbers),
    });

    const blocksReturned = logs.map(log => {
      return log.blockNumber;
    });

    const maxBlockNumberReturned = Math.max(...blocksReturned);
    const maxBlockIndex = Math.max(
      this.currentSuspectBlocks.findIndex(block => parseInt(block.number, 16) === maxBlockNumberReturned),
      this.currentSuspectBlocks.length - this.blockWindowWidth
    );

    const blocksToEmit = this.currentSuspectBlocks.slice(0, maxBlockIndex + 1);
    this.currentSuspectBlocks = this.currentSuspectBlocks.slice(maxBlockIndex + 1);

    for (let i = 0; i < blocksToEmit.length; i++) {
      const currentBlock = blocksToEmit[i];
      const logsToEmit = logs.filter((log) => parseInt(currentBlock.number, 16) === log.blockNumber);
      await this.onLogsAdded(currentBlock.hash, logsToEmit);
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
