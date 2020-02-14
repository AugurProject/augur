import { ContractAddresses, NetworkId } from '@augurproject/artifacts';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { WarpSyncStrategy } from '@augurproject/sdk/build/state/sync/WarpSyncStrategy';
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
import { BigNumber } from 'bignumber.js';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { Block } from 'ethers/providers';
import * as IPFS from 'ipfs';
import { makeDbMock, makeProvider } from '../../libs';

const mock = makeDbMock();

describe('WarpController', () => {
  const biggestNumber = new BigNumber(2).pow(256).minus(2);
  let addresses: ContractAddresses;
  let dependencies: ContractDependenciesEthers;
  let ipfs;
  let john: TestContractAPI;
  let networkId: NetworkId;
  let provider: TestEthersProvider;
  let warpController: WarpController;
  let firstCheckpointFileHash: string;
  let secondCheckpointFileHash: string;
  let allMarketIds: string[];
  let uploadBlockHeaders: Block;
  let firstCheckpointBlockHeaders: Block;
  let newBlockHeaders: Block;
  let seed: Seed;

  beforeAll(async () => {
    configureDexieForNode(true);
    ipfs = await IPFS.create({
      repo: './data',
    });

    seed = await loadSeedFile(defaultSeedPath, 'WarpSync');

    provider = await makeProvider(seed, ACCOUNTS);
    networkId = await provider.getNetworkId();
    const signer = await makeSigner(ACCOUNTS[0], provider);
    dependencies = makeDependencies(ACCOUNTS[0], provider, signer);
    addresses = seed.addresses;

    uploadBlockHeaders = await provider.getBlock(0);
    firstCheckpointBlockHeaders = await provider.getBlock(170);
    newBlockHeaders = await provider.getBlock('latest');

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      seed.addresses
    );

    // partially populate db.
    await john.sync(170);

    // I'm just assuming the upload block is 0. Shouldn't
    // really be a problem that we are grabbing extra blocks.
    warpController = new WarpController(
      john.db,
      ipfs,
      provider,
      uploadBlockHeaders
    );
    firstCheckpointFileHash = await warpController.createAllCheckpoints(
      await provider.getBlock(170)
    );

    await john.sync();

    secondCheckpointFileHash = await warpController.createAllCheckpoints(
      newBlockHeaders
    );

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
          number: 0,
        }),
        expect.objectContaining({
          number: 177,
        }),
      ]);
    });
  });

  describe('createCheckpoint method', () => {
    test('should create checkpoint file and return the hash', async () => {
      // Specific event type doesn't matter. Just need two logs that
      // will produce a range of blocks whose first and last will
      // contain said log.
      const logs = await john.augur.contractEvents.getLogs(
        'MarketCreated',
        uploadBlockHeaders.number,
        newBlockHeaders.number
      );

      const targetBeginNumber = Math.min(...logs.map(item => item.blockNumber));
      const targetEndNumber = Math.max(...logs.map(item => item.blockNumber));
      const hash = await warpController.createCheckpoint(
        await provider.getBlock(targetBeginNumber),
        await provider.getBlock(targetEndNumber)
      );

      console.log(
        'await ipfs.cat(`${hash.Hash}`)',
        (await ipfs.cat(`${hash.Hash}`)).toString()
      );

      const result = JSON.parse(
        (await ipfs.cat(`${hash.Hash}`)).toString()
      ).map(item => item.blockNumber);

      expect(Math.min(...result)).toEqual(targetBeginNumber);
      expect(Math.max(...result)).toEqual(targetEndNumber);
    });
  });

  describe('getAvailableCheckpointsByHash method', () => {
    test('return array of checkpoints available', async () => {
      await expect(
        warpController.getAvailableCheckpointsByHash(secondCheckpointFileHash)
      ).resolves.toEqual([0, 168, 176]);
    });
  });

  describe('createCheckpoints', () => {
    test('Create checkpoint db records', async () => {
      await expect(john.db.warpCheckpoints.table.toArray()).resolves.toEqual([
        expect.objectContaining({
          _id: 1,
          begin: expect.objectContaining({
            number: 0,
          }),
          end: expect.objectContaining({
            number: 167,
          }),
          ipfsInfo: expect.objectContaining({
            Name: '0',
          }),
        }),
        expect.objectContaining({
          _id: 2,
          begin: expect.objectContaining({
            number: 168,
          }),
          end: expect.objectContaining({
            number: 175,
          }),
          ipfsInfo: expect.objectContaining({
            Name: '168',
          }),
        }),
        expect.objectContaining({
          _id: 3,
          begin: expect.objectContaining({
            number: 176,
          }),
          end: expect.objectContaining({
            number: 177,
          }),
          ipfsInfo: expect.objectContaining({
            Name: '176',
          }),
        }),
        expect.objectContaining({
          _id: 4,
          begin: expect.objectContaining({
            number: 178,
          }),
        }),
      ]);
    });

    test('should create initial checkpoints', async () => {
      await expect(
        ipfs.ls(`${secondCheckpointFileHash}/checkpoints/`)
      ).resolves.toEqual([
        expect.objectContaining({
          name: '0',
        }),
        expect.objectContaining({
          name: '168',
        }),
        expect.objectContaining({
          name: '176',
        }),
      ]);
    });

    test('getCheckpointBlockRange', async () => {
      await expect(
        john.db.warpCheckpoints.getCheckpointBlockRange()
      ).resolves.toEqual([
        expect.objectContaining({
          number: 0,
        }),
        expect.objectContaining({
          number: 177,
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
          expect.objectContaining({
            name: 'index',
            type: 'file',
          }),
          expect.objectContaining({
            name: 'tables',
            type: 'dir',
          }),
        ]);
      });
    });
  });

  describe('non-empty dbs', () => {
    // This is a spot check.
    test('should have some logs', async () => {
      const marketCreated = await ipfs.cat(
        `${secondCheckpointFileHash}/tables/MarketCreated/index`
      );
      const splitLogs = marketCreated
        .toString()
        .split('\n')
        .filter(log => log)
        .map(log => {
          try {
            return JSON.parse(log);
          } catch (e) {
            console.error(e, log);
          }
        });

      expect(splitLogs).toEqual(await john.db.MarketCreated.toArray());
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
        seed.addresses
      );

      fixtureDB = await mock.makeDB(fixture.augur);
      fixtureApi = new API(john.augur, Promise.resolve(fixtureDB));

      fixtureBulkSyncStrategy = new BulkSyncStrategy(
        provider.getLogs,
        fixtureDB.logFilters.buildFilter,
        fixtureDB.logFilters.onLogsAdded,
        fixture.augur.contractEvents.parseLogs,
        50
      );

      newJohn = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        provider,
        seed.addresses
      );

      newJohnDB = await mock.makeDB(newJohn.augur);
      newJohnWarpController = new WarpController(
        newJohnDB,
        ipfs,
        provider,
        uploadBlockHeaders
      );
      newJohnApi = new API(newJohn.augur, Promise.resolve(newJohnDB));
      warpSyncStrategy = new WarpSyncStrategy(
        newJohnWarpController,
        newJohnDB.logFilters.onLogsAdded
      );

      newJohnWarpController = new WarpController(
        newJohnDB,
        ipfs,
        provider,
        uploadBlockHeaders
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
          universe: addresses.Universe,
        });

        const result = await newJohnApi.route('getMarkets', {
          universe: addresses.Universe,
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

        const firstBlockNumber = await fixtureBulkSyncStrategy.start(0, blockNumber);
        const fixtureMarketList = await fixtureApi.route('getMarkets', {
          universe: addresses.Universe,
        });

        // Sanity check.
        await expect(
          newJohnApi.route('getMarkets', {
            universe: addresses.Universe,
          })
        ).resolves.toEqual(fixtureMarketList);

        // populate db. Admittedly this just proves the logs were loaded.
        blockNumber = await warpSyncStrategy.start(secondCheckpointFileHash);

        await fixtureBulkSyncStrategy.start(firstBlockNumber + 1, blockNumber);
        const rolledbackFixtureMarketList = await fixtureApi.route(
          'getMarkets',
          {
            universe: addresses.Universe,
          }
        );

        await expect(
          newJohnApi.route('getMarkets', {
            universe: addresses.Universe,
          })
        ).resolves.toEqual(rolledbackFixtureMarketList);
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
