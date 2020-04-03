import { Log, ParsedLog } from '@augurproject/types';
import * as _ from 'lodash';

type EventTopics = string | string[];

type GenericLogCallbackType<T, P> = (
  blockIdentifier: T,
  logs: P[]
) => Promise<any>;
export type LogCallbackType = GenericLogCallbackType<number, ParsedLog>;

export interface ExtendedFilter {
  blockhash?: string;
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: Array<string | string[]>;
  topics?: Array<string | string[]>;
}

interface LogCallbackMetaData {
  eventNames: EventTopics;
  onLogsAdded: LogCallbackType;
}

export interface LogFilterAggregatorDepsInterface {
  getEventTopics: (eventName: string) => string[];
  parseLogs: (logs: Log[]) => ParsedLog[];
}

type BlockRemovalCallback = (blockNumber: number) => void;

export interface LogFilterAggregatorInterface {
  allLogsCallbackMetaData: LogCallbackType[];
  notifyNewBlockAfterLogsProcessMetadata: LogCallbackType[];
  logCallbackMetaData: LogCallbackMetaData[];
  onLogsAdded: (blockNumber: number, logs: Log[]) => Promise<void>;

  notifyNewBlockAfterLogsProcess(onBlockAdded: LogCallbackType): void;

  /**
   * @description Register a callback that will receive the sum total of all registered filters.
   * @param {LogCallbackType} onLogsAdded
   */
  listenForAllEvents(onLogsAdded: LogCallbackType): void;

  listenForEvent(
    eventNames: string | string[],
    onLogsAdded: LogCallbackType,
  ): void;

  unlistenForEvent(
    eventNames: string | string[],
    onLogsAdded: LogCallbackType,
  ): void;

  onBlockRemoved(blockNumber: number): void;
  listenForBlockRemoved(onBlockRemoved: BlockRemovalCallback): void;
}

export class LogFilterAggregator implements LogFilterAggregatorInterface {
  allLogsCallbackMetaData: LogCallbackType[] = [];
  notifyNewBlockAfterLogsProcessMetadata: LogCallbackType[] = [];
  logCallbackMetaData: LogCallbackMetaData[] = [];
  blockRemovalCallback: BlockRemovalCallback[] = [];

  constructor(private deps: LogFilterAggregatorDepsInterface) {}

  static create(
    getEventTopics: (eventName: string) => string[],
    parseLogs: (logs: Log[]) => ParsedLog[],
  ) {
    return new LogFilterAggregator({
      getEventTopics,
      parseLogs,
    });
  }

  notifyNewBlockAfterLogsProcess(onBlockAdded: LogCallbackType) {
    this.notifyNewBlockAfterLogsProcessMetadata.push(onBlockAdded);
  }

  /**
   * @description Register a callback that will receive the sum total of all registered filters.
   * @param {LogCallbackType} onLogsAdded
   */
  listenForAllEvents(onLogsAdded: LogCallbackType): void {
    this.allLogsCallbackMetaData.push(onLogsAdded);
  }

  onLogsAdded = async (blockNumber: number, logs: ParsedLog[]) => {
    const logCallbackPromises = this.logCallbackMetaData.map(({eventNames, onLogsAdded}) => {
      const filteredLogs = logs.filter(log => eventNames.includes(log.name));
      return onLogsAdded(blockNumber, filteredLogs);
    });

    // Assuming all db updates will be complete when these promises resolve.
    await Promise.all(logCallbackPromises);

    const sortedLogs = logs
      .sort((a, b) => b.logIndex - a.logIndex);

    // Fire this after all "filtered" log callbacks are processed.
    const allLogsCallbackMetaDataPromises = this.allLogsCallbackMetaData.map(
      cb => {
        cb(blockNumber, sortedLogs);
      }
    );
    await Promise.all(allLogsCallbackMetaDataPromises);

    // let the controller know a new block was added so it can update the UI
    const notifyNewBlockAfterLogsProcessMetadataPromises = this.notifyNewBlockAfterLogsProcessMetadata.map(
      cb => cb(blockNumber, sortedLogs)
    );
    await Promise.all(notifyNewBlockAfterLogsProcessMetadataPromises);
  };

  listenForEvent(
    eventNames: string | string[],
    onLogsAdded: LogCallbackType,
  ): void {
    if (!Array.isArray(eventNames)) eventNames = [eventNames];

    // Update the callbacks list with these events and the specified callback
    this.logCallbackMetaData.push({
      eventNames,
      onLogsAdded,
    });
  }

  unlistenForEvent(
    eventNames: string | string[],
    onLogsAdded: LogCallbackType,
  ) {
    let events = []

    if (!Array.isArray(eventNames)) {
      events = [eventNames];
    } else {
      events = eventNames;
    }

    this.logCallbackMetaData = this.logCallbackMetaData.filter(({eventNames: metaDataEventNames , onLogsAdded: metaDataOnLogsAdded }) => {
      if(onLogsAdded !== metaDataOnLogsAdded) return true;
      return events.length !== metaDataEventNames.length || !events.every((item, index) => item === metaDataEventNames[index])
    });
  }

  onBlockRemoved = async (blockNumber: number): Promise<void> => {
    for (let i = 0; i < this.blockRemovalCallback.length; i++) {
      await this.blockRemovalCallback[i](blockNumber);
    }
  }

  listenForBlockRemoved(onBlockRemoved: (blockNumber: number) => void): void {
    this.blockRemovalCallback.push(onBlockRemoved);
  }
}
