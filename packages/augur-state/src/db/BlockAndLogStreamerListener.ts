import { EthersProviderBlockStreamAdapter, ExtendedLog } from "blockstream-adapters";
import { Block, BlockAndLogStreamer, Log as BlockStreamLog } from "ethereumjs-blockstream";
import { Filter } from "ethereumjs-blockstream/output/source/models/filters";
import { EthersProvider } from "ethers-provider";
import { Augur, Log, ParsedLog, Provider } from "@augurproject/api";
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
  blockAndLogStreamer: BlockAndLogStreamerInterface<Block, ExtendedLog>;
  eventLogDBRouter: EventLogDBRouter;
  // TODO Use an emitter?
  listenForNewBlocks: (callback: (block: Block) => Promise<void>) => void;
  // parseLogs(logs: Log[]): ParsedLog[];
}

export type LogCallbackType<T> = (blockHash: string, logs: T[]) => void;

export interface IBlockAndLogStreamerListener {
  listenForEvent(eventName: string, address: string, topic: string, onLogsAdded: LogCallbackType<ParsedLog>): void;
  startBlockStreamListener(): void;
}

export class BlockAndLogStreamerListener implements IBlockAndLogStreamerListener {
  constructor(private deps: BlockAndLogStreamerListenerDependencies) {
      deps.blockAndLogStreamer.subscribeToOnLogsAdded(this.deps.eventLogDBRouter.onLogsAdded);
  }

    public static create(provider: EthersProvider, eventLogDBRouter: EventLogDBRouter) {
      const dependencies = new EthersProviderBlockStreamAdapter(provider);
      const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(dependencies.getBlockByHash, dependencies.getLogs, (error: Error) => {
        console.error(error);
      });

      return new BlockAndLogStreamerListener({
        blockAndLogStreamer,
        eventLogDBRouter,
        listenForNewBlocks: dependencies.startPollingForBlocks,
        // parseLogs,
      });
    }

  public listenForEvent(eventName: string, address: string, topic: string, onLogsAdded: LogCallbackType<ParsedLog>) {
    this.deps.blockAndLogStreamer.addLogFilter({
      address,
      topics: [
        topic
      ]
    });

    // this.deps.eventLogDBRouter.logCallBacks.push(this.filterCallbackByTopic(topic, onLogsAdded));
    this.deps.eventLogDBRouter.addLogCallback(topic);
  }

  startBlockStreamListener(): void {
    this.deps.listenForNewBlocks(this.onNewBlock);
  }

  onNewBlock = async (block: Block) => {
    if (block) {
      await this.deps.blockAndLogStreamer.reconcileNewBlock(block);
    }
  };
}
