import { TrackedUsers } from "@augurproject/sdk/build/state/db/TrackedUsers";
import { Augur } from "@augurproject/sdk";
import { makeTestAugur, ACCOUNTS, makeDbMock } from "../../libs";
import { ethers } from "ethers";

const mock = makeDbMock();

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB();
});

let augur: Augur;
beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
}, 120000);

test("database failure during trackedUsers.getUsers() call", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  const trackedUsers = new TrackedUsers(mock.constants.networkId, mock.makeFactory());

  expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
    ok: true,
    id: "mock",
    rev: expect.any(String),
  });
  mock.failNext();
  await expect(trackedUsers.getUsers()).rejects.toThrow();
});

test("database failure during sync, followed by another sync", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);

  console.log("Sync with a database failure.");
  mock.failForever();
  await expect(db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay)).rejects.toThrow();
  mock.cancelFail();

  console.log("Sync successfully.");
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);
});

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
});
