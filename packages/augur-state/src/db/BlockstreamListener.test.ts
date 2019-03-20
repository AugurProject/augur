import {
  BlockAndLogStreamerInterface,
  BlockAndLogStreamerListener,
  BlockAndLogStreamerListenerDependencies
} from "./BlockAndLogStreamerListener";
import { Block } from "ethereumjs-blockstream";
import { BlockAndLogStreamerDependencies, ExtendedLog } from "blockstream-adapters";
import { EventLogDBRouter } from "./EventLogDBRouter";
import { ParsedLog } from "@augurproject/api/build";

// this extends syntax handles nested "mockify" types.
type Mockify<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? jest.Mock<ReturnType<T[P]>> & T[P] : T[P]
};

describe("BlockstreamListener", () => {
  let blockAndLogStreamer: Mockify<BlockAndLogStreamerInterface<Block, ExtendedLog>>;
  let deps: Mockify<BlockAndLogStreamerListenerDependencies>;
  let blockAndLogStreamerListener: BlockAndLogStreamerListener;
  let eventLogDBRouter: EventLogDBRouter;

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

    eventLogDBRouter = new EventLogDBRouter((logs) => {
      return logs.map<ParsedLog>((log) => ({
        blockHash: log.blockHash,
        blockNumber: log.blockNumber,
        transactionIndex: parseInt(log.transactionHash || "0", 10),
        transactionHash: log.transactionHash
      }));
    });
    deps = {
      address: "0xSomeAddress",
      blockAndLogStreamer,
      eventLogDBRouter,
      listenForNewBlocks: jest.fn(),
      getEventTopics: jest.fn()
    };

    blockAndLogStreamerListener = new BlockAndLogStreamerListener(deps);
  });

  describe("on new block", () => {
    let onNewLogCallback: jest.Mock;

    beforeEach(() => {
      onNewLogCallback = jest.fn();

      deps.getEventTopics.mockReturnValue([
        "0xSOMETOPIC"
      ]);

      blockAndLogStreamerListener.listenForEvent("SomeEvent", onNewLogCallback);

      onNewLogCallback.mockResolvedValue(undefined);
    });

    test("should notify log listeners", () => {
      const nextBlock: Block = {
        number: "1234",
        hash: "1234",
        parentHash: "ParentHash"
      };

      blockAndLogStreamerListener.onNewBlock(nextBlock);
      expect(blockAndLogStreamer.reconcileNewBlock).toHaveBeenCalledWith(nextBlock);
    });

    test("should filter logs passed to listeners", () => {
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

      eventLogDBRouter.onLogsAdded("hashone", sampleLogs);

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
