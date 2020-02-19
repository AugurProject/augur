import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeedFile,
  TestContractAPI,
} from '@augurproject/tools';
import { makeProvider } from '../../../libs';

let john: TestContractAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    seed.addresses
  );
  await john.approveCentralAuthority();
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
    highestAvailableBlockNumber: highestAvailableBlockNumber,
    lastSyncedBlockNumber: 10,
    blocksBehindCurrent: blocksBehindCurrent,
    percentSynced: percentSynced,
  });
});
