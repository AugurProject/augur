import { Log, ParsedLog } from '@augurproject/types';
import { ExtendedLog } from 'blockstream-adapters';
import { Block } from 'ethereumjs-blockstream';
import {
  BlockAndLogStreamerInterface,
  BlockAndLogStreamerListener,
  BlockAndLogStreamerListenerDependencies,
  ExtendedFilter,
} from './BlockAndLogStreamerListener';

// this extends syntax handles nested "mockify" types.
type Mockify<T> = {
  // tslint:disable-next-line:no-any
  [P in keyof T]: T[P] extends (...args: any[]) => any
    ? jest.Mock<ReturnType<T[P]>> & T[P]
    : T[P];
};

describe('BlockstreamListener', () => {
  let blockAndLogStreamer: Mockify<
    BlockAndLogStreamerInterface<Block, ExtendedLog>
  >;
  let deps: Mockify<BlockAndLogStreamerListenerDependencies>;
  let blockAndLogStreamerListener: BlockAndLogStreamerListener;

  const CONTRACT_ADDRESSES = ['0xSOMEUNKNOWNADDRESS', '0xSOMEADDRESS'] as const;

  // Most of this data is invented to satisfy typescript.
  const sampleLogs: Log[] = [
    {
      blockHash: 'HASH-1234',
      blockNumber: 1234,
      logIndex: 1,
      address: '0xSOMEADDRESS',
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
      address: '0xSOMEADDRESS',
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
      address: '0xSOMEUNKNOWNADDRESS',
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
      address: '0xSOMEUNKNOWNADDRESS',
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
    // Gotta be a better way to do this...
    blockAndLogStreamer = {
      reconcileNewBlock: jest.fn(),
      subscribeToOnBlockAdded: jest.fn(),
      subscribeToOnBlockRemoved: jest.fn(),
      subscribeToOnLogsAdded: jest.fn(),
      subscribeToOnLogsRemoved: jest.fn(),
    };

    const parseLogs = jest.fn().mockImplementation((logs: Log[]) =>
      logs.map<ParsedLog>(log => ({
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
      blockAndLogStreamer,
      listenForNewBlocks: jest.fn(),
      getEventTopics: jest.fn(),
      getLogs: jest.fn(),
      getEventContractAddress: jest.fn(),
      getBlockByHash: jest.fn().mockImplementation((hash: string) => {
        const blockNumber = parseInt(hash.slice(5), 10);
        return buildBlock(blockNumber);
      }),
      parseLogs,
    };

    blockAndLogStreamerListener = new BlockAndLogStreamerListener(deps);

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
      expect(blockAndLogStreamerListener.buildFilter()).toEqual({
        address: [],
        topics: [],
      } as ExtendedFilter);
    });

    test('single contract, multiple filters', () => {
      blockAndLogStreamerListener.listenForEvent('SomeEvent', jest.fn());
      blockAndLogStreamerListener.listenForEvent('SomeOtherEvent', jest.fn());
      expect(blockAndLogStreamerListener.buildFilter()).toEqual({
        address: [CONTRACT_ADDRESSES[1]],
        topics: [['0xSOMETOPIC', '0xSOMEOTHERTOPIC']],
      } as ExtendedFilter);
    });

    test('single listener, multiple contracts', () => {
      blockAndLogStreamerListener.listenForEvent(
        ['SomeTopicFromAnotherAddress', 'SomeEvent'],
        jest.fn()
      );

      expect(blockAndLogStreamerListener.buildFilter()).toEqual({
        address: [CONTRACT_ADDRESSES[0], CONTRACT_ADDRESSES[1]],
        topics: [['0xSOMETOPICFROMANOTHERADDRESS', '0xSOMETOPIC']],
      } as ExtendedFilter);
    });

    test('multiple listeners, multiple events', async () => {
      blockAndLogStreamerListener.listenForEvent(
        ['SomeTopicFromAnotherAddress', 'SomeEvent'],
        jest.fn()
      );

      blockAndLogStreamerListener.listenForEvent(
        ['SomeTopicFromAnotherAddress', 'SomeEventWithoutLogs', 'SomeOtherEvent'],
        jest.fn()
      );

      expect(blockAndLogStreamerListener.buildFilter()).toEqual({
        address: [CONTRACT_ADDRESSES[0], CONTRACT_ADDRESSES[1]],
        topics: [['0xSOMETOPICFROMANOTHERADDRESS', '0xSOMETOPIC',  '0xSOMETOPICWITHOUTLOGS', '0xSOMEOTHERTOPIC']],
      } as ExtendedFilter);
    });
  });

  describe('onBlockAdded', () => {
    let onNewLogCallback: jest.Mock;
    beforeEach(() => {
      deps.getLogs.mockResolvedValue([]);

      onNewLogCallback = jest.fn();
      blockAndLogStreamerListener.listenForEvent(
        ['SomeTopicFromAnotherAddress', 'SomeEvent'],
        onNewLogCallback
      );
    });

    describe('upon new block with logs', () => {
      beforeEach(async () => {
        deps.getLogs.mockResolvedValue([]);

        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1233));

        deps.getLogs.mockResolvedValue(sampleLogs);
        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1234));

        deps.getLogs.mockResolvedValue([]);
        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1235));
      });

      test('should retry empty blocks', async () => {
        expect(deps.getLogs).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            fromBlock: 1233,
            toBlock: 1233,
          })
        );

        // Attempt to grab logs for both 1233 and 1234.
        expect(deps.getLogs).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            fromBlock: 1233,
            toBlock: 1234,
          })
        );
      });

      test('should emit empty logs for "found" blocks', async () => {
        expect(onNewLogCallback).toHaveBeenCalledTimes(4);

        // One callback per topic/contract pair.
        expect(onNewLogCallback).toHaveBeenNthCalledWith(1, 1233, []);
        expect(onNewLogCallback).toHaveBeenNthCalledWith(2, 1233, []);
        expect(onNewLogCallback).toHaveBeenNthCalledWith(3, 1234, []);
        expect(onNewLogCallback).toHaveBeenNthCalledWith(4, 1234, [
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
        ]);
      });

      test('should no longer query for blocks when a log has shown up for a subsequent block', async () => {
        expect(deps.getLogs).toHaveBeenLastCalledWith(
          expect.objectContaining({
            fromBlock: 1235,
            toBlock: 1235,
          })
        );
      });

      describe('rollback', () => {
        beforeEach(async () => {
          // Block stream will only remove one block at a time.
          await blockAndLogStreamerListener.onBlockRemoved(buildBlock(1235));
          await blockAndLogStreamerListener.onBlockRemoved(buildBlock(1234));
          await blockAndLogStreamerListener.onBlockRemoved(buildBlock(1233));

          await blockAndLogStreamerListener.onBlockAdded(buildBlock(1233));
          await blockAndLogStreamerListener.onBlockAdded(buildBlock(1234));
        });

        test('should rerequest logs for the new block(s)', async () => {
          expect(deps.getLogs).toHaveBeenLastCalledWith(
            expect.objectContaining({
              fromBlock: 1233,
              toBlock: 1234,
            })
          );
        });
      });
    });

    describe('window depth', () => {
      it('should drop a block if outside window width', async () => {
        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1233));
        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1234));
        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1235));
        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1236));
        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1237));
        await blockAndLogStreamerListener.onBlockAdded(buildBlock(1238));

        expect(deps.getLogs).toHaveBeenLastCalledWith(
          expect.objectContaining({
            fromBlock: 1234,
            toBlock: 1238,
          })
        );
      });
    });
  });

  describe('onLogsAdded', () => {
    let onNewLogCallback: jest.Mock;
    beforeEach(() => {
      onNewLogCallback = jest.fn();
    });

    describe('single topic', () => {
      beforeEach(() => {
        blockAndLogStreamerListener.listenForEvent(
          'SomeEvent',
          onNewLogCallback
        );
      });

      test('should notify log listeners', async () => {
        await blockAndLogStreamerListener.onNewBlock(nextBlock);
        expect(blockAndLogStreamer.reconcileNewBlock).toHaveBeenCalledWith(
          nextBlock
        );
      });

      test('should filter logs passed to listeners', async () => {
        await blockAndLogStreamerListener.onLogsAdded('HASH-1234', sampleLogs);
        expect(onNewLogCallback).toBeCalledWith(1234, [
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
        ]);
      });
    });

    describe('multiple topics', () => {
      beforeEach(() => {
        blockAndLogStreamerListener.listenForEvent(
          ['SomeEvent', 'SomeOtherEvent', 'SomeEventWithoutLogs'],
          onNewLogCallback
        );
      });

      test('should notify log listeners', async () => {
        await blockAndLogStreamerListener.onNewBlock(nextBlock);
        expect(blockAndLogStreamer.reconcileNewBlock).toHaveBeenCalledWith(
          nextBlock
        );
      });

      test('should filter logs passed to listeners', async () => {
        await blockAndLogStreamerListener.onLogsAdded('HASH-1234', sampleLogs);
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
        blockAndLogStreamerListener.listenForAllEvents(onNewLogCallback);
      });

      test('should pass logs to callback', async () => {
        await blockAndLogStreamerListener.onLogsAdded('HASH-1234', sampleLogs);

        expect(onNewLogCallback).toHaveBeenCalledWith(1234, [
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
          expect.objectContaining({
            transactionHash: 'HASHTWO',
          }),
          expect.objectContaining({
            transactionHash: 'HASHTHREE',
          }),
          expect.objectContaining({
            transactionHash: 'HASHFOUR',
          }),
        ]);
      });

      test('should emit an event with all logs', async () => {
        // Calling same callback twice to ensure order.
        blockAndLogStreamerListener.listenForEvent(
          'SomeEvent',
          onNewLogCallback
        );

        await blockAndLogStreamerListener.onLogsAdded('HASH-1234', sampleLogs);

        expect(onNewLogCallback).toHaveBeenNthCalledWith(1, 1234, [
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
        ]);

        // "All logs"
        expect(onNewLogCallback).toHaveBeenNthCalledWith(2, 1234, [
          expect.objectContaining({
            transactionHash: 'HASHONE',
          }),
          expect.objectContaining({
            transactionHash: 'HASHTWO',
          }),
          expect.objectContaining({
            transactionHash: 'HASHTHREE',
          }),
          expect.objectContaining({
            transactionHash: 'HASHFOUR',
          }),
        ]);
      });
    });
  });
});
