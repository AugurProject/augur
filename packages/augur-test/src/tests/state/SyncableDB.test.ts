import { ethers } from "ethers";
import { Augur } from "@augurproject/sdk";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ACCOUNTS, deployContracts, makeDbMock } from "../../libs";
import { stringTo32ByteHex } from "../../libs/Utils";
import { toAscii } from "@augurproject/sdk/build/state/utils/utils";

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");

const mock = makeDbMock();

beforeEach(async () => {
  await mock.wipeDB();
});

let augur: Augur;
let ethersProvider: EthersProvider;
beforeAll(async () => {
  const {provider, dependencies, addresses} = await deployContracts(ACCOUNTS, compilerOutput);
  augur = await Augur.create(provider, dependencies, addresses);
  ethersProvider = provider;
}, 120000);

test("Flexible Search", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);
  const syncableDBName = mock.constants.networkId + "-MarketCreated";

  const blockLogs = [
    {
      _id: "robert",
      blockNumber: 1,
      market: "0x1111111111111111111111111111111111111111",
      topic: stringTo32ByteHex("Market share"),
      extraInfo: JSON.stringify({
        description: "Foobar has 12% market share by 2041",
        longDescription: "lol",
        resolutionSource: "http://www.blah.com",
        _scalarDenomination: "fake scalar denomination",
        tags: ["humanity", "30"],
      })
    }
  ];
  await db.addNewBlock(syncableDBName, blockLogs);
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  const syncableDB = await db.getSyncableDatabase(syncableDBName);

  let docs = syncableDB.fullTextSearch("0x1111111111111111111111111111111111111111");  // market
  expect(docs.length).toEqual(1);

  docs = syncableDB.fullTextSearch("share");  // topic
  expect(docs.length).toEqual(1);

  docs = syncableDB.fullTextSearch("Foobar");  // description/title
  expect(docs.length).toEqual(1);

  docs = syncableDB.fullTextSearch("lol");  // longDescription/description
  expect(docs.length).toEqual(1);

  docs = syncableDB.fullTextSearch("blah");  // resolutionSource
  expect(docs.length).toEqual(1);

  docs = syncableDB.fullTextSearch("fake");  // _scalarDenomination
  expect(docs.length).toEqual(1);

  docs = syncableDB.fullTextSearch("humanity");  // tags
  expect(docs.length).toEqual(1);

  const doc = docs[0];

  expect(doc).toMatchObject({
    id: "robert",
    market: "0x1111111111111111111111111111111111111111",
    topic: toAscii(stringTo32ByteHex("Market share")),
    description: "Foobar has 12% market share by 2041",
    longDescription: "lol",
    resolutionSource: "http://www.blah.com",
    _scalarDenomination: "fake scalar denomination",
    tags: "humanity,30",
  });

  expect(doc).toHaveProperty("start");
  expect(doc).toHaveProperty("end");
});
