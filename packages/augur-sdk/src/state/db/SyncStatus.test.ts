import { PouchDBFactory } from "./AbstractDB";
import { SyncStatus } from "./SyncStatus";

const DB_FACTORY = PouchDBFactory({ adapter: "memory" });

test("set sync blocks", async () => {
  const syncStatus = new SyncStatus(4, 9, DB_FACTORY);

  expect(syncStatus.defaultStartSyncBlockNumber).toEqual(9);

  let syncBlock = await syncStatus.getHighestSyncBlock("foobar");
  expect(syncBlock).toEqual(9);

  await syncStatus.setHighestSyncBlock("foobar", 10, false);
  syncBlock = await syncStatus.getHighestSyncBlock("foobar");
  expect(syncBlock).toEqual(10);

  await syncStatus.setHighestSyncBlock("foobar", 9000, false);
  syncBlock = await syncStatus.getHighestSyncBlock("foobar");
  expect(syncBlock).toEqual(9000);
});

test("lowest block and syncing options", async () => {
  const syncStatus = new SyncStatus(4, 9, DB_FACTORY);

  await syncStatus.setHighestSyncBlock("foobar", 9000, true);
  await syncStatus.setHighestSyncBlock("barfoo", 8000, true);

  expect(await syncStatus.getLowestSyncingBlockForAllDBs()).toEqual(8000);

  await syncStatus.updateSyncingToFalse("barfoo");

  expect(await syncStatus.getLowestSyncingBlockForAllDBs()).toEqual(9000);

  await syncStatus.updateSyncingToFalse("foobar");

  expect(await syncStatus.getLowestSyncingBlockForAllDBs()).toEqual(-1);
});
