import { Augur } from "@augurproject/sdk";
import { ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { makeDbMock, makeTestAugur } from "../../libs";
import { stringTo32ByteHex } from "../../libs/Utils";
import { toAscii } from "@augurproject/sdk/build/state/utils/utils";

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");

const mock = makeDbMock();

beforeEach(async () => {
  await mock.wipeDB();
});

let augur: Augur;
beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  augur = await makeTestAugur(seed, ACCOUNTS);
}, 120000);

test("Doc merge update", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);
  let DBName = mock.constants.networkId + "-MarketCreated";

  let blockLogs = [
    {
      _id: "0x1111111111111111111111111111111111111111",
      blockNumber: 1,
      market: "0x1111111111111111111111111111111111111111",
      topic: stringTo32ByteHex("Market share"),
      extraInfo: JSON.stringify({
        description: "Foobar has 12% market share by 2041",
        longDescription: "lol",
        resolutionSource: "http://www.blah.com",
        _scalarDenomination: "fake scalar denomination",
        tags: ["humanity", "30"],
      }),
    },
  ];
  await db.addNewBlock(DBName, blockLogs);

  DBName = mock.constants.networkId + "-MarketOIChanged";
  const OIBlockLogs = [
    {
      _id: "0x1111111111111111111111111111111111111111",
      blockNumber: 2,
      market: "0x1111111111111111111111111111111111111111",
      marketOI: "0x2",
    },
  ];
  await db.addNewBlock(DBName, OIBlockLogs);

  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  const marketsDB = await db.getDerivedDatabase(mock.constants.networkId + "-Markets");
  const docs = await marketsDB.allDocs();
  expect(docs.total_rows).toEqual(2);
  const doc = docs.rows[0];
  expect(doc.id).toEqual("0x1111111111111111111111111111111111111111");
  const values = doc.doc;
  expect(values["marketOI"]).toEqual("0x2");
});

test("Flexible Search", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);
  const DBName = mock.constants.networkId + "-MarketCreated";

  const blockLogs = [
    {
      _id: "0x1111111111111111111111111111111111111111",
      blockNumber: 1,
      market: "0x1111111111111111111111111111111111111111",
      extraInfo: JSON.stringify({
        categories: ["Market share"],
        description: "Foobar has 12% market share by 2041",
        longDescription: "lol",
        resolutionSource: "http://www.blah.com",
        _scalarDenomination: "fake scalar denomination",
        tags: ["humanity", "30"],
      }),
    },
  ];
  await db.addNewBlock(DBName, blockLogs);
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  let docs = await db.fullTextMarketSearch("0x1111111111111111111111111111111111111111", null);  // market
  expect(docs.length).toEqual(1);

  docs = await db.fullTextMarketSearch("share", null);  // category
  expect(docs.length).toEqual(1);

  docs = await db.fullTextMarketSearch("Foobar", null);  // description/title
  expect(docs.length).toEqual(1);

  docs = await db.fullTextMarketSearch("lol", null);  // longDescription/description
  expect(docs.length).toEqual(1);

  docs = await db.fullTextMarketSearch("blah", null);  // resolutionSource
  expect(docs.length).toEqual(1);

  docs = await db.fullTextMarketSearch("fake", null);  // _scalarDenomination
  expect(docs.length).toEqual(1);

  docs = await db.fullTextMarketSearch("humanity", null);  // tags
  expect(docs.length).toEqual(1);

  const doc = docs[0];

  expect(doc).toMatchObject({
    id: "0x1111111111111111111111111111111111111111",
    market: "0x1111111111111111111111111111111111111111",
    category1: "Market share",
    description: "Foobar has 12% market share by 2041",
    longDescription: "lol",
    resolutionSource: "http://www.blah.com",
    _scalarDenomination: "fake scalar denomination",
    tags: "humanity,30",
  });

  expect(doc).toHaveProperty("start");
  expect(doc).toHaveProperty("end");
});
