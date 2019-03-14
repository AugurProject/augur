import {TrackedUsers} from "./TrackedUsers";
import {DB} from "./DB";
import {ContractDependenciesEthers} from "contract-dependencies-ethers";
import {Augur} from "@augurproject/api";
import {uploadBlockNumbers} from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import {makeMock} from "../utils/MakeMock";
import {JsonRpcProvider} from "ethers/providers/json-rpc-provider";
import {EthersProvider} from "ethers-provider";

const mock = makeMock();
const TEST_NETWORK_ID = 4;
const defaultStartSyncBlockNumber = uploadBlockNumbers[TEST_NETWORK_ID];
const ethersProvider = new EthersProvider(new JsonRpcProvider(settings.ethNodeURLs[4]), 5, 0, 40);
const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB()
});

let augur: Augur<any>;
beforeAll(async () => {
  augur = await Augur.create(ethersProvider, contractDependencies);
});


test("database failure during trackedUsers.getUsers() call", async () => {
  const db = await DB.createAndInitializeDB(
    TEST_NETWORK_ID,
    settings.blockstreamDelay,
    defaultStartSyncBlockNumber,
    [settings.testAccounts[0]],
    augur.genericEventNames,
    augur.userSpecificEvents,
    mock.makeFactory()
  );

  await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);

  const trackedUsers = new TrackedUsers(TEST_NETWORK_ID, mock.makeFactory());

  expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
    ok: true,
    id: "mock",
    rev: expect.any(String)
  });
  mock.failNext();
  await expect(trackedUsers.getUsers()).rejects.toThrow();
}, 60000);


test("database failure during sync, followed by another sync", async () => {
    const db = await DB.createAndInitializeDB(
      TEST_NETWORK_ID,
      settings.blockstreamDelay,
      defaultStartSyncBlockNumber,
      [settings.testAccounts[0]],
      augur.genericEventNames,
      augur.userSpecificEvents,
      mock.makeFactory()
    );

    console.log("Sync with a database failure.");
    mock.failForever();
    await expect(db.sync(augur, settings.chunkSize, settings.blockstreamDelay)).rejects.toThrow();
    mock.cancelFail();

    console.log("Sync successfully.");
    await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);
  },
  120000
);


test("syncing: succeed then fail then succeed again", async () => {
    const db = await DB.createAndInitializeDB(
      TEST_NETWORK_ID,
      settings.blockstreamDelay,
      defaultStartSyncBlockNumber,
      [settings.testAccounts[0]],
      augur.genericEventNames,
      augur.userSpecificEvents,
      mock.makeFactory()
    );

    console.log("Sync successfully.");
    await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);

    console.log("Sync with a database failure.");
    mock.failForever();
    await expect(db.sync(augur, settings.chunkSize, settings.blockstreamDelay)).rejects.toThrow();
    mock.cancelFail();

    console.log("Sync successfully.");
    await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);
  },
  120000
);
