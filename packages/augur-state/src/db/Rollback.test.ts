import { Augur, UserSpecificEvent } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
const settings = require("../settings.json");
import { DB } from "./DB";
import {makeTestAugur, AccountList} from "./test";
import {makeMock} from "../utils/MakeMock";
import { IBlockAndLogStreamerListener } from "./BlockAndLogStreamerListener";
import { JsonRpcProvider } from "ethers/providers";

const mock = makeMock();
const TEST_NETWORK_ID = 4;
const ACCOUNTS: AccountList = [
  {
    secretKey: "0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913",
    publicKey: "0x8fff40efec989fc938bba8b19584da08ead986ee",
    balance: 100000000000000000000,  // 100 ETH
  },
];

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB()
});

let augur: Augur<any>;
beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
}, 60000);

/**
 * Adds 2 new blocks to DisputeCrowdsourcerCompleted DB and performs a rollback.
 * Queries before & after rollback to ensure blocks are removed successfully.
 * Also checks MetaDB to make sure blocks/sequence IDs were removed correctly
 * and checks DBs to make sure highest sync block is correct.
 */
test("sync databases", async () => {
    const trackedUsers = [settings.testAccounts[0]];
    const mock = makeMock();
    const blockAndLogStreamerListener: IBlockAndLogStreamerListener = {
      listenForBlockRemoved: jest.fn(),
      listenForEvent: jest.fn(),
      startBlockStreamListener: jest.fn()
    };

    const db = await DB.createAndInitializeDB(
      TEST_NETWORK_ID,
      settings.blockstreamDelay,
      uploadBlockNumbers[TEST_NETWORK_ID],
      trackedUsers,
      augur.genericEventNames,
      augur.userSpecificEvents,
      mock.makeFactory(),
      blockAndLogStreamerListener
    );
    await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);

    const syncableDBName = TEST_NETWORK_ID + "-DisputeCrowdsourcerCompleted";
    const metaDBName = TEST_NETWORK_ID + "-BlockNumbersSequenceIds";
    const universe = "0x11149d40d255fCeaC54A3ee3899807B0539bad60";

    const originalHighestSyncedBlockNumbers: any = {};
    originalHighestSyncedBlockNumbers[syncableDBName] = await db.syncStatus.getHighestSyncBlock(syncableDBName);
    originalHighestSyncedBlockNumbers[metaDBName] = await db.syncStatus.getHighestSyncBlock(metaDBName);

    const blockLogs = [
      {
        "universe": universe,
        "market": "0xC0ffe3F654d442589BAb472937F094970339d214",
        "disputeCrowdsourcer": "0x65d4f86927D1f10eFa2Fb884e4DEe0aB86137caD",
        "blockHash": "0x8132a0cdb4226b3bbb5bcf8429ec0883859255751be2c321c58b488395188040",
        "blockNumber": originalHighestSyncedBlockNumbers[syncableDBName] + 1,
        "transactionIndex": 8,
        "removed": false,
        "transactionHash": "0xf750ebb0d039c623385f8227f7a6cbe49f5efbc5485ac0e38b5a7b0e389726d8",
        "logIndex": 1
      }
    ];

    const dbInstance = db.getSyncableDatabase(syncableDBName);
    dbInstance.addNewBlock(originalHighestSyncedBlockNumbers[syncableDBName], blockLogs);

    let highestSyncedBlockNumber = await db.syncStatus.getHighestSyncBlock(syncableDBName);
    expect(highestSyncedBlockNumber).toBe(originalHighestSyncedBlockNumbers[syncableDBName] + 1);

    blockLogs[0].blockNumber = highestSyncedBlockNumber + 1;

    await dbInstance.addNewBlock(originalHighestSyncedBlockNumbers[syncableDBName] + 1, blockLogs);
    highestSyncedBlockNumber = await db.syncStatus.getHighestSyncBlock(syncableDBName);
    expect(highestSyncedBlockNumber).toBe(originalHighestSyncedBlockNumbers[syncableDBName] + 2);

    // Verify that 2 new blocks were added to SyncableDB
    let queryObj: any = {
      selector: { universe },
      fields: ["_id", "universe"],
      sort: ["_id"]
    };
    let result = await db.findInSyncableDB(syncableDBName, queryObj);
    // TODO Remove warning property from expected result once indexes are being used on SyncableDBs
    expect(result).toEqual(expect.objectContaining(
      {
        docs:
          [{
            _id: (originalHighestSyncedBlockNumbers[syncableDBName] + 1) + ".000000000000001",
            universe: universe
          },
            {
              _id: (originalHighestSyncedBlockNumbers[syncableDBName] + 2) + ".000000000000001",
              universe: universe
            }],
        warning:
          "no matching index found, create an index to optimize query time"
      }
    ));

    // TODO If derived DBs are used, verify MetaDB contents before & after rollback

    await db.rollback(highestSyncedBlockNumber - 1);

    // Verify that newest 2 blocks were removed from SyncableDB
    result = await db.findInSyncableDB(syncableDBName, queryObj);
    expect(result).toEqual(expect.objectContaining(
      {
        docs: [],
        warning:
          "no matching index found, create an index to optimize query time"
      }
    ));

    expect(await db.syncStatus.getHighestSyncBlock(syncableDBName)).toBe(originalHighestSyncedBlockNumbers[syncableDBName]);
    expect(await db.syncStatus.getHighestSyncBlock(syncableDBName)).toBe(originalHighestSyncedBlockNumbers[syncableDBName]);
    expect(await db.syncStatus.getHighestSyncBlock(metaDBName)).toBe(originalHighestSyncedBlockNumbers[metaDBName]);
  },
  30000
);
