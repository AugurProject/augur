import { ACCOUNTS, compileAndDeployToGanache, makeDbMock, makeTestAugur } from "../../libs";
import { UserSyncableDB } from "@augurproject/state/src/db/UserSyncableDB";
import {Augur} from "@augurproject/api";
import { stringTo32ByteHex } from "@augurproject/core/source/libraries/HelperFunctions";
import { Contracts } from "@augurproject/api/src/api/Contracts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import {ethers} from "ethers";
import { ContractAddresses } from "@augurproject/artifacts";

const mock = makeDbMock();

let augur: Augur<ethers.utils.BigNumber>;
let addresses: ContractAddresses;
let dependencies: ContractDependenciesEthers;
beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  const result = await compileAndDeployToGanache(ACCOUNTS);
  addresses = result.addresses;
  dependencies = result.dependencies;
}, 120000);

let contracts: Contracts<ethers.utils.BigNumber>;
beforeEach(async () => {
  contracts = new Contracts(addresses, dependencies);
  mock.cancelFail();
  await mock.wipeDB();
});

// UserSyncableDB overrides protected getLogs class, which is only called in sync.
test.skip("sync", async () => {
  const dbController = await mock.makeDB(augur, ACCOUNTS);

  const eventName = "TokensTransferred";
  const sender = ACCOUNTS[0].publicKey;
  const highestAvailableBlockNumber = 0;
  const db = new UserSyncableDB<ethers.utils.BigNumber>(dbController, mock.constants.networkId, eventName, sender, 0, [0]);

  // Generate logs to be synced
  // TODO generate user-specific TokensTransferred
  const cash = contracts.cash;
  const universe = contracts.universe;
  const marketCreationCost = await universe.getOrCacheMarketCreationCost_();
  await cash.faucet(marketCreationCost, { sender });
  await cash.approve(addresses.Augur, marketCreationCost, { sender });
  const endTime = new ethers.utils.BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
  const fee = (new ethers.utils.BigNumber(10)).pow(new ethers.utils.BigNumber(16));
  const affiliateFeeDivisor = new ethers.utils.BigNumber(25);
  const outcomes: Array<string> = [stringTo32ByteHex("big"), stringTo32ByteHex("small")];
  const topic = stringTo32ByteHex("boba");
  const description = "Will big or small boba be the most popular in 2019?";
  const extraInfo = "";
  await universe.createCategoricalMarket(
    endTime,
    fee,
    affiliateFeeDivisor,
    ACCOUNTS[0].publicKey,
    outcomes,
    topic,
    description,
    extraInfo,
    { sender: ACCOUNTS[0].publicKey },
  );

  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay, highestAvailableBlockNumber);

  console.log(Object.keys(mock.getDatabases()));
  console.log(db.dbName);

  const tokensTransferredDB = mock.getDatabases()[`db/${db.dbName}`];
  const docs = await tokensTransferredDB.allDocs();
  console.log(docs);

  expect(docs).toBe(42);  // TODO
}, 180000);

// Constructor does some (private) processing, so verify that it works right.
test("props", async () => {
  const dbController = await mock.makeDB(augur, ACCOUNTS);

  const eventName = "foo";
  const user = "artistotle";
  const db = new UserSyncableDB<ethers.utils.BigNumber>(dbController, mock.constants.networkId, eventName, user, 2, [0]);

  // @ts-ignore - verify private property "additionalTopics"
  expect(db.additionalTopics).toEqual([
    "0x000000000000000000000000tistotle",
  ]);
});
