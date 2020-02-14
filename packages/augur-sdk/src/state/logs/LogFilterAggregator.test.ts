import { Log, ParsedLog } from '@augurproject/types';
import { Block } from 'ethereumjs-blockstream';
import { toChecksumAddress } from 'ethereumjs-util';
import {
  LogFilterAggregator,
  LogFilterAggregatorDepsInterface,
  ExtendedFilter,
} from './LogFilterAggregator';

// this extends syntax handles nested "mockify" types.
type Mockify<T> = {
  // tslint:disable-next-line:no-any
  [P in keyof T]: T[P] extends (...args: any[]) => any
    ? jest.Mock<ReturnType<T[P]>> & T[P]
    : T[P];
};

describe('LogFilterAggregator', () => {
  let deps: Mockify<LogFilterAggregatorDepsInterface>;
  let logFilterAggregator: LogFilterAggregator;

  const CONTRACT_ADDRESSES = ['0xSOMEUNKNOWNADDRESS', '0xSOMEADDRESS'] as const;

  // Most of this data is invented to satisfy typescript.
  const sampleLogs: Log[] = [
    {
      blockHash: 'HASH-1234',
      blockNumber: 1234,
      logIndex: 1,
      address: CONTRACT_ADDRESSES[1],
      data: '',
      name: '',
      removed: false,
      topics: ['0xSOMETOPIC'],
      transactionHash: 'HASHONE',
      transactionIndex: 1,
      transactionLogIndex: 1,
    },
    {
      blockHash: 'HASH-1234',
      blockNumber: 1234,
      logIndex: 2,
      address: CONTRACT_ADDRESSES[1],
      data: '',
      name: '',
      removed: false,
      topics: ['0xSOMEOTHERTOPIC'],
      transactionHash: 'HASHTWO',
      transactionIndex: 2,
      transactionLogIndex: 2,
    },
    {
      blockHash: 'HASH-1234',
      blockNumber: 1234,
      logIndex: 3,
      address: CONTRACT_ADDRESSES[0],
      data: '',
      name: '',
      removed: false,
      topics: ['0xSOMEOTHERTOPICWEARENOTLISTENINGFOR'],
      transactionHash: 'HASHTHREE',
      transactionIndex: 3,
      transactionLogIndex: 3,
    },
    {
      blockHash: 'HASH-1234',
      blockNumber: 1234,
      logIndex: 3,
      address: CONTRACT_ADDRESSES[0],
      data: '',
      name: '',
      removed: false,
      topics: ['0xSOMEOTHERTOPIC'],
      transactionHash: 'HASHFOUR',
      transactionIndex: 4,
      transactionLogIndex: 4,
    },
  ];

  const buildBlock = (blockNumber: number): Block => ({
    number: `0x${blockNumber.toString(16)}`,
    hash: `HASH-${blockNumber}`,
    parentHash: `HASH-${blockNumber - 1}`,
  });

  const nextBlock: Block = buildBlock(1234);

  beforeEach(() => {
    const parseLogs = jest.fn().mockImplementation((logs: Log[]) =>
      logs.map<ParsedLog>(log => ({
        address: '',
        name: '',
        blockHash: log.blockHash,
        blockNumber: log.blockNumber,
        transactionIndex: log.transactionIndex || 0,
        transactionHash: log.transactionHash,
        transactionLogIndex: 1,
        logIndex: 1,
        removed: false,
      }))
    );

    deps = {
      getEventTopics: jest.fn(),
      getEventContractAddress: jest.fn(),
      parseLogs,
    };

    logFilterAggregator = new LogFilterAggregator(deps);

    deps.getEventContractAddress.mockImplementation(
      (eventName: string): string => {
        if (eventName === 'SomeTopicFromAnotherAddress') {
          return CONTRACT_ADDRESSES[0];
        } else {
          return CONTRACT_ADDRESSES[1];
        }
      }
    );
    deps.getEventTopics.mockImplementation(eventName => {
      return {
        SomeTopicFromAnotherAddress: ['0xSOMETOPICFROMANOTHERADDRESS'],
        SomeEvent: ['0xSOMETOPIC'],
        SomeOtherEvent: ['0xSOMEOTHERTOPIC'],
        SomeEventWithoutLogs: ['0xSOMETOPICWITHOUTLOGS'],
      }[eventName];
    });
  });

  describe('buildFilter', () => {
    test('no filters', async () => {
      expect(logFilterAggregator.buildFilter()).toEqual({
        address: [],
        topics: [],
      } as ExtendedFilter);
    });

    test('single contract, multiple filters', () => {
      logFilterAggregator.listenForEvent('SomeEvent', jest.fn());
      logFilterAggregator.listenForEvent('SomeOtherEvent', jest.fn());
      expect(logFilterAggregator.buildFilter()).toEqual({
        address: [(CONTRACT_ADDRESSES[1]).toLowerCase()],
        topics: [['0xSOMETOPIC', '0xSOMEOTHERTOPIC']],
      } as ExtendedFilter);
    });

    test('single listener, multiple contracts', () => {
      logFilterAggregator.listenForEvent(
        ['SomeTopicFromAnotherAddress', 'SomeEvent'],
        jest.fn()
      );

      expect(logFilterAggregator.buildFilter()).toEqual({
        address: [
          (CONTRACT_ADDRESSES[0]).toLowerCase(),
          (CONTRACT_ADDRESSES[1]).toLowerCase(),
        ],
        topics: [
          [
            '0xSOMETOPICFROMANOTHERADDRESS',
            '0xSOMETOPIC',
          ],
        ],
      } as ExtendedFilter);
    });
  });

  describe('onLogsAdded', () => {
    let onNewLogCallback: jest.Mock;
    beforeEach(() => {
      onNewLogCallback = jest.fn();
    });

    describe('single topic', () => {
      beforeEach(() => {
        logFilterAggregator.listenForEvent('SomeEvent', onNewLogCallback);
      });

      test('should filter logs passed to listeners', async () => {
        await logFilterAggregator.onLogsAdded(1234, sampleLogs);
        expect(onNewLogCallback).toBeCalledWith(1234, [
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
        ]);
      });
    });

    describe('multiple topics', () => {
      beforeEach(() => {
        logFilterAggregator.listenForEvent(
          ['SomeEvent', 'SomeOtherEvent', 'SomeEventWithoutLogs'],
          onNewLogCallback
        );
      });

      test('should filter logs passed to listeners', async () => {
        await logFilterAggregator.onLogsAdded(1234, sampleLogs);
        expect(onNewLogCallback).toBeCalledWith(1234, [
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
          expect.objectContaining({
            transactionHash: 'HASHTWO',
          }),
        ]);
      });
    });

    describe('Subscribe to all logs', () => {
      beforeEach(() => {
        logFilterAggregator.listenForAllEvents(onNewLogCallback);
      });

      test('should pass logs to callback for single filter', async () => {
        logFilterAggregator.listenForEvent('SomeEvent', jest.fn());

        await logFilterAggregator.onLogsAdded(1234, sampleLogs);

        // This will only include the logs we have callbacks registered for.
        expect(onNewLogCallback).toHaveBeenCalledWith(1234, [
          expect.objectContaining({
            transactionHash: 'HASHTWO',
          }),
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
        ]);
      });

      test('should pass logs to callback for multiple filters', async () => {
        // Calling same callback twice to ensure order.
        logFilterAggregator.listenForEvent('SomeEvent', onNewLogCallback);
        logFilterAggregator.listenForEvent('SomeOtherEvent', jest.fn());

        await logFilterAggregator.onLogsAdded(1234, sampleLogs);

        expect(onNewLogCallback).toHaveBeenNthCalledWith(1, 1234, [
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
        ]);

        // "All logs"
        expect(onNewLogCallback).toHaveBeenNthCalledWith(2, 1234, [
          expect.objectContaining({
            transactionHash: 'HASHTWO',
          }),
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
        ]);
      });
    });
  });
});
