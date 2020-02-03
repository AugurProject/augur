import { Augur } from '@augurproject/sdk';
import {
  makeTestAugur,
  makeDbMock,
  makeProvider,
  MockGnosisRelayAPI,
} from '../../libs';
import {
  ContractAPI,
  ACCOUNTS,
  loadSeedFile,
  defaultSeedPath,
} from '@augurproject/tools';
import { stringTo32ByteHex } from '../../libs/Utils';
import { BigNumber } from 'bignumber.js';
import { WSClient } from '@0x/mesh-rpc-client';
import * as _ from 'lodash';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { ContractAddresses } from '@augurproject/artifacts';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { Connectors, BrowserMesh } from '@augurproject/sdk';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { MockMeshServer, stopServer } from '../../libs/MockMeshServer';
import { MockBrowserMesh } from '../../libs/MockBrowserMesh';

const mock = makeDbMock();
let augur: Augur;

/**
 * Adds 2 new blocks to DisputeCrowdsourcerCompleted DB and performs a rollback.
 * Queries before & after rollback to ensure blocks are removed successfully.
 * Also checks MetaDB to make sure blocks/sequence IDs were removed correctly
 * and checks DBs to make sure highest sync block is correct.
 */
test('sync databases', async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  augur = await makeTestAugur(seed, ACCOUNTS);
  const db = await mock.makeDB(augur, ACCOUNTS);
  await db.sync(
    augur,
    mock.constants.chunkSize,
    mock.constants.blockstreamDelay
  );

  const syncableDBName = 'DisputeCrowdsourcerCompleted';
  const metaDBName = 'BlockNumbersSequenceIds';
  const universe = '0x11149d40d255fCeaC54A3ee3899807B0539bad60';

  const originalHighestSyncedBlockNumbers: any = {};
  originalHighestSyncedBlockNumbers[
    syncableDBName
  ] = await db.syncStatus.getHighestSyncBlock(syncableDBName);
  originalHighestSyncedBlockNumbers[
    metaDBName
  ] = await db.syncStatus.getHighestSyncBlock(metaDBName);

  const blockLogs = [
    {
      universe,
      market: '0xC0ffe3F654d442589BAb472937F094970339d214',
      disputeCrowdsourcer: '0x65d4f86927D1f10eFa2Fb884e4DEe0aB86137caD',
      blockHash:
        '0x8132a0cdb4226b3bbb5bcf8429ec0883859255751be2c321c58b488395188040',
      blockNumber: originalHighestSyncedBlockNumbers[syncableDBName] + 1,
      transactionIndex: 8,
      removed: false,
      transactionHash:
        '0xf750ebb0d039c623385f8227f7a6cbe49f5efbc5485ac0e38b5a7b0e389726d8',
      logIndex: 1,
    },
  ];

  await db.addNewBlock(syncableDBName, blockLogs);
  let highestSyncedBlockNumber = await db.syncStatus.getHighestSyncBlock(
    syncableDBName
  );
  expect(highestSyncedBlockNumber).toBe(
    originalHighestSyncedBlockNumbers[syncableDBName] + 1
  );

  blockLogs[0].blockNumber = highestSyncedBlockNumber + 1;

  await db.addNewBlock(syncableDBName, blockLogs);
  highestSyncedBlockNumber = await db.syncStatus.getHighestSyncBlock(
    syncableDBName
  );
  expect(highestSyncedBlockNumber).toBe(
    originalHighestSyncedBlockNumbers[syncableDBName] + 2
  );

  // Verify that 2 new blocks were added to SyncableDB
  let result = await db.DisputeCrowdsourcerCompleted.toArray();
  expect(result[0].blockNumber).toEqual(
    originalHighestSyncedBlockNumbers[syncableDBName] + 1
  );
  expect(result[0].logIndex).toEqual(1);
  expect(result[1].blockNumber).toEqual(
    originalHighestSyncedBlockNumbers[syncableDBName] + 2
  );
  expect(result[1].logIndex).toEqual(1);

  await db.rollback(highestSyncedBlockNumber - 1);

  // Verify that newest 2 blocks were removed from SyncableDB
  result = await db.DisputeCrowdsourcerCompleted.toArray();
  expect(result).toEqual([]);

  expect(await db.syncStatus.getHighestSyncBlock(syncableDBName)).toBe(
    originalHighestSyncedBlockNumbers[syncableDBName]
  );
  expect(await db.syncStatus.getHighestSyncBlock(metaDBName)).toBe(
    originalHighestSyncedBlockNumbers[metaDBName]
  );
});

test('rollback derived database', async () => {
  let john: ContractAPI;
  let johnDB: Promise<DB>;
  let johnAPI: API;

  let provider: EthersProvider;
  let addresses: ContractAddresses;

  const { port } = await MockMeshServer.create();
  const meshClient = new WSClient(`ws://localhost:${port}`);
  const meshBrowser = new MockBrowserMesh(meshClient);

  const seed = await loadSeedFile(defaultSeedPath);
  addresses = seed.addresses;
  provider = await makeProvider(seed, ACCOUNTS);

  const johnConnector = new Connectors.DirectConnector();
  const johnGnosis = new MockGnosisRelayAPI();
  john = await ContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    addresses,
    johnConnector,
    johnGnosis,
    meshClient,
    meshBrowser
  );
  expect(john).toBeDefined();

  johnGnosis.initialize(john);
  johnDB = mock.makeDB(john.augur, ACCOUNTS);
  johnConnector.initialize(john.augur, await johnDB);
  johnAPI = new API(john.augur, johnDB);
  await john.approveCentralAuthority();

  // Create a market
  const market = await john.createReasonableMarket([
    stringTo32ByteHex('A'),
    stringTo32ByteHex('B'),
  ]);

  await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

  // Place first trade
  await john.placeBasicYesNoZeroXTrade(
    0,
    market.address,
    1,
    new BigNumber(2000),
    new BigNumber(0.78),
    new BigNumber(0),
    new BigNumber(100000)
  );

  await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
  let marketData = await (await johnDB).Markets.get(market.address);
  const firstTradeBlock = marketData.blockNumber;

  // Place a trade on Invalid
  await john.placeBasicYesNoZeroXTrade(
    0,
    market.address,
    0,
    new BigNumber(2000),
    new BigNumber(0.78),
    new BigNumber(0),
    new BigNumber(100000)
  );

  await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

  // We monkeypatch the sync here to simulate updates from blockstream instead of bulk sync which normally doesnt store data in the rollback table
  const marketTable = (await johnDB)['marketDatabase'];
  const oldHandleMergeEvent = marketTable.handleMergeEvent;
  marketTable.handleMergeEvent = (async (
    blocknumber: number,
    logs: any[],
    syncing = false
  ): Promise<number> => {
    marketTable.syncing = false;
    const retVal = await oldHandleMergeEvent.bind(marketTable)(
      blocknumber,
      logs,
      syncing
    );
    return retVal;
  }).bind(marketTable);

  // Sync
  await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
  marketData = await (await johnDB).Markets.get(market.address);

  console.log('marketData.blockNumber--3', marketData.blockNumber);
  // Confirm the invalidFilter has been set due to this order on the market data
  await expect(marketData.invalidFilter).toEqual(1);

  // Now we'll rollback the block this update came in
  await (await johnDB).rollback(firstTradeBlock);

  marketData = await (await johnDB).Markets.get(market.address);

  // Confirm the invalidFilter has been set due to this order on the market data
  await expect(marketData.invalidFilter).toEqual(0);


  // cleanup
  meshClient.destroy();
  stopServer();
});
