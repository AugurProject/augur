import { Log, ParsedLog } from '@augurproject/types';
import { Block, BlockAndLogStreamer } from 'ethereumjs-blockstream';
import * as _ from 'lodash';
import * as fp from 'lodash/fp';
import { toChecksumAddress } from 'ethereumjs-util';

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
  contractAddress: string;
  eventNames: EventTopics;
  onLogsAdded: LogCallbackType;
  topics: string[];
}

export interface LogFilterAggregatorDepsInterface {
  getEventTopics: (eventName: string) => string[];
  parseLogs: (logs: Log[]) => ParsedLog[];
  getEventContractAddress: (eventName: string) => string;
}

export interface LogFilterAggregatorInterface {
  allLogsCallbackMetaData: LogCallbackType[];
  notifyNewBlockAfterLogsProcessMetadata: LogCallbackType[];
  logCallbackMetaData: LogCallbackMetaData[];
  buildFilter: () => ExtendedFilter;
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
    onLogsRemoved?: LogCallbackType
  ): void;
}

export class LogFilterAggregator implements LogFilterAggregatorInterface {
  allLogsCallbackMetaData: LogCallbackType[] = [];
  notifyNewBlockAfterLogsProcessMetadata: LogCallbackType[] = [];
  logCallbackMetaData: LogCallbackMetaData[] = [];

  constructor(private deps: LogFilterAggregatorDepsInterface) {}

  static create(
    getEventTopics: (eventName: string) => string[],
    parseLogs: (logs: Log[]) => ParsedLog[],
    getEventContractAddress: (eventName: string) => string
  ) {
    return new LogFilterAggregator({
      getEventTopics,
      parseLogs,
      getEventContractAddress,
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

  // Note: this assumes we only have one topic per filter.
  buildFilter = (): ExtendedFilter => {
    const getTopics = fp.compose(
      (items: string[]) => {
        if (items.length > 0) {
          return [items];
        } else {
          return items;
        }
      },
      fp.uniq,
      fp.flatten,
      fp.map('topics')
    );

    const getAddresses = fp.compose(
      fp.uniq,
      fp.map('contractAddress')
    );

    return {
      address: getAddresses(this.logCallbackMetaData),
      topics: getTopics(this.logCallbackMetaData),
    };
  };

  onLogsAdded = async (blockNumber: number, logs: ParsedLog[]) => {
    if (blockNumber) {
      const logCallbackPromises = this.logCallbackMetaData.map(cb =>
        cb.onLogsAdded(blockNumber, logs)
      );

      // Assuming all db updates will be complete when these promises resolve.
      await Promise.all(logCallbackPromises);

      const addressesWeCareAbout = this.logCallbackMetaData.map(
        item => item.contractAddress
      );
      const logsWeCareAbout = logs
        .filter(item => addressesWeCareAbout.includes(item.address))
        .sort((a, b) => b.logIndex - a.logIndex);

      // Fire this after all "filtered" log callbacks are processed.
      const allLogsCallbackMetaDataPromises = this.allLogsCallbackMetaData.map(
        cb => {
          cb(blockNumber, logsWeCareAbout);
        }
      );
      await Promise.all(allLogsCallbackMetaDataPromises);

      // let the controller know a new block was added so it can update the UI
      const notifyNewBlockAfterLogsProcessMetadataPromises = this.notifyNewBlockAfterLogsProcessMetadata.map(
        cb => cb(blockNumber, logsWeCareAbout)
      );
      await Promise.all(notifyNewBlockAfterLogsProcessMetadataPromises);
    }
  };

  listenForEvent(
    eventNames: string | string[],
    onLogsAdded: LogCallbackType,
    onLogsRemoved?: LogCallbackType
  ): void {
    if (!Array.isArray(eventNames)) eventNames = [eventNames];

    // Group by contract address
    const eventNamesByContractAddress = _.groupBy(
      eventNames,
      this.deps.getEventContractAddress
    );

    // For each contract address update the logCallbackMetaData and update the respctive filter for that contract
    _.forEach(
      eventNamesByContractAddress,
      (contractEventNames, contractAddress) => {
        // get all topics for the provided eventNames
        const topics = contractEventNames.reduce((acc, eventName) => {
          const topics = this.deps.getEventTopics(eventName);
          return [...acc, ...topics];
        }, []);

        // Update the callbacks list with these events and the specified callback
        this.logCallbackMetaData.push({
          contractAddress,
          eventNames: contractEventNames,
          topics,
          onLogsAdded: this.filterCallbackByContractAddressAndTopic(
            contractAddress,
            topics,
            onLogsAdded
          ),
        });
      }
    );
  }

  private filterCallbackByContractAddressAndTopic(
    contractAddress: string,
    topics: EventTopics,
    callback: LogCallbackType
  ): LogCallbackType {
    if (!Array.isArray(topics)) topics = [topics];
    return async (blockNumber: number, logs: ParsedLog[]) => {
      const filteredLogs = logs
        .filter(
          log =>
            toChecksumAddress(log.address) ===
            toChecksumAddress(contractAddress)
        )
        .filter(log => !_.isEmpty(_.intersection(log.topics, topics)));

      return callback(blockNumber, filteredLogs);
    };
  }
}
