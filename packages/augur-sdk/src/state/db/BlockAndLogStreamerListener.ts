import { EthersProviderBlockStreamAdapter, ExtendedLog } from "blockstream-adapters";
import { Block, BlockAndLogStreamer, Log as BlockStreamLog } from "ethereumjs-blockstream";
import { Filter } from "ethereumjs-blockstream/output/source/models/filters";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Log, ParsedLog } from "@augurproject/types";
import * as _ from "lodash";

export interface BlockAndLogStreamerInterface<TBlock extends Block, TLog extends BlockStreamLog> {
  reconcileNewBlock: (block: TBlock) => Promise<void>;
  addLogFilter: (filter: Filter) => string;
  removeLogFilter: (token: string) => void;
  subscribeToOnBlockAdded: (onBlockAdded: (block: TBlock) => void) => string;
  subscribeToOnBlockRemoved: (onBlockRemoved: (block: TBlock) => void) => string;
  subscribeToOnLogsAdded: (onLogsAdded: (blockHash: string, logs: TLog[]) => void) => string;
  subscribeToOnLogsRemoved: (onLogsRemoved: (blockHash: string, logs: TLog[]) => void) => string;
}

export interface BlockAndLogStreamerListenerDependencies {
  blockAndLogStreamer: BlockAndLogStreamerInterface<Block, ExtendedLog>;
  getBlockByHash: (hashOrTag: string) => Promise<Block>;
  getEventTopics: (eventName: string) => string[];
  parseLogs: (logs: Log[]) => ParsedLog[];
  listenForNewBlocks: (callback: (block: Block) => Promise<void>) => void;
  getEventContractAddress: (eventName: string) => string;
}

type GenericLogCallbackType<T, P> = (blockIdentifier: T, logs: P[]) => void;

type BlockCallback = (block: Block) => void;

export type LogCallbackType = GenericLogCallbackType<number, ParsedLog>;

export interface IBlockAndLogStreamerListener {
  listenForEvent(eventName: string | string[], onLogsAdded: LogCallbackType, onLogRemoved?: LogCallbackType): void;
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

export class BlockAndLogStreamerListener implements IBlockAndLogStreamerListener {
  private contractFilterUUIDs: {[address: string] : string } = {};
  private logCallbackMetaData: LogCallbackMetaData[] = [];
  private allLogsCallbackMetaData: LogCallbackType[] = [];
  private notifyNewBlockAfterLogsProcessMetadata:LogCallbackType[] = [];


  constructor(private deps: BlockAndLogStreamerListenerDependencies) {
    deps.blockAndLogStreamer.subscribeToOnLogsAdded(this.onLogsAdded);
  }

  static create(provider: EthersProvider, getEventTopics: ((eventName: string) => string[]), parseLogs: (logs: Log[]) => ParsedLog[], getEventContractAddress: (eventName: string) => string) {
    const dependencies = new EthersProviderBlockStreamAdapter(provider);
    const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(dependencies.getBlockByHash, dependencies.getLogs, (error: Error) => {
      console.error(error);
    });

    return new BlockAndLogStreamerListener({
      blockAndLogStreamer,
      getEventTopics,
      getBlockByHash: dependencies.getBlockByHash,
      listenForNewBlocks: dependencies.startPollingForBlocks,
      parseLogs,
      getEventContractAddress,
    });
  }

  private filterCallbackByTopic(topics: EventTopics, callback: LogCallbackType): LogCallbackType {
    if(!Array.isArray(topics)) topics = [topics];
    return (blockNumber: number, logs: Log[]) => {
      const filteredLogs = logs.filter((log) => !_.isEmpty(_.intersection(log.topics, topics)));
      const parsedLogs = this.deps.parseLogs(filteredLogs);

      callback(blockNumber, parsedLogs);
    };
  }

  listenForEvent(eventNames: string | string[], onLogsAdded: LogCallbackType, onLogsRemoved?: LogCallbackType): void {
    if(!Array.isArray(eventNames)) eventNames = [eventNames];

    // Group by contract address
    const eventNamesByContractAddress = _.groupBy(eventNames, this.deps.getEventContractAddress);

    // For each contract address update the logCallbackMetaData and update the respctive filter for that contract
    _.forEach(eventNamesByContractAddress, (contractEventNames, contractAddress) => {

      // get all topics for the provided eventNames
      const topics = contractEventNames.reduce((acc, eventName) => {
        const topics = this.deps.getEventTopics(eventName);
        return [
          ...acc,
          ...topics,
        ];
      }, []);

      // Update the callbacks list with these events and the specified callback
      this.logCallbackMetaData.push({
        contractAddress,
        eventNames: contractEventNames,
        topics,
        onLogsAdded: this.filterCallbackByTopic(topics, onLogsAdded)
      });

      const allContractTopics = this.logCallbackMetaData.reduce((acc, metaData) => {
        if (metaData.contractAddress == contractAddress) {
          return [
            ...acc,
            ...metaData.topics
          ]
        }
        return acc;
      }, []);

      // Remove currently active filter if present.
      if (this.contractFilterUUIDs[contractAddress]) {
        this.deps.blockAndLogStreamer.removeLogFilter(this.contractFilterUUIDs[contractAddress]);
      }

      this.contractFilterUUIDs[contractAddress] = this.deps.blockAndLogStreamer.addLogFilter({
        address: contractAddress,
        topics: [
          allContractTopics,
        ],
      });
    });
  }

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
    const wrapper = (callback: (blockNumber: number) => void) => (block: Block) => {
      const blockNumber: number = parseInt(block.number, 10);
      callback(blockNumber);
    };
    this.deps.blockAndLogStreamer.subscribeToOnBlockRemoved(wrapper(callback));
  }

  onLogsAdded = async (blockHash: string, extendedLogs: ExtendedLog[]) => {
    const block = await this.deps.getBlockByHash(blockHash);

    if (block) {
      const blockNumber: number = parseInt(block.number, 10);

      const logs: Log[] = extendedLogs.map((log: ExtendedLog) => ({
        ...log,
        name: '',
        logIndex: parseInt(log.logIndex, 10),
        blockNumber: parseInt(log.blockNumber, 10),
      }));

      const logCallbackPromises = this.logCallbackMetaData.map((cb) => cb.onLogsAdded(blockNumber, logs));

      // Assuming all db updates will be complete when these promises resolve.
      await Promise.all(logCallbackPromises);

      // Fire this after all "filtered" log callbacks are processed.
      const allLogsCallbackMetaDataPromises = this.allLogsCallbackMetaData.map((cb) => cb(blockNumber, this.deps.parseLogs(logs)));
      await Promise.all(allLogsCallbackMetaDataPromises);

      // let the controller know a new block was added so it can update the UI
      const notifyNewBlockAfterLogsProcessMetadataPromises = this.notifyNewBlockAfterLogsProcessMetadata.map((cb) => cb(blockNumber, this.deps.parseLogs(logs)));
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
}
