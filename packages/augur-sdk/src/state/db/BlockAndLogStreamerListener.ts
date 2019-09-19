import { EthersProviderBlockStreamAdapter, ExtendedLog } from "blockstream-adapters";
import { Block, BlockAndLogStreamer, Log as BlockStreamLog } from "ethereumjs-blockstream";
import { Filter } from "ethereumjs-blockstream/output/source/models/filters";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Log, ParsedLog } from "@augurproject/types";
import * as _ from "lodash";
import { augurEmitter } from "../../events";

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
  address: string;
  blockAndLogStreamer: BlockAndLogStreamerInterface<Block, ExtendedLog>;
  getBlockByHash: (hashOrTag: string) => Promise<Block>;
  getEventTopics: (eventName: string) => string[];
  parseLogs: (logs: Log[]) => ParsedLog[];
  listenForNewBlocks: (callback: (block: Block) => Promise<void>) => void;
}

type GenericLogCallbackType<T, P> = (blockIdentifier: T, logs: P[]) => void;

type BlockCallback = (block: Block) => void;

export type LogCallbackType = GenericLogCallbackType<number, ParsedLog>;

export interface IBlockAndLogStreamerListener {
  listenForEvent(eventName: string | string[], onLogsAdded: LogCallbackType, onLogRemoved?: LogCallbackType): void;
  listenForBlockRemoved(callback: (blockNumber: number) => void): void;
  listenForBlockAdded(callback: (block: Block) => void): void;
  startBlockStreamListener(): void;
}

type EventTopics = string | string[];

interface LogCallbackMetaData {
  eventNames: EventTopics;
  onLogsAdded: LogCallbackType;
  topics: string[];
}

export class BlockAndLogStreamerListener implements IBlockAndLogStreamerListener {
  private address: string;
  private currentFilterUUID: string;
  private logCallbackMetaData:LogCallbackMetaData[] = [];

  constructor(private deps: BlockAndLogStreamerListenerDependencies) {
    this.address = deps.address;
    deps.blockAndLogStreamer.subscribeToOnLogsAdded(this.onLogsAdded);
  }

  static create(provider: EthersProvider, address: string, getEventTopics: ((eventName: string) => string[]),   parseLogs: (logs: Log[]) => ParsedLog[]) {
    const dependencies = new EthersProviderBlockStreamAdapter(provider);
    const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(dependencies.getBlockByHash, dependencies.getLogs, (error: Error) => {
      console.error(error);
    });

    return new BlockAndLogStreamerListener({
      address,
      blockAndLogStreamer,
      getEventTopics,
      getBlockByHash: dependencies.getBlockByHash,
      listenForNewBlocks: dependencies.startPollingForBlocks,
      parseLogs,
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

    const topics = eventNames.reduce((acc, eventName) => {
      const topics = this.deps.getEventTopics(eventName);
      return [
        ...acc,
        ...topics,
      ];
    }, []);

    this.logCallbackMetaData.push({
      eventNames,
      topics,
      // This is where we create the filter on our side.
      onLogsAdded: this.filterCallbackByTopic(topics, onLogsAdded),
    });

    const allTopics = this.logCallbackMetaData.map((l) => l.topics);
    const allTopicsInOneArray = _.concat([], ...allTopics);

    // Remove currently active filter if present.
    if(this.currentFilterUUID) {
      this.deps.blockAndLogStreamer.removeLogFilter(this.currentFilterUUID);
    }

    this.currentFilterUUID = this.deps.blockAndLogStreamer.addLogFilter({
      address: this.address,
      topics: [
        allTopicsInOneArray,
      ],
    });
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

      await Promise.all(logCallbackPromises);

      // let the controller know a new block was added so it can update the UI
      augurEmitter.emit('controller:new:block', block);
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
