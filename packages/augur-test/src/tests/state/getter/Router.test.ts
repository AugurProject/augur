import { Augur } from '@augurproject/sdk';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { Router } from '@augurproject/sdk/build/state/getter/Router';
import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import { makeDbMock, makeTestAugur } from '../../../libs';

const mock = makeDbMock();

beforeEach(async () => {
  await mock.wipeDB();
});

let augur: Augur;
let db: Promise<DB>;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  augur = await makeTestAugur(seed, ACCOUNTS);
  db = mock.makeDB(augur, ACCOUNTS);
});

test("State API :: Bad parameters to getter", async () => {
  const api = new API(augur, db); // have to do this to initialize the routes
  const router = new Router(augur, db);

  let message = "";
  try {
    await router.route("getMarkets", { this: "that" });
  } catch (error) {
    message = error.message;
  }

  expect(message.startsWith("Invalid request object: Invalid value undefined supplied")).toBe(true);
});

test("State API :: Nonexistant getter", async () => {
  const api = new API(augur, db); // have to do this to initialize the routes
  const router = new Router(augur, db);

  let message = "";
  try {
    await router.route("fooBar", { this: "that" });
  } catch (error) {
    message = error.message;
  }

  expect(message).toEqual("Invalid request fooBar");
});
