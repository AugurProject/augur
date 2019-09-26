import { TrackedUsers } from '@augurproject/sdk/build/state/db/TrackedUsers';
import { Augur } from '@augurproject/sdk';
import { makeTestAugur, makeDbMock } from '../../libs';
import { ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";

let mock = null;

beforeEach(async () => {
  mock = makeDbMock();
});

let augur: Augur;
beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  augur = await makeTestAugur(seed, ACCOUNTS);
});

test('database failure during trackedUsers.getUsers() call', async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);
  await db.sync(
    augur,
    mock.constants.chunkSize,
    mock.constants.blockstreamDelay
  );

  const trackedUsers = new TrackedUsers(
    mock.constants.networkId,
    mock.makeFactory()
  );

  let err: Error;
  try {
    await trackedUsers.setUserTracked("mock");
  } catch (e) {
    err = e;
  }
  await expect(err.message).toMatch(/^invalid address/);
  mock.failNext();
    await expect(trackedUsers.getUsers()).rejects.toThrow();
});

test('database failure during sync, followed by another sync', async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);

  console.log('Sync with a database failure.');
  mock.failForever();
  await expect(
    db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay)
  ).rejects.toThrow();
  mock.cancelFail();

  console.log('Sync successfully.');
  await db.sync(
    augur,
    mock.constants.chunkSize,
    mock.constants.blockstreamDelay
  );
});

test('syncing: succeed then fail then succeed again', async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);

  console.log('Sync successfully.');
  await db.sync(
    augur,
    mock.constants.chunkSize,
    mock.constants.blockstreamDelay
  );

  console.log('Sync with a database failure.');
  mock.failForever();
  await expect(
    db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay)
  ).rejects.toThrow();
  mock.cancelFail();

  console.log('Sync successfully.');
  await db.sync(
    augur,
    mock.constants.chunkSize,
    mock.constants.blockstreamDelay
  );
});
