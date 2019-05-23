import {
  ACCOUNTS,
  deployContracts,
  makeDbMock,
  makeTestAugur
} from "../../libs";
import { UserSyncableDB } from "@augurproject/sdk/build/state/db/UserSyncableDB";
import {Augur} from "@augurproject/sdk";
import { stringTo32ByteHex } from "@augurproject/core/build/libraries/HelperFunctions";
import { Contracts } from "@augurproject/sdk/build/api/Contracts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { BigNumber } from "bignumber.js";
import { ContractAddresses, Contracts as compilerOutput } from "@augurproject/artifacts";

const mock = makeDbMock();

let augur: Augur;
let addresses: ContractAddresses;
let dependencies: ContractDependenciesEthers;
let contracts: Contracts;

beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  const result = await deployContracts(ACCOUNTS, compilerOutput);
  addresses = result.addresses;
  dependencies = result.dependencies;
  contracts = new Contracts(addresses, dependencies);
}, 180000);

beforeEach(async () => {
  await mock.wipeDB();
});

// UserSyncableDB overrides protected getLogs class, which is only called in sync.
test.skip("sync", async () => {
  const dbController = await mock.makeDB(augur, ACCOUNTS);

  const eventName = "TokensTransferred";
  const sender = ACCOUNTS[0].publicKey;
  const highestAvailableBlockNumber = 0;
  const db = new UserSyncableDB(dbController, mock.constants.networkId, eventName, sender, 0, [0]);

  // Generate logs to be synced
  // TODO generate user-specific TokensTransferred
  const cash = contracts.cash;
  const universe = contracts.universe;
  const marketCreationCost = await universe.getOrCacheMarketCreationCost_();
  await cash.faucet(marketCreationCost, { sender });
  await cash.approve(addresses.Augur, marketCreationCost, { sender });
  const endTime = new BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
  const fee = (new BigNumber(10)).pow(16);
  const affiliateFeeDivisor = new BigNumber(25);
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
  const db = new UserSyncableDB(dbController, mock.constants.networkId, eventName, user, 2, [0]);

  // @ts-ignore - verify private property "additionalTopics"
  expect(db.additionalTopics).toEqual([[
    "0x000000000000000000000000tistotle",
  ]]);
});
