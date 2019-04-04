import {makeTestAugur, ACCOUNTS, makeDbMock} from "../../libs";
import {API} from "@augurproject/state/src/api/API";
import {DB} from "@augurproject/state/src/db/DB";
import {Augur} from "@augurproject/api";
import {ethers} from "ethers";

const mock = makeDbMock();

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB();
});

let augur: Augur<ethers.utils.BigNumber>;
let db: DB<ethers.utils.BigNumber>;
beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  db = await mock.makeDB(augur, ACCOUNTS);
}, 120000);

test("State API :: Markets", async () => {
  const api = new API<any>(augur, db);

  await expect(await api.markets.getMarkets({
    universe: augur.addresses.Universe,
  })).toEqual(undefined);
});

test("State API :: Users", async () => {
  const api = new API<ethers.utils.BigNumber>(augur, db);
  await expect(api.users).toEqual({});
});
