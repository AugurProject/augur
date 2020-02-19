import { ContractAddresses } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Augur, Connectors } from '@augurproject/sdk';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import {
  makeDbMock,
  makeProvider,
  makeTestAugur,
  MockGnosisRelayAPI,
} from '../../libs';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';

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
  const baseProvider = await makeProvider(seed, ACCOUNTS);
  const addresses = baseProvider.getContractAddresses();

  const john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    baseProvider,
    addresses
  );

  await john.sync();

  const syncableDBName = 'DisputeCrowdsourcerCompleted';
  const metaDBName = 'BlockNumbersSequenceIds';
  const universe = '0x11149d40d255fCeaC54A3ee3899807B0539bad60';

  const originalHighestSyncedBlockNumbers: any = {};
  originalHighestSyncedBlockNumbers[
    syncableDBName
  ] = await john.db.syncStatus.getHighestSyncBlock(syncableDBName);
  originalHighestSyncedBlockNumbers[
    metaDBName
  ] = await john.db.syncStatus.getHighestSyncBlock(metaDBName);

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

  await john.db.addNewBlock(syncableDBName, blockLogs);
  let highestSyncedBlockNumber = await john.db.syncStatus.getHighestSyncBlock(
    syncableDBName
  );
  expect(highestSyncedBlockNumber).toBe(
    originalHighestSyncedBlockNumbers[syncableDBName] + 1
  );

  blockLogs[0].blockNumber = highestSyncedBlockNumber + 1;

  await john.db.addNewBlock(syncableDBName, blockLogs);
  highestSyncedBlockNumber = await john.db.syncStatus.getHighestSyncBlock(
    syncableDBName
  );
  expect(highestSyncedBlockNumber).toBe(
    originalHighestSyncedBlockNumbers[syncableDBName] + 2
  );

  // Verify that 2 new blocks were added to SyncableDB
  let result = await john.db.DisputeCrowdsourcerCompleted.toArray();
  expect(result[0].blockNumber).toEqual(
    originalHighestSyncedBlockNumbers[syncableDBName] + 1
  );
  expect(result[0].logIndex).toEqual(1);
  expect(result[1].blockNumber).toEqual(
    originalHighestSyncedBlockNumbers[syncableDBName] + 2
  );


  await john.db.logFilters.onBlockRemoved(highestSyncedBlockNumber - 1);
  // Verify that newest 2 blocks were removed from SyncableDB
  result = await john.db.DisputeCrowdsourcerCompleted.toArray();

  expect(result).toEqual([]);


  expect(await john.db.syncStatus.getHighestSyncBlock(syncableDBName)).toBe(
    originalHighestSyncedBlockNumbers[syncableDBName]
  );
  expect(await john.db.syncStatus.getHighestSyncBlock(metaDBName)).toBe(
    originalHighestSyncedBlockNumbers[metaDBName]
  );
});

test('rollback derived database', async () => {
  let john: TestContractAPI;

  let provider: EthersProvider;
  let addresses: ContractAddresses;

  const seed = await loadSeedFile(defaultSeedPath);
  addresses = seed.addresses;
  provider = await makeProvider(seed, ACCOUNTS);

  const johnConnector = new Connectors.DirectConnector();
  const johnGnosis = new MockGnosisRelayAPI();
  john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    addresses,
    johnConnector,
    johnGnosis
  );
  expect(john).toBeDefined();

  johnGnosis.initialize(john);
  johnConnector.initialize(john.augur, john.db);

  Object.defineProperty(john.db.marketDatabase, 'syncing', {
    get: jest.fn(() => false),
    set: jest.fn()
  });

  await john.approveCentralAuthority();

  await john.repFaucet(new BigNumber(1e20));

  await john.sync();

  // Buy PTs
  const curDisputeWindowAddress = await john.getOrCreateCurrentDisputeWindow(
    false
  );
  const curDisputeWindow = await john.augur.contracts.disputeWindowFromAddress(
    curDisputeWindowAddress
  );
  const amountParticipationTokens = new BigNumber(1e18);
  await john.buyParticipationTokens(
    curDisputeWindow.address,
    amountParticipationTokens
  );

  await john.sync();

  // Confirm balance
  let ptBalanceRecord = await john.db.TokenBalanceChangedRollup.get([john.account.publicKey, curDisputeWindowAddress]);
  let ptBalance = new BigNumber(ptBalanceRecord.balance);
  await expect(ptBalance).toEqual(amountParticipationTokens);

  // Rollback
  await john.db.rollback(ptBalanceRecord.blockNumber);

  // Confirm nothing there
  ptBalanceRecord = await john.db.TokenBalanceChangedRollup.get([john.account.publicKey, curDisputeWindowAddress]);
  await expect(ptBalanceRecord).toBeFalsy();

  // Buy Pts again. Since we told the DB to rollback but in reality no log removal occured the balance will be 2x
  await john.buyParticipationTokens(
    curDisputeWindow.address,
    amountParticipationTokens
  );

  await john.sync();

  ptBalanceRecord = await john.db.TokenBalanceChangedRollup.get([john.account.publicKey, curDisputeWindowAddress]);
  ptBalance = new BigNumber(ptBalanceRecord.balance);
  await expect(ptBalance).toEqual(amountParticipationTokens.multipliedBy(2));

  // Rollback second purchase
  await john.db.rollback(ptBalanceRecord.blockNumber);

  // Confirm first balance
  ptBalanceRecord = await john.db.TokenBalanceChangedRollup.get([john.account.publicKey, curDisputeWindowAddress]);
  ptBalance = new BigNumber(ptBalanceRecord.balance);
  await expect(ptBalance).toEqual(amountParticipationTokens);
});
