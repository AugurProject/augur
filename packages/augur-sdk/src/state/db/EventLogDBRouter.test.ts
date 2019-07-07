import { EventLogDBRouter } from "./EventLogDBRouter";
import { Log, ParsedLog, LogValues } from "@augurproject/types";
import { ExtendedLog } from "blockstream-adapters";

describe("topic filtering", async () => {
  test("should return only logs with the desired topic", async () => {
    const log: ExtendedLog = {
      blockNumber: "1",
      blockHash: "0x1000",
      transactionIndex: 2,
      removed: false,
      transactionLogIndex: 3,
      address: "0x1001",
      data: "datums",
      topics: ["tropical", "othertopic"],
      transactionHash: "0x1002",
      logIndex: "4",
    };
    const ignoredLog: ExtendedLog = Object.assign({}, log, {
      topics: ["arctic"],
    });
    const logsToParse: ExtendedLog[] = [log, ignoredLog];

    const parseLogs = (logs: Log[]): ParsedLog[] => {
      return logs.map((log) => Object.assign({}, log));
    };

    const callbackValues: any[] = [];
    const logCallback = async (blocknumber: number, logs: ParsedLog[]): Promise<number> => {
      callbackValues.push({ blocknumber, logs });
      return blocknumber;
    };

    const eventLogDBRouter = new EventLogDBRouter(parseLogs);

    // Note that this callback only applies to "tropical" topics
    eventLogDBRouter.addLogCallback("tropical", logCallback);

    await eventLogDBRouter.onLogsAdded(12, logsToParse);

    // Note that the ignored log isn't present
    expect(callbackValues).toEqual([{
      blocknumber: 12,
      logs: [Object.assign({}, log, {
        blockNumber: parseInt(log.blockNumber, 10),
        logIndex: parseInt(log.logIndex, 10),
      })],
    }]);
  });

  describe("addtionalTopics", () => {
    test("should be considered when filtering", async () => {
      const logs: ExtendedLog[] = [{
        blockNumber: "1",
        blockHash: "0x1000",
        transactionIndex: 2,
        removed: false,
        transactionLogIndex: 3,
        address: "0x1001",
        data: "datums",
        topics: ["tropical", "additionalTopic1"],
        transactionHash: "0x1002",
        logIndex: "4",
      }, {
        blockNumber: "1",
        blockHash: "0x1000",
        transactionIndex: 2,
        removed: false,
        transactionLogIndex: 3,
        address: "0x1001",
        data: "datums",
        topics: ["tropical", "additionalTopic2"],
        transactionHash: "0x1002",
        logIndex: "4",
      },{
        blockNumber: "1",
        blockHash: "0x1000",
        transactionIndex: 2,
        removed: false,
        transactionLogIndex: 3,
        address: "0x1001",
        data: "datums",
        topics: ["tropical", "additionalTopic3"],
        transactionHash: "0x1002",
        logIndex: "4",
      }];

      const parseLogs = (logs: Log[]): ParsedLog[] => {
        return logs.map((log) => Object.assign({}, log));
      };

      const expectedLogs = logs.slice(0,2).map((log) => ({
        ...log,
        blockNumber: parseInt(log.blockNumber, 10),
        logIndex: parseInt(log.logIndex, 10),
      }))

      const logCallback = jest.fn();
      const eventLogDBRouter = new EventLogDBRouter(parseLogs);

      // Note that this callback only applies to "tropical" topics
      eventLogDBRouter.addLogCallback("tropical", logCallback, ["additionalTopic1", "additionalTopic2"]);

      await eventLogDBRouter.onLogsAdded(12, logs);

      // Note that the ignored log isn't present
      expect(logCallback.mock.calls[0]).toEqual([
        12,
        expectedLogs,
      ]);
    });
  });
});
