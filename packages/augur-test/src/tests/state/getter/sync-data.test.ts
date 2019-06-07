import { API } from "@augurproject/sdk/build/state/getter/API";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import {
  ACCOUNTS,
  makeDbMock,
  deployContracts,
  ContractAPI,
} from "../../../libs";

const mock = makeDbMock();

let db: DB;
let api: API;
let john: ContractAPI;
// let mary: ContractAPI;

beforeAll(async () => {
  const { provider, addresses } = await deployContracts(ACCOUNTS, compilerOutput);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  db = await mock.makeDB(john.augur, ACCOUNTS);
  api = new API(john.augur, db);
  await john.approveCentralAuthority();
}, 120000);

// NOTE: Full-text searching is tested more in SyncableDB.test.ts
test("State API :: SyncData :: getSyncData", async () => {

  await db.sync(john.augur, mock.constants.chunkSize, 0);
  db.syncStatus.setHighestSyncBlock("MarketCreated", 10);

  const syncData = await api.route("getSyncData", {});

  expect(syncData).toEqual({
    highestAvailableBlockNumber: 89,
    lastSyncedBlockNumber: 10,
    blocksBehindCurrent: 79,
    percentBehindCurrent: "88.7640",
  });
});
