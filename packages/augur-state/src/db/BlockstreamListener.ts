import {ExtendedLog} from "../api/types";
import {Augur, Log, ParsedLog, Provider} from "@augurproject/api";
import {Block, BlockAndLogStreamer, FilterOptions} from "ethereumjs-blockstream";
import * as _ from "lodash";
import { EthersProvider } from "@augurproject/ethers-provider";

interface BlockstreamListenerDeps {
  blockAndLogStreamer: BlockAndLogStreamer<Block, ExtendedLog>;
  // TODO Use an emitter?
  listenForNewBlocks: (callback: (block: Block) => void) => void;

  parseLogs(logs: Log[]): ParsedLog[];
}

type LogCallbackType<T> = (blockHash: string, logs: T[]) => void;

export class BlockstreamListener {
  private logCallBacks: LogCallbackType<Log>[] = [];

  constructor(private deps: BlockstreamListenerDeps) {
    deps.blockAndLogStreamer.subscribeToOnLogsAdded(this.onLogsAdded);
  }

  public static create(provider: EthersProvider, parseLogs: (logs: Log[]) => ParsedLog[]) {
    const getBlockByHashOrTag = (provider: EthersProvider) => async (hashOrTag: string | number): Promise<Block> => {
      const block = await provider.getBlock(hashOrTag, false);
      return {
        number: "0x" + block.number.toString(16),
        hash: block.hash,
        parentHash: block.parentHash,
      }
    };

    const getLogs = (provider: Provider) => async (filterOptions: FilterOptions): Promise<ExtendedLog[]> => {
      const logs = await provider.getLogs({
        ...filterOptions,
        topics: _.compact(filterOptions.topics)
      });

      return logs.map((log) => ({
        ...log,
        logIndex: (log.logIndex || "0").toString(),
        blockNumber: (log.blockNumber || "0").toString(),
        blockHash: log.blockHash || "0",
      }));
    };

    const listenForNewBlocks = (provider: EthersProvider, getBlockByHashOrTag: (hashOrTag: string | number) => Promise<Block>) => async (callback: (block: Block) => void) => {
      const blockNumberCallback = async (blockNumber: string) => {
        const block = await getBlockByHashOrTag(blockNumber);
        callback(block);
      };

      // This event only emits the block number. We need to find the block details.
      provider.on("block", blockNumberCallback);
    };

    const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(getBlockByHashOrTag(provider), getLogs(provider), (error: Error) => {
      console.error(error);
    });

    return new BlockstreamListener({
      parseLogs,
      blockAndLogStreamer,
      listenForNewBlocks: listenForNewBlocks(provider, getBlockByHashOrTag(provider))
    });
  }

  public listenForEvent(eventName: string, address: string, topic: string, onLogsAdded: LogCallbackType<ParsedLog>) {
    this.deps.blockAndLogStreamer.addLogFilter({
      address,
      topics: [
        topic
      ]
    });

    this.logCallBacks.push(this.filterCallbackByTopic(topic, onLogsAdded));
  }

  public filterCallbackByTopic(topic: string, callback: LogCallbackType<ParsedLog>): LogCallbackType<Log> {
    return (blockHash: string, logs: Log[]) => {
      const filteredLogs = logs.filter((log) => log.topics.includes(topic));
      const parsedLogs = this.deps.parseLogs(filteredLogs);

      callback(blockHash, parsedLogs);
    }
  }

  onNewBlock = async (block: Block) => {
    if (block) {
      await this.deps.blockAndLogStreamer.reconcileNewBlock(block);
    }
  };

  onLogsAdded = async (blockHash: string, extendedLogs: ExtendedLog[]) => {
    const logs: Log[] = extendedLogs.map((log) => ({
      ...log,
      logIndex: parseInt(log.logIndex, 10),
      blockNumber: parseInt(log.blockNumber, 10)
    }));

    const p = this.logCallBacks.map((cb) => cb(blockHash, logs));

    await Promise.all(p);
  };

  startListeningForNewBlocks(fromBlock: number): void {
    this.deps.listenForNewBlocks(this.onNewBlock);
  };
}
