import { SDKConfiguration } from '@augurproject/artifacts';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { WarpSyncGetter } from '@augurproject/sdk/build/state/getter/WarpSyncGetter';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { WarpSyncStrategy } from '@augurproject/sdk/build/state/sync/WarpSyncStrategy';
import * as IPFS from 'ipfs';
import { configureDexieForNode } from '@augurproject/sdk/build/state/utils/DexieIDBShim';
import {
  databasesToSync,
  WarpController,
} from '@augurproject/sdk/build/warp/WarpController';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
  makeDependencies,
  makeSigner,
} from '@augurproject/tools';
import { Seed, TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { Block } from 'ethers/providers';
import { makeDbMock, makeProvider } from '../../libs';

const mock = makeDbMock();

const filterRetrievelFn = (ipfs: IPFS) => (ipfsPath: string) =>
  ipfs
    .cat(ipfsPath)
    .then(item => item.toString())
    .then(item => JSON.parse(item));

describe('WarpController', () => {
  let config: SDKConfiguration;
  let dependencies: ContractDependenciesEthers;
  let ipfs;
  let john: TestContractAPI;
  let provider: TestEthersProvider;
  let warpController: WarpController;
  let firstCheckpointFileHash: string;
  let secondCheckpointFileHash: string;
  let allMarketIds: string[];
  let uploadBlockHeaders: Block;
  let firstCheckpointBlockHeaders: Block;
  let newBlockHeaders: Block;
  let seed: Seed;
  let metadata: {
    [name: string]: number
  };

  beforeAll(async () => {
    configureDexieForNode(true);

    seed = await loadSeedFile(defaultSeedPath, 'warpSync');

    metadata = seed.metadata;
    console.log('metadata', JSON.stringify(metadata));

    const firstCheckpointBlockNumber = metadata.checkpoint2_start;

    provider = await makeProvider(seed, ACCOUNTS);
    config = provider.getConfig();
    const signer = await makeSigner(ACCOUNTS[0], provider);
    dependencies = makeDependencies(ACCOUNTS[0], provider, signer);

    uploadBlockHeaders = await provider.getBlock(0);
    firstCheckpointBlockHeaders = await provider.getBlock(firstCheckpointBlockNumber);
    newBlockHeaders = await provider.getBlock('latest');

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      config
    );

    // partially populate db.
    await john.sync(firstCheckpointBlockNumber);

    warpController = new WarpController(
      john.db,
      john.augur,
      provider,
      uploadBlockHeaders,
      ipfs,
      filterRetrievelFn(ipfs)
    );
    ipfs = await warpController.getIpfs();
    firstCheckpointFileHash = (await warpController.onNewBlock(
      firstCheckpointBlockHeaders
    )) || '';

    await john.sync();

    secondCheckpointFileHash = (await warpController.onNewBlock(
      newBlockHeaders
    )) || '';

    allMarketIds = (await john.db.MarketCreated.toArray()).map(
      market => market.market
    );
  });

  afterAll(async () => {
    await ipfs.stop();
  });

  describe('queryDB', () => {
    test('limit blocks in query', async () => {
      const result = await warpController.queryDB(
        'TransferSingle',
        ['to', 'from'],
        john.account.publicKey,
        0,
        175
      );

      console.log('result', JSON.stringify(result));

      expect(result).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            blockNumber: '176',
          }),
        ])
      );
    });

    test('filter by block range', async () => {
      await expect(
        warpController.queryDB(
          'MarketCreated',
          ['market'],
          allMarketIds[0],
          uploadBlockHeaders.number,
          newBlockHeaders.number
        )
      ).resolves.toEqual([
        expect.objectContaining({
          market: allMarketIds[0],
        }),
      ]);
    });
  });

  describe('getCheckpointBlockRange', () => {
    test('should return the range', async () => {
      await expect(
        john.db.warpCheckpoints.getCheckpointBlockRange()
      ).resolves.toEqual([
        expect.objectContaining({
          number: metadata.checkpoint1_start,
        }),
        expect.objectContaining({
          number: metadata.checkpoint3_end,
        }),
      ]);
    });
  });

  describe('createCheckpoint method', () => {
    test('should create checkpoint file and return the hash', async () => {
      // Specific event type doesn't matter. Just need two logs that
      // will produce a range of blocks whose first and last will
      // contain said log.
      const logs = await john.db.MarketCreated.toArray();

      const targetBeginNumber = Math.min(...logs.map(item => item.blockNumber));
      const targetEndNumber = Math.max(...logs.map(item => item.blockNumber));
      const hash = await warpController.createCheckpoint(
        targetBeginNumber,
        targetEndNumber
      );

      const result = JSON.parse((await ipfs.cat(`${hash.Hash}`)).toString())[
        'logs'
      ].map(item => item.blockNumber);

      expect(Math.min(...result)).toEqual(targetBeginNumber);
      expect(Math.max(...result)).toEqual(targetEndNumber);
    });
  });

  describe('getMostRecentWarpSync getter', () => {
    test('should return the most recent warp sync data', async () => {
      // This block range will encompass all the checkpoints.
      const [begin, end] = await john.db.warpCheckpoints.getCheckpointBlockRange();
      await expect(WarpSyncGetter.getMostRecentWarpSync(john.augur, john.db, undefined)).resolves.toEqual(
        expect.objectContaining({
          hash: secondCheckpointFileHash,
          begin,
          end,
        })
      );
    });
  });

  describe('getAvailableCheckpointsByHash method', () => {
    test('return array of checkpoints available', async () => {
      await expect(
        warpController.getAvailableCheckpointsByHash(secondCheckpointFileHash)
      ).resolves.toEqual([
        expect.objectContaining({
          Name: metadata.checkpoint1_start.toString(),
        }),
        expect.objectContaining({
          Name: metadata.checkpoint2_start.toString(),
        }),
        expect.objectContaining({
          Name: metadata.checkpoint3_start.toString(),
        }),
      ]);
    });
  });

  describe('createCheckpoints', () => {
    test('Create checkpoint db records', async () => {
      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([
        expect.objectContaining({
          _id: 1,
          begin: expect.objectContaining({
            number: metadata.checkpoint1_start,
          }),
          end: expect.objectContaining({
            number: metadata.checkpoint1_end,
          }),
          ipfsInfo: expect.objectContaining({
            Name: metadata.checkpoint1_start.toString(),
          }),
        }),
        expect.objectContaining({
          _id: 2,
          begin: expect.objectContaining({
            number: metadata.checkpoint2_start,
          }),
          end: expect.objectContaining({
            number: metadata.checkpoint2_end,
          }),
          ipfsInfo: expect.objectContaining({
            Name: metadata.checkpoint2_start.toString(),
          }),
        }),
        expect.objectContaining({
          _id: 3,
          begin: expect.objectContaining({
            number:  metadata.checkpoint3_start,
          }),
          end: expect.objectContaining({
            number:  metadata.checkpoint3_end,
          }),
          ipfsInfo: expect.objectContaining({
            Name:  metadata.checkpoint3_start.toString(),
          }),
        }),
        expect.objectContaining({
          _id: 4,
          begin: expect.objectContaining({
            number:  metadata.checkpoint4_start,
          }),
        }),
      ]);
    });

    test('should create initial checkpoints', async () => {
      await expect(
        ipfs.ls(`${secondCheckpointFileHash}/checkpoints/`)
      ).resolves.toEqual([
        expect.objectContaining({
          name: metadata.checkpoint1_start.toString(),
        }),
        expect.objectContaining({
          name: metadata.checkpoint2_start.toString()
        }),
        expect.objectContaining({
          name: metadata.checkpoint3_start.toString()
        }),
      ]);
    });

    test('getCheckpointBlockRange', async () => {
      await expect(
        john.db.warpCheckpoints.getCheckpointBlockRange()
      ).resolves.toEqual([
        expect.objectContaining({
          number: metadata.checkpoint1_start,
        }),
        expect.objectContaining({
          number: metadata.checkpoint3_end,
        }),
      ]);
    });
  });

  describe('structure', () => {
    describe('top-level directory', () => {
      test('should have a version file with the version number', async () => {
        await expect(
          ipfs.cat(`${secondCheckpointFileHash}/VERSION`)
        ).resolves.toEqual(Buffer.from('1'));
      });

      test('should have the prescribed layout', async () => {
        await expect(ipfs.ls(`${secondCheckpointFileHash}`)).resolves.toEqual([
          expect.objectContaining({
            name: 'VERSION',
            type: 'file',
          }),
          expect.objectContaining({
            name: 'checkpoints',
            type: 'dir',
          }),
        ]);
      });
    });
  });

  describe('syncing', () => {
    let fixture: ContractAPI;
    let fixtureApi: API;
    let fixtureDB: DB;
    let fixtureBulkSyncStrategy: BulkSyncStrategy;

    let newJohn: ContractAPI;
    let newJohnApi: API;
    let newJohnDB: DB;
    let newJohnWarpController: WarpController;
    let warpSyncStrategy: WarpSyncStrategy;

    beforeEach(async () => {
      fixture = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        provider,
        config
      );

      fixtureDB = await mock.makeDB(fixture.augur);
      fixtureApi = new API(john.augur, Promise.resolve(fixtureDB));

      fixtureBulkSyncStrategy = new BulkSyncStrategy(
        provider.getLogs,
        john.augur.contractEvents.getAugurContractAddresses(),
        fixtureDB.logFilters.onLogsAdded,
        fixture.augur.contractEvents.parseLogs,
        50
      );

      newJohn = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        provider,
        config
      );

      newJohnDB = await mock.makeDB(newJohn.augur);
      newJohnWarpController = new WarpController(
        newJohnDB,
        john.augur,
        provider,
        uploadBlockHeaders,
        ipfs,
        filterRetrievelFn(ipfs)
      );
      newJohnApi = new API(newJohn.augur, Promise.resolve(newJohnDB));
      warpSyncStrategy = new WarpSyncStrategy(
        newJohnWarpController,
        newJohnDB.logFilters.onLogsAdded
      );

      newJohnWarpController = new WarpController(
        newJohnDB,
        john.augur,
        provider,
        uploadBlockHeaders,
        ipfs,
        filterRetrievelFn(ipfs)
      );
      newJohnApi = new API(newJohn.augur, Promise.resolve(newJohnDB));

      warpSyncStrategy = new WarpSyncStrategy(
        newJohnWarpController,
        newJohnDB.logFilters.onLogsAdded
      );
    });

    describe.skip('full sync', () => {
      beforeEach(async () => {
        const blockNumber = await warpSyncStrategy.start(
          secondCheckpointFileHash
        );

        await fixtureBulkSyncStrategy.start(0, blockNumber);
      });

      test('compare contents of databases', async () => {
        const fixtureLogs = {};
        const newJohnLogs = {};

        // Doing this as one test for speed. Would be prettier to do it as many.
        for (let i = 0; i < databasesToSync.length; i++) {
          const { databaseName } = databasesToSync[i];

          fixtureLogs[databaseName] = await fixtureDB[databaseName].toArray();
          newJohnLogs[databaseName] = await newJohnDB[databaseName].toArray();
        }

        expect(newJohnLogs).toEqual(fixtureLogs);
      });

      test('should populate market data', async () => {
        const fixtureMarketList = await fixtureApi.route('getMarkets', {
          universe: config.addresses.Universe,
        });

        const result = await newJohnApi.route('getMarkets', {
          universe: config.addresses.Universe,
        });

        expect(result).toEqual(fixtureMarketList);
      });
    });

    describe('checkpoint syncing', () => {
      test('identify new diff and just pull that', async () => {
        // populate db.
        let blockNumber = await warpSyncStrategy.start(firstCheckpointFileHash);

        // This should populate the checkpoints DB.
        await newJohnWarpController.createAllCheckpoints(
          firstCheckpointBlockHeaders
        );

        const firstBlockNumber = await fixtureBulkSyncStrategy.start(
          0,
          blockNumber
        );
        const fixtureMarketList = await fixtureApi.route('getMarkets', {
          universe: config.addresses.Universe,
        });

        // Sanity check.
        await expect(
          newJohnApi.route('getMarkets', {
            universe: config.addresses.Universe,
          })
        ).resolves.toEqual(fixtureMarketList);

        // populate db. Admittedly this just proves the logs were loaded.
        blockNumber = await warpSyncStrategy.start(secondCheckpointFileHash);

        await fixtureBulkSyncStrategy.start(firstBlockNumber + 1, blockNumber);
        const rolledbackFixtureMarketList = await fixtureApi.route(
          'getMarkets',
          {
            universe: config.addresses.Universe,
          }
        );

        await expect(
          newJohnApi.route('getMarkets', {
            universe: config.addresses.Universe,
          })
        ).resolves.toEqual(rolledbackFixtureMarketList);
      });

      test('should populate checkpoint db', async () => {
        // populate db.
        await warpSyncStrategy.start(
          secondCheckpointFileHash
        );
        await expect(
          newJohnDB.warpCheckpoints.table.toArray()
        ).resolves.toEqual(await john.db.warpCheckpoints.table.toArray());
      });
    });
  });
  describe('pinning ui', () => {
    test('valid hash', async () => {
      // For the purposes of pinning we don't care so much about the contents.
      const [{ hash }] = await ipfs.add(
        {
          path: '/tmp/myfile.txt',
          content: 'ABC',
        },
        {
          pin: false,
        }
      );

      await warpController.pinHashByGatewayUrl(
        `https://cloudflare-ipfs.com/ipfs/${hash}`
      );
      await expect(ipfs.pin.ls()).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            hash,
          }),
        ])
      );
    });
    test('invalid hash', async () => {
      await warpController.pinHashByGatewayUrl(
        'https://cloudflare-ipfs.com/ipfs/QQakF4QZQ9CYciRmcYA56kisvnEFHZRThzKBAzF5MXw6zv'
      );
      await expect(ipfs.pin.ls()).resolves.not.toEqual([
        expect.arrayContaining([
          expect.objectContaining({
            hash: 'QQakF4QZQ9CYciRmcYA56kisvnEFHZRThzKBAzF5MXw6zv',
          }),
        ]),
      ]);
    });
  });
});
