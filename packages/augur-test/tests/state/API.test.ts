import {uploadBlockNumbers} from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import {makeTestAugur, ACCOUNTS} from "../../libs/LocalAugur";
import {API} from "@augurproject/state/src/api/API";
import {DB} from "@augurproject/state/src/db/DB";
import {makeDbMock} from "../../libs/MakeDbMock";
import {Augur} from "@augurproject/api";

const mock = makeDbMock();
const TEST_NETWORK_ID = 4;
const defaultStartSyncBlockNumber = uploadBlockNumbers[TEST_NETWORK_ID];

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB();
});

let augur: Augur<any>;
let db: DB<any>;
beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  db = await DB.createAndInitializeDB(
    TEST_NETWORK_ID,
    settings.blockstreamDelay,
    defaultStartSyncBlockNumber,
    [settings.testAccounts[0]],
    augur.genericEventNames,
    augur.userSpecificEvents,
    mock.makeFactory(),
  );
}, 60000);

test("API :: Markets", async () => {
  const api = new API<any>(augur, db);

  await expect(await api.markets.getMarkets({
    universe: augur.addresses.Universe,
  })).toEqual(undefined);
});

test("API :: Users", async () => {
  const api = new API<any>(augur, db);
  await expect(api.users).toEqual({});
},);
