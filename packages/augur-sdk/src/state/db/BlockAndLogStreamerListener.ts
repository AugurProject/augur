import { EthersProviderBlockStreamAdapter, ExtendedLog } from "blockstream-adapters";
import { Block, BlockAndLogStreamer, Log as BlockStreamLog } from "ethereumjs-blockstream";
import { Filter } from "ethereumjs-blockstream/output/source/models/filters";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Log, ParsedLog } from "@augurproject/types";
import { EventLogDBRouter } from "./EventLogDBRouter";

export interface BlockAndLogStreamerInterface<TBlock extends Block, TLog extends BlockStreamLog> {
  reconcileNewBlock: (block: TBlock) => Promise<void>;
  addLogFilter: (filter: Filter) => string;
  subscribeToOnBlockAdded: (onBlockAdded: (block: TBlock) => void) => string;
  subscribeToOnBlockRemoved: (onBlockRemoved: (block: TBlock) => void) => string;
  subscribeToOnLogsAdded: (onLogsAdded: (blockHash: string, logs: TLog[]) => void) => string;
  subscribeToOnLogsRemoved: (onLogsRemoved: (blockHash: string, logs: TLog[]) => void) => string;
}

export interface BlockAndLogStreamerListenerDependencies {
  address: string;
  blockAndLogStreamer: BlockAndLogStreamerInterface<Block, ExtendedLog>;
  getBlockByHash: (hashOrTag: string) => Promise<Block>;
  eventLogDBRouter: EventLogDBRouter;
  getEventTopics: (eventName: string) => string[];
  // TODO Use an emitter?
  listenForNewBlocks: (callback: (block: Block) => Promise<void>) => void;
}

type GenericLogCallbackType<T, P> = (blockIdentifier: T, logs: P[]) => void;

type BlockCallback = (block: Block) => void;

export type BlockstreamLogCallbackType = GenericLogCallbackType<string, Log>;
export type LogCallbackType = GenericLogCallbackType<number, ParsedLog>;

export interface IBlockAndLogStreamerListener {
  listenForEvent(eventName: string | string[], onLogsAdded: LogCallbackType, onLogRemoved?: LogCallbackType): void;
  listenForBlockRemoved(callback: (blockNumber: number) => void): void;
  listenForBlockAdded(callback: (block: Block) => void): void;
  startBlockStreamListener(): void;
}

export class BlockAndLogStreamerListener implements IBlockAndLogStreamerListener {
  private address: string;

  constructor(private deps: BlockAndLogStreamerListenerDependencies) {
    this.address = deps.address;
    deps.blockAndLogStreamer.subscribeToOnLogsAdded(this.onLogsAdded);
  }

  static create(provider: EthersProvider, eventLogDBRouter: EventLogDBRouter, address: string, getEventTopics: ((eventName: string) => string[])) {
    const dependencies = new EthersProviderBlockStreamAdapter(provider);
    const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(dependencies.getBlockByHash, dependencies.getLogs, (error: Error) => {
      console.error(error);
    });

    return new BlockAndLogStreamerListener({
      address,
      blockAndLogStreamer,
      eventLogDBRouter,
      getEventTopics,
      getBlockByHash: dependencies.getBlockByHash,
      listenForNewBlocks: dependencies.startPollingForBlocks,
    });
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

    this.deps.blockAndLogStreamer.addLogFilter({
      address: this.address,
      topics: [
        topics,
      ],
    });

    this.deps.eventLogDBRouter.addLogCallback(topics, onLogsAdded);
  }

  listenForBlockAdded(callback: BlockCallback): void {
    const wrapper = (callback: BlockCallback) => (block: Block) => {
      callback(block);
    };
    this.deps.blockAndLogStreamer.subscribeToOnBlockAdded(wrapper(callback));
  }

  listenForBlockRemoved(callback: (blockNumber: number) => void): void {
    const wrapper = (callback: (blockNumber: number) => void) => (block: Block) => {
      const blockNumber: number = parseInt(block.number);
      callback(blockNumber);
    };
    this.deps.blockAndLogStreamer.subscribeToOnBlockRemoved(wrapper(callback));
  }

  onLogsAdded = async (blockHash: string, extendedLogs: ExtendedLog[]) => {
    const block = await this.deps.getBlockByHash(blockHash);

    if (block) {
      const blockNumber: number = parseInt(block.number);
      this.deps.eventLogDBRouter.onLogsAdded(blockNumber, extendedLogs);
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
