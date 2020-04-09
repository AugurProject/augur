import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeed,
  TestContractAPI,
} from '@augurproject/tools';
import { makeProvider } from '../../../libs';

let john: TestContractAPI;

beforeAll(async () => {
  const seed = await loadSeed(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    provider.getConfig()
  );
  await john.approve();
});

// NOTE: Full-text searching is tested more in SyncableDB.test.ts
test('State API :: Status :: getSyncData', async () => {
  const dbName = 'MarketCreated';

  await john.db.syncStatus.setHighestSyncBlock(dbName, 10, false);

  const syncData = await john.api.route('getSyncData', {});

  const highestAvailableBlockNumber = syncData.highestAvailableBlockNumber;
  const blocksBehindCurrent = highestAvailableBlockNumber - 10;
  const percentSynced = (
    (blocksBehindCurrent * 100) /
    highestAvailableBlockNumber
  ).toFixed(4);

  expect(syncData).toEqual({
    highestAvailableBlockNumber,
    lastSyncedBlockNumber: 10,
    blocksBehindCurrent,
    percentSynced,
  });
});
