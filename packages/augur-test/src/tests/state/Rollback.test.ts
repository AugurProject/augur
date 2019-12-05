import { Augur } from '@augurproject/sdk';
import { makeTestAugur, makeDbMock, makeProvider } from '../../libs';
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { stringTo32ByteHex } from '../../libs/Utils';
import { BigNumber } from 'bignumber.js';


const mock = makeDbMock();

let augur: Augur;
beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  augur = await makeTestAugur(seed, ACCOUNTS);
});

/**
 * Adds 2 new blocks to DisputeCrowdsourcerCompleted DB and performs a rollback.
 * Queries before & after rollback to ensure blocks are removed successfully.
 * Also checks MetaDB to make sure blocks/sequence IDs were removed correctly
 * and checks DBs to make sure highest sync block is correct.
 */
test('sync databases', async () => {
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
  expect(result[0].blockNumber).toEqual(originalHighestSyncedBlockNumbers[syncableDBName] + 1);
  expect(result[0].logIndex).toEqual(1);
  expect(result[1].blockNumber).toEqual(originalHighestSyncedBlockNumbers[syncableDBName] + 2);
  expect(result[1].logIndex).toEqual(1);

  await db.rollback(highestSyncedBlockNumber - 1);

  // Verify that newest 2 blocks were removed from SyncableDB
  result = await db.DisputeCrowdsourcerCompleted.toArray();
  expect(result).toEqual([]);

  expect(await db.syncStatus.getHighestSyncBlock(syncableDBName)).toBe(originalHighestSyncedBlockNumbers[syncableDBName]);
  expect(await db.syncStatus.getHighestSyncBlock(metaDBName)).toBe(originalHighestSyncedBlockNumbers[metaDBName]);
});

test('rollback derived database', async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  const john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
  const db = mock.makeDB(john.augur, ACCOUNTS);

  await john.approveCentralAuthority();

  // Create a market
  const market = await john.createReasonableMarket([stringTo32ByteHex('A'), stringTo32ByteHex('B')]);

  // Place a bid order on Invalid
  let bid = new BigNumber(0);
  let outcome = new BigNumber(0);
  let numShares = new BigNumber(10**18);
  let price = new BigNumber(50);

  await john.simplePlaceOrder(market.address, bid, numShares, price, outcome);

  // We monkeypatch the sync here to simulate updates from blockstream instead of bulk sync which normally doesnt store data in the rollback table
  const marketTable = (await db)["marketDatabase"];
  const oldHandleMergeEvent = marketTable.handleMergeEvent;
  marketTable.handleMergeEvent = (async (
    blocknumber: number,
    logs: any[],
    syncing = false
  ): Promise<number> => {
    marketTable.syncing = false;
    const retVal = await oldHandleMergeEvent.bind(marketTable)(blocknumber, logs, syncing);
    return retVal;
  }).bind(marketTable);

  // Sync
  await (await db).sync(john.augur, mock.constants.chunkSize, 0);
  let marketData = await (await db).Markets.get(market.address);

  // Confirm the invalidFilter has been set due to this order on the market data
  await expect(marketData.invalidFilter).toEqual(1);

  // Now we'll rollback the block this update came in
  await (await db).rollback(marketData.blockNumber);

  marketData = await (await db).Markets.get(market.address);

  // Confirm the invalidFilter has been set due to this order on the market data
  await expect(marketData.invalidFilter).toEqual(0);
});
