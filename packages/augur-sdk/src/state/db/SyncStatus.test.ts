import { PouchDBFactory } from "./AbstractDB";
import { SyncStatus } from "./SyncStatus";

const DB_FACTORY = PouchDBFactory({adapter: "memory"});

test("set sync blocks", async () => {
  const syncStatus = new SyncStatus(4, 9, DB_FACTORY);

  expect(syncStatus.defaultStartSyncBlockNumber).toEqual(9);

  let syncBlock = await syncStatus.getHighestSyncBlock("foobar");
  expect(syncBlock).toEqual(9);

  await syncStatus.setHighestSyncBlock("foobar", 10);
  syncBlock = await syncStatus.getHighestSyncBlock("foobar");
  expect(syncBlock).toEqual(10);

  await syncStatus.setHighestSyncBlock("foobar", 9000);
  syncBlock = await syncStatus.getHighestSyncBlock("foobar");
  expect(syncBlock).toEqual(9000);
});
