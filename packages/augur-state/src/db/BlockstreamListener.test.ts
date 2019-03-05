import {
    BlockAndLogStreamerInterface,
    BlockAndLogStreamerListener,
    BlockAndLogStreamerListenerDependencies
} from "./BlockAndLogStreamerListener";
import {Block} from "ethereumjs-blockstream";
import {BlockAndLogStreamerDependencies, ExtendedLog} from "blockstream-adapters";
import {ParsedLog} from "@augurproject/api/build";

type Mockify<T> = {
    [P in keyof T]: T[P] & jest.Mock<T[P]>
}

describe("BlockstreamListener", () => {
    let blockAndLogStreamer: Mockify<BlockAndLogStreamerInterface<Block, ExtendedLog>>;
    let deps: BlockAndLogStreamerListenerDependencies;
    let target: BlockAndLogStreamerListener;

    beforeEach(() => {
        // Gotta be a better way to do this...
        blockAndLogStreamer = {
            reconcileNewBlock: jest.fn(),
            addLogFilter: jest.fn(),
            subscribeToOnBlockAdded: jest.fn(),
            subscribeToOnBlockRemoved: jest.fn(),
            subscribeToOnLogsAdded: jest.fn(),
            subscribeToOnLogsRemoved: jest.fn()
        };

        deps = {
            blockAndLogStreamer,
            parseLogs: (logs) => {
                return logs.map<ParsedLog>((log) => ({
                    blockHash: log.blockHash,
                    blockNumber: log.blockNumber,
                    transactionIndex: parseInt(log.transactionHash || "0", 10),
                    transactionHash: log.transactionHash
                }));
            },
            listenForNewBlocks: jest.fn()
        };

        target = new BlockAndLogStreamerListener(deps);
    });

    describe("on new block", () => {
        let onNewLogCallback: jest.Mock;

        beforeEach(() => {
            onNewLogCallback = jest.fn();
            target.listenForEvent("SomeEvent", "0xSOMEADDRESS", "0xSOMETOPIC", onNewLogCallback)

            onNewLogCallback.mockResolvedValue(undefined);
        });

        test("should notify log listeners", () => {
            const nextBlock: Block = {
                number: "1234",
                hash: "1234",
                parentHash: "ParentHash"
            };

            target.onNewBlock(nextBlock);
            expect(blockAndLogStreamer.reconcileNewBlock).toHaveBeenCalledWith(nextBlock)
        });

        test('should filter logs passed to listeners', () => {
            // Most of this data is invented to satisfy typescript.
            const sampleLogs: ExtendedLog[] = [{
                blockHash: "hashone",
                blockNumber: "1234",
                logIndex: "1",
                address: "0xSOMEADDRESS",
                data: "",
                removed: false,
                topics: ["0xSOMETOPIC"],
                transactionHash: "HASHONE",
                transactionIndex: 1
            }, {
                blockHash: "hashone",
                blockNumber: "1234",
                logIndex: "1",
                address: "0xSOMEADDRESS",
                data: "",
                removed: false,
                topics: ["0xSOMEOTHERTOPIC"],
                transactionHash: "HASHTWO",
                transactionIndex: 2
            }];

            target.onLogsAdded("hashone", sampleLogs);

            expect(onNewLogCallback).toBeCalledWith("hashone",
                expect.arrayContaining([
                    expect.objectContaining({
                        transactionHash: "HASHONE"
                    })
                ])
            );
        });
    });
});





