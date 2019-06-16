import { Augur } from "@augurproject/sdk";
import { makeTestAugur, ACCOUNTS, makeDbMock } from "../../libs";

const mock = makeDbMock();

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB();
});

let augur: Augur;
beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
}, 120000);

/**
 * Adds 2 new blocks to DisputeCrowdsourcerCompleted DB and performs a rollback.
 * Queries before & after rollback to ensure blocks are removed successfully.
 * Also checks MetaDB to make sure blocks/sequence IDs were removed correctly
 * and checks DBs to make sure highest sync block is correct.
 */
test("sync databases", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  const syncableDBName = mock.constants.networkId + "-DisputeCrowdsourcerCompleted";
  const metaDBName = mock.constants.networkId + "-BlockNumbersSequenceIds";
  const universe = "0x11149d40d255fCeaC54A3ee3899807B0539bad60";

  const originalHighestSyncedBlockNumbers: any = {};
  originalHighestSyncedBlockNumbers[syncableDBName] = await db.syncStatus.getHighestSyncBlock(syncableDBName);
  originalHighestSyncedBlockNumbers[metaDBName] = await db.syncStatus.getHighestSyncBlock(metaDBName);

  const blockLogs = [
    {
      universe,
      market: "0xC0ffe3F654d442589BAb472937F094970339d214",
      disputeCrowdsourcer: "0x65d4f86927D1f10eFa2Fb884e4DEe0aB86137caD",
      blockHash: "0x8132a0cdb4226b3bbb5bcf8429ec0883859255751be2c321c58b488395188040",
      blockNumber: originalHighestSyncedBlockNumbers[syncableDBName] + 1,
      transactionIndex: 8,
      removed: false,
      transactionHash: "0xf750ebb0d039c623385f8227f7a6cbe49f5efbc5485ac0e38b5a7b0e389726d8",
      logIndex: 1,
    },
  ];

  await db.addNewBlock(syncableDBName, blockLogs);
  let highestSyncedBlockNumber = await db.syncStatus.getHighestSyncBlock(syncableDBName);
  expect(highestSyncedBlockNumber).toBe(originalHighestSyncedBlockNumbers[syncableDBName] + 1);

  blockLogs[0].blockNumber = highestSyncedBlockNumber + 1;

  await db.addNewBlock(syncableDBName, blockLogs);
  highestSyncedBlockNumber = await db.syncStatus.getHighestSyncBlock(syncableDBName);
  expect(highestSyncedBlockNumber).toBe(originalHighestSyncedBlockNumbers[syncableDBName] + 2);

  // Verify that 2 new blocks were added to SyncableDB
  const queryObj: any = {
    selector: { universe },
    fields: ["_id", "universe"],
    sort: ["_id"],
  };
  let result = await db.findInSyncableDB(syncableDBName, queryObj);
  // TODO Remove warning property from expected result once indexes are being used on SyncableDBs
  expect(result).toEqual(expect.objectContaining(
    {
      docs:
        [{
          _id: (10000000000 + originalHighestSyncedBlockNumbers[syncableDBName] + 1) + ".00000000001",
          universe,
        },
        {
          _id: (10000000000 + originalHighestSyncedBlockNumbers[syncableDBName] + 2) + ".00000000001",
          universe,
        }],
      warning:
        "no matching index found, create an index to optimize query time",
    },
  ));

  // TODO If derived DBs are used, verify MetaDB contents before & after rollback

  await db.rollback(highestSyncedBlockNumber - 1);

  // Verify that newest 2 blocks were removed from SyncableDB
  result = await db.findInSyncableDB(syncableDBName, queryObj);
  expect(result).toEqual(expect.objectContaining(
    {
      docs: [],
      warning:
        "no matching index found, create an index to optimize query time",
    },
  ));

  expect(await db.syncStatus.getHighestSyncBlock(syncableDBName)).toBe(originalHighestSyncedBlockNumbers[syncableDBName]);
  expect(await db.syncStatus.getHighestSyncBlock(syncableDBName)).toBe(originalHighestSyncedBlockNumbers[syncableDBName]);
  expect(await db.syncStatus.getHighestSyncBlock(metaDBName)).toBe(originalHighestSyncedBlockNumbers[metaDBName]);
});
