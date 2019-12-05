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

test('database failure during sync, followed by another sync', async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);

  console.log('Sync with a database failure.');
  const originalSync = db.sync;
  db.sync = async function () {
    throw Error("This was an intentional");
  };

  await expect(
    db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay)
  ).rejects.toThrow();

  db.sync = originalSync;

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
  const originalSync = db.sync;
  db.sync = async function () {
    throw Error("This was an intentional");
  };

  await expect(
    db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay)
  ).rejects.toThrow();

  db.sync = originalSync;

  console.log('Sync successfully.');
  await db.sync(
    augur,
    mock.constants.chunkSize,
    mock.constants.blockstreamDelay
  );
});
