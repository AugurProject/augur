import { Log, ParsedLog } from '@augurproject/types';
import { ExtendedLog } from 'blockstream-adapters';
import { Block } from 'ethereumjs-blockstream';
import {
  BlockAndLogStreamerInterface,
  BlockAndLogStreamerSyncStrategy,
  BlockAndLogStreamerListenerDependencies,
} from './BlockAndLogStreamerSyncStrategy';

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
  let blockAndLogStreamerListener: BlockAndLogStreamerSyncStrategy;

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
    };

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
      blockAndLogStreamer,
      listenForNewBlocks: jest.fn(),
      getLogs: jest.fn(),
      buildFilter: jest.fn(),
      onLogsAdded: jest.fn(),
    };

    deps.buildFilter.mockReturnValue({
      address: CONTRACT_ADDRESSES.slice(),
      topics: ['0xSOMETOPIC']
    });

    blockAndLogStreamerListener = new BlockAndLogStreamerSyncStrategy(
      deps.getLogs,
      deps.buildFilter,
      deps.onLogsAdded,
      deps.blockAndLogStreamer,
      deps.listenForNewBlocks
    );
  });

  describe('onBlockAdded', () => {
    beforeEach(() => {
      deps.getLogs.mockResolvedValue([]);
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
        expect(deps.onLogsAdded).toHaveBeenCalledTimes(2);

        // One callback per block.
        expect(deps.onLogsAdded).toHaveBeenNthCalledWith(1, 1233, []);
        expect(deps.onLogsAdded).toHaveBeenNthCalledWith(2, 1234, [
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
});
