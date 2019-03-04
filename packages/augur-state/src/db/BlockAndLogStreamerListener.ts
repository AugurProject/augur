import {EthersProviderBlockStreamAdapter, ExtendedLog} from "blockstream-adapters";
import {Augur, Log, ParsedLog, Provider} from "@augurproject/api";
import {Block, BlockAndLogStreamer} from "ethereumjs-blockstream";
import {EthersProvider} from "ethers-provider";

interface BlockAndLogStreamerListenerDependencies {
    blockAndLogStreamer: BlockAndLogStreamer<Block, ExtendedLog>;
    // TODO Use an emitter?
    listenForNewBlocks: (callback: (block: Block) => Promise<void>) => void;

    parseLogs(logs: Log[]): ParsedLog[];
}

type LogCallbackType<T> = (blockHash: string, logs: T[]) => void;

export class BlockAndLogStreamerListener {
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
}
