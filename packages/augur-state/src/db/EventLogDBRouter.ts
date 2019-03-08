import { ExtendedLog } from "blockstream-adapters";
import { Log, ParsedLog } from "@augurproject/api";
import { LogCallbackType } from "./BlockAndLogStreamerListener";

export class EventLogDBRouter {
  private logCallbacks: LogCallbackType<Log>[] = [];

  constructor(private parseLogs: (logs: Log[]) => ParsedLog[]) {}

  public filterCallbackByTopic(topic: string, callback: LogCallbackType<ParsedLog>): LogCallbackType<Log> {
    return (blockHash: string, logs: Log[]) => {
      const filteredLogs = logs.filter((log) => log.topics.includes(topic));
      const parsedLogs = this.parseLogs(filteredLogs);

      callback(blockHash, parsedLogs);
    }
  }

  public addLogCallback(topic: string) {
    this.logCallbacks.push(this.filterCallbackByTopic(topic, onLogsAdded));
  }

  onLogsAdded = async (blockHash: string, extendedLogs: ExtendedLog[]) => {
    const logs:Log[] = extendedLogs.map((log) => ({
        ...log,
        logIndex: parseInt(log.logIndex, 10),
        blockNumber: parseInt(log.blockNumber, 10)
    }));

    const p = this.logCallbacks.map((cb) => cb(blockHash, logs));

    await Promise.all(p);
  };
}
