import { API } from "@augurproject/sdk/build/state/api/API";
import { Augur } from "@augurproject/sdk";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { Router } from "@augurproject/sdk/build/state/api/Router";
import { ethers } from "ethers";
import { makeTestAugur, ACCOUNTS, makeDbMock } from "../../../libs";

const mock = makeDbMock();

beforeEach(async () => {
  await mock.wipeDB();
});

let augur: Augur;
let db: DB;

beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  db = await mock.makeDB(augur, ACCOUNTS);
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

  expect(message).toEqual("Invalid request object: Invalid value undefined supplied to : (({ universe: string } & PartialType<{ creator: string, category: string, search: string, reportingState: (string | Array<string>), disputeWindow: string, designatedReporter: string, maxFee: string, hasOrders: boolean }>) & PartialType<{ sortBy: string, isSortDescending: boolean, limit: number, offset: number }>)/universe: string");
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
