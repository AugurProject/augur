import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
} from '@augurproject/tools';
import { makeDbMock, makeProvider } from '../../../libs';

const mock = makeDbMock();

let db: Promise<DB>;
let api: API;
let john: ContractAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
  db = mock.makeDB(john.augur, ACCOUNTS);
  api = new API(john.augur, db);
  await john.approveCentralAuthority();
});

// NOTE: Full-text searching is tested more in SyncableDB.test.ts
test("State API :: Status :: getSyncData", async () => {
  const dbName = "MarketCreated";

  await (await db).syncStatus.setHighestSyncBlock(dbName, 10, false);

  const syncData = await api.route("getSyncData", {});

  const highestAvailableBlockNumber = syncData.highestAvailableBlockNumber;
  const blocksBehindCurrent = highestAvailableBlockNumber - 10;
  const percentSynced = (blocksBehindCurrent * 100 / highestAvailableBlockNumber).toFixed(4);

  expect(syncData).toEqual({
    highestAvailableBlockNumber: highestAvailableBlockNumber,
    lastSyncedBlockNumber: 10,
    blocksBehindCurrent: blocksBehindCurrent,
    percentSynced: percentSynced,
  });
});
