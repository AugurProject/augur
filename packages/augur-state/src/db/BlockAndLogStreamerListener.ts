import {EthersProviderBlockStreamAdapter, ExtendedLog} from "blockstream-adapters";
import {Augur, Log, ParsedLog, Provider} from "@augurproject/api";
import {Block, BlockAndLogStreamer, Log as BlockStreamLog} from "ethereumjs-blockstream";
import {EthersProvider} from "ethers-provider";
import {Filter} from "ethereumjs-blockstream/output/source/models/filters";

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
    // TODO Use an emitter?
    listenForNewBlocks: (callback: (block: Block) => Promise<void>) => void;

    parseLogs(logs: Log[]): ParsedLog[];
}

type LogCallbackType<T> = (blockHash: string, logs: T[]) => void;

export interface IBlockAndLogStreamerListener {
    listenForEvent(eventName: string, address: string, topic: string, onLogsAdded: LogCallbackType<ParsedLog>): void;
    startBlockStreamListener(): void;
}

export class BlockAndLogStreamerListener implements IBlockAndLogStreamerListener {
    private logCallBacks: LogCallbackType<Log>[] = [];

    constructor(private deps: BlockAndLogStreamerListenerDependencies) {
        deps.blockAndLogStreamer.subscribeToOnLogsAdded(this.onLogsAdded);
    }

    public static create(provider: EthersProvider, parseLogs: (logs: Log[]) => ParsedLog[]) {
        const dependencies = new EthersProviderBlockStreamAdapter(provider);
        const blockAndLogStreamer = new BlockAndLogStreamer<Block, ExtendedLog>(dependencies.getBlockByHash, dependencies.getLogs, (error: Error) => {
            console.error(error);
        });

        return new BlockAndLogStreamerListener({
            parseLogs,
            blockAndLogStreamer,
            listenForNewBlocks: dependencies.startPollingForBlocks
        });
    }

    listenForEvent(eventName: string, address: string, topic: string, onLogsAdded: LogCallbackType<ParsedLog>) {
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

    startBlockStreamListener(): void {
        this.deps.listenForNewBlocks(this.onNewBlock);
    }

    onNewBlock = async (block: Block) => {
        if (block) {
            await this.deps.blockAndLogStreamer.reconcileNewBlock(block);
        }
    };

    onLogsAdded = async (blockHash: string, extendedLogs: ExtendedLog[]) => {
        const logs:Log[] = extendedLogs.map((log) => ({
            ...log,
            logIndex: parseInt(log.logIndex, 10),
            blockNumber: parseInt(log.blockNumber, 10)
        }));

        const p = this.logCallBacks.map((cb) => cb(blockHash, logs));

        await Promise.all(p);
    };
}
