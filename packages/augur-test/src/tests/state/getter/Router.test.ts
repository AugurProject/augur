import { API } from "@augurproject/sdk/build/state/getter/API";
import { Augur } from "@augurproject/sdk";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { Router } from "@augurproject/sdk/build/state/getter/Router";
import { makeTestAugur, makeDbMock } from "../../../libs";
import { ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";

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
}, 120000);

test("State API :: Bad parameters to getter", async () => {
  const api = new API(augur, db); // have to do this to initialize the routes
  const router = new Router(augur, db);

  let message = "";
  try {
    await router.route("getMarkets", { this: "that" });
  } catch (error) {
    message = error.message;
  }

  expect(message).toEqual("Invalid request object: Invalid value undefined supplied to : (({ universe: string } & PartialType<{ creator: string, search: string, reportingStates: Array<string>, disputeWindow: string, designatedReporter: string, maxFee: string, maxEndTime: number, maxLiquiditySpread: string, includeInvalidMarkets: boolean, categories: Array<string>, sortBy: (keyof [\"marketOI\",\"liquidity\",\"volume\",\"timestamp\",\"endTime\",\"lastTradedTimestamp\"]) }>) & PartialType<{ sortBy: string, isSortDescending: boolean, limit: number, offset: number }>)/universe: string");
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
