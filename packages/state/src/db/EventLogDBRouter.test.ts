import {EventLogDBRouter} from "./EventLogDBRouter";
import { Log, ParsedLog, LogValues } from "@augurproject/api";
import { ExtendedLog } from "blockstream-adapters";

test("topic filtering", async () => {
  const log: ExtendedLog = {
    blockNumber: "1",
    blockHash: "0x1000",
    transactionIndex: 2,
    removed: false,
    transactionLogIndex: 3,
    address: "0x1001",
    data: "datums",
    topics: ["tropical"],
    transactionHash: "0x1002",
    logIndex: "4",
  };
  const ignoredLog: ExtendedLog = Object.assign({}, log, {
    topics: ["arctic"],
  });
  const logsToParse: Array<ExtendedLog> = [ log, ignoredLog ];

  const parseLogs = (logs: Array<Log>): Array<ParsedLog> => {
    return logs.map((log) => Object.assign({}, log, {
      foo: "bar",
    }));
  };

  const callbackValues: Array<any> = [];
  const logCallback = async (blocknumber: number, logs: Array<ParsedLog>): Promise<number> => {
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
      foo: "bar",
    })],
  }]);
});
