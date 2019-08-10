import {
  BlockAndLogStreamerInterface,
  BlockAndLogStreamerListener,
  BlockAndLogStreamerListenerDependencies
} from "./BlockAndLogStreamerListener";
import { Block } from "ethereumjs-blockstream";
import { ExtendedLog } from "blockstream-adapters";
import { ParsedLog } from "@augurproject/types";
import { Log } from "../logs/types";

// this extends syntax handles nested "mockify" types.
type Mockify<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? jest.Mock<ReturnType<T[P]>> & T[P] : T[P]
};

describe("BlockstreamListener", () => {
  let blockAndLogStreamer: Mockify<BlockAndLogStreamerInterface<Block, ExtendedLog>>;
  let deps: Mockify<BlockAndLogStreamerListenerDependencies>;
  let blockAndLogStreamerListener: BlockAndLogStreamerListener;

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
    transactionIndex: 1,
  }, {
    blockHash: "hashone",
    blockNumber: "1234",
    logIndex: "1",
    address: "0xSOMEADDRESS",
    data: "",
    removed: false,
    topics: ["0xSOMEOTHERTOPIC"],
    transactionHash: "HASHTWO",
    transactionIndex: 2,
  }];

  const nextBlock: Block = {
    number: "1234",
    hash: "1234",
    parentHash: "ParentHash",
  } as const;

  beforeEach(() => {
    // Gotta be a better way to do this...
    blockAndLogStreamer = {
      reconcileNewBlock: jest.fn(),
      addLogFilter: jest.fn(),
      removeLogFilter: jest.fn(),
      subscribeToOnBlockAdded: jest.fn(),
      subscribeToOnBlockRemoved: jest.fn(),
      subscribeToOnLogsAdded: jest.fn(),
      subscribeToOnLogsRemoved: jest.fn(),
    };

    const parseLogs = jest.fn().mockImplementation((logs:Log[]) => logs.map<ParsedLog>((log) => ({
      blockHash: log.blockHash,
      blockNumber: log.blockNumber,
      transactionIndex: parseInt(log.transactionHash || "0", 10),
      transactionHash: log.transactionHash,
      transactionLogIndex: 1,
      logIndex: 1,
      removed: false,
    })));

    deps = {
      address: "0xSomeAddress",
      blockAndLogStreamer,
      listenForNewBlocks: jest.fn(),
      getEventTopics: jest.fn(),
      getBlockByHash: jest.fn().mockReturnValue(nextBlock),
      parseLogs,
    };

    blockAndLogStreamerListener = new BlockAndLogStreamerListener(deps);

    deps.getEventTopics.mockImplementation((eventName) => {
      return {
        "SomeEvent": [
          "0xSOMETOPIC",
        ],
        "SomeOtherEvent": [
          "0xSOMEOTHERTOPIC",
        ],
        "SomeEventWithoutLogs": [
          "0xSOMETOPICWITHOUTLOGS",
        ]
      }[eventName];
    });
  });

  describe("on new block", () => {
    let onNewLogCallback: jest.Mock;
    beforeEach(() => {
      onNewLogCallback = jest.fn();
    });

    describe("single topic", () => {
      beforeEach(() => {
        blockAndLogStreamerListener.listenForEvent("SomeEvent", onNewLogCallback);
      });

      test("should notify log listeners", () => {
        blockAndLogStreamerListener.onNewBlock(nextBlock);
        expect(blockAndLogStreamer.reconcileNewBlock).toHaveBeenCalledWith(nextBlock);
      });

      test("should filter logs passed to listeners", async () => {
        await blockAndLogStreamerListener.onLogsAdded("1234", sampleLogs);
        expect(onNewLogCallback).toBeCalledWith(1234,
          [
            expect.objectContaining({
              transactionHash: "HASHONE",
            }),
          ]
        );
      });
    });

    describe("multiple topics", () => {
      beforeEach(() => {
        blockAndLogStreamerListener.listenForEvent(["SomeEvent", "SomeOtherEvent", "SomeEventWithoutLogs"], onNewLogCallback);
      });

      test("should notify log listeners", () => {
        blockAndLogStreamerListener.onNewBlock(nextBlock);
        expect(blockAndLogStreamer.reconcileNewBlock).toHaveBeenCalledWith(nextBlock);
      });

      test("should filter logs passed to listeners", async () => {
        await blockAndLogStreamerListener.onLogsAdded("1234", sampleLogs);
        expect(onNewLogCallback).toBeCalledWith(1234,
          [
            expect.objectContaining({
              transactionHash: "HASHONE",
            }),
            expect.objectContaining({
              transactionHash: "HASHTWO",
            }),
          ]
        );
      });
    });
  });
});
