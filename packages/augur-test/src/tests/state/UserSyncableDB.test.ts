import { ACCOUNTS, ContractAPI, deployContracts, makeDbMock } from "../../libs";
import { UserSyncableDB } from "@augurproject/sdk/build/state/db/UserSyncableDB";
import { stringTo32ByteHex } from "@augurproject/core/build/libraries/HelperFunctions";
import { BigNumber } from "bignumber.js";
import { formatBytes32String } from "ethers/utils";

const mock = makeDbMock();

let john: ContractAPI;

beforeAll(async () => {
  const { provider, addresses } = await deployContracts(ACCOUNTS, undefined);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  await john.approveCentralAuthority();
});

beforeEach(async () => {
  await mock.wipeDB();
});

// UserSyncableDB overrides protected getLogs class, which is only called in sync.
test("UserSynableDB.sync", async () => {
  const augur = john.augur;
  const universe = augur.contracts.universe;
  const dbController = await mock.makeDB(john.augur, ACCOUNTS);

  const sender = ACCOUNTS[0].publicKey;
  const highestAvailableBlockNumber = 10000;

  // Generate logs to be synced.
  // Creates TokensTransferred event for REP as part of market creation.
  // Example:
  //   { name: 'TokensTransferred',
  //     parameters:
  //      { universe: '0x4112a78f07D155884b239A29e378D1f853Edd128',
  //        from: '0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE',
  //        to: '0xaA2e22968CB6660De7AC605043EAB08a54e8Bcb4',
  //        token: '0x1e1BE50CA620E26891029fe54C9A93A9e5042378',
  //        value: [BigNumber],
  //        tokenType: 0,
  //        market: '0x0000000000000000000000000000000000000000' } },
  await john.createCategoricalMarket({
    endTime: new BigNumber(Math.round(new Date().getTime() / 1000) + 30 * 24 * 60 * 60),
    feePerCashInAttoCash: (new BigNumber(10)).pow(16),
    affiliateFeeDivisor: new BigNumber(25),
    designatedReporter: sender,
    outcomes: [stringTo32ByteHex("big"), stringTo32ByteHex("small")],
    topic: "boba",
    extraInfo: JSON.stringify({ description: "Will big or small boba be the most popular in 2019?" }),
  });

  const tokensTransferredEventDefinition = john.augur.userSpecificEvents.find((x) => x.name === "TokensTransferred");
  if (!tokensTransferredEventDefinition) {
    throw Error("Definition of UserSpecifiedEvents has changed such that TokensTransferred does not exist.");
  }

  const db = new UserSyncableDB(
    john.augur,
    dbController,
    mock.constants.networkId,
    tokensTransferredEventDefinition.name,
    sender,
    tokensTransferredEventDefinition.numAdditionalTopics,
    tokensTransferredEventDefinition.userTopicIndicies,
  );
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay, highestAvailableBlockNumber);

  const tokensTransferredDB = mock.getDatabases()[`db/${db.dbName}`];
  const docs = await tokensTransferredDB.allDocs();

  expect(docs.total_rows).toEqual(2);

  const doc = docs.rows[0]; // TokensTransferred event created when paying for market creation
  const tokenTransfer = await tokensTransferredDB.get(doc.id);

  let marketRepBond = (new BigNumber(await universe.getOrCacheMarketRepBond_())).toString(16);
  marketRepBond = "0x" + marketRepBond.padStart(16, "0");

  expect(tokenTransfer).toEqual({
    universe: universe.address,
    // This is a transfer of REP tokens.
    token: augur.contracts.getReputationToken().address,
    from: sender,
    // Since this is from market creation: REP is sent to the MarketFactory, which then passes it along to the market.
    to: await augur.contracts.augur.registry_(formatBytes32String("MarketFactory")),
    value: marketRepBond,
    tokenType: 0,
    market: "0x0000000000000000000000000000000000000000",
    blockNumber: expect.any(Number),
    blockHash: expect.stringMatching(new RegExp("0x[0-f]{64}")),
    transactionIndex: expect.any(Number),
    removed: false,
    transactionLogIndex: expect.any(Number),
    transactionHash: expect.stringMatching(new RegExp("0x[0-f]{64}")),
    logIndex: expect.any(Number),
    topics: [
      expect.stringMatching(new RegExp("0x[0-f]{64}")),
      expect.stringMatching(new RegExp("0x[0-f]{64}")),
      expect.stringMatching(new RegExp("0x[0-f]{64}")),
      expect.stringMatching(new RegExp("0x[0-f]{64}")),
    ],
    _id: doc.id,
    _rev: doc.value.rev,
  });
}, 30000);

// Constructor does some (private) processing, so verify that it works right.
test("props", async () => {
  const dbController = await mock.makeDB(john.augur, ACCOUNTS);

  const eventName = "foo";
  const user = "artistotle";
  const db = new UserSyncableDB(john.augur, dbController, mock.constants.networkId, eventName, user, 2, [0]);

  // @ts-ignore - verify private property "additionalTopics"
  expect(db.additionalTopics).toEqual([[
    "0x000000000000000000000000tistotle",
  ]]);
});
