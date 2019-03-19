import {TrackedUsers} from "@augurproject/state/src/db/TrackedUsers";
import {DB} from "@augurproject/state/src/db/DB";
import {Augur} from "@augurproject/api";
import {uploadBlockNumbers} from "@augurproject/artifacts";
import {makeDbMock} from "../../libs/MakeDbMock";
import {makeTestAugur, ACCOUNTS} from "../../libs/LocalAugur";

const mock = makeDbMock();
const TEST_NETWORK_ID = 4;
const defaultStartSyncBlockNumber = uploadBlockNumbers[TEST_NETWORK_ID];

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB();
});

let augur: Augur<any>;
beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
}, 60000);

test("database failure during trackedUsers.getUsers() call", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  const trackedUsers = new TrackedUsers(TEST_NETWORK_ID, mock.makeFactory());

  expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
    ok: true,
    id: "mock",
    rev: expect.any(String),
  });
  mock.failNext();
  await expect(trackedUsers.getUsers()).rejects.toThrow();
}, 60000);

test("database failure during sync, followed by another sync", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);

  console.log("Sync with a database failure.");
  mock.failForever();
  await expect(db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay)).rejects.toThrow();
  mock.cancelFail();

  console.log("Sync successfully.");
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);
}, 120000);

test("syncing: succeed then fail then succeed again", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);

  console.log("Sync successfully.");
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  console.log("Sync with a database failure.");
  mock.failForever();
  await expect(db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay)).rejects.toThrow();
  mock.cancelFail();

  console.log("Sync successfully.");
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);
}, 120000);
