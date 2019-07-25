import { ExtendedLog } from "blockstream-adapters";
import { Log, ParsedLog } from "@augurproject/types";
import { LogCallbackType } from "./BlockAndLogStreamerListener";

export class EventLogDBRouter {
  private logCallbacks: LogCallbackType[] = [];

  constructor(private parseLogs: (logs: Log[]) => ParsedLog[]) {
  }

  filterCallbackByTopic(topic: string, callback: LogCallbackType): LogCallbackType {
    return (blockNumber: number, logs: Log[]) => {
      const filteredLogs = logs.filter((log) => log.topics.includes(topic));
      const parsedLogs = this.parseLogs(filteredLogs);

      callback(blockNumber, parsedLogs);
    };
  }

  addLogCallback(topic: string, callback: LogCallbackType) {
    this.logCallbacks.push(this.filterCallbackByTopic(topic, callback));
  }

  onLogsAdded = async (blockNumber: number, extendedLogs: ExtendedLog[]) => {
    const logs: Log[] = extendedLogs.map((log) => ({
      ...log,
      logIndex: parseInt(log.logIndex, 10),
      blockNumber: parseInt(log.blockNumber, 10),

      // TODO Should these be optional in the Log type?
      removed: log.removed ? log.removed : false,
      transactionIndex: log.transactionIndex ? log.transactionIndex : 0,
      transactionLogIndex: log.transactionLogIndex ? log.transactionLogIndex : 0,
      transactionHash: log.transactionHash ? log.transactionHash : "",
    }));

    const logCallbackPromises = this.logCallbacks.map((cb) => cb(blockNumber, logs));

    await Promise.all(logCallbackPromises);
  }
}
