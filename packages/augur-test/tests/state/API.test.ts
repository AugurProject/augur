import {uploadBlockNumbers} from "@augurproject/artifacts";
import {makeTestAugur, ACCOUNTS} from "../../libs/LocalAugur";
import {API} from "@augurproject/state/src/api/API";
import {makeDbMock} from "../../libs/MakeDbMock";
import {Augur} from "@augurproject/api";

const mock = makeDbMock();

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB();
});

let augur: Augur<any>;
let db: any;
beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  db = await mock.makeDB(augur, ACCOUNTS);
}, 60000);

test("State API :: Markets", async () => {
  const api = new API<any>(augur, db);

  await expect(await api.markets.getMarkets({
    universe: augur.addresses.Universe,
  })).toEqual(undefined);
});

test("State API :: Users", async () => {
  const api = new API<any>(augur, db);
  await expect(api.users).toEqual({});
});
