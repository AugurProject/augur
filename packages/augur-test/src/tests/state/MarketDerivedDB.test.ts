import { Augur } from "@augurproject/sdk";
import { ACCOUNTS } from "@augurproject/tools";
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
  augur = await makeTestAugur(ACCOUNTS);
}, 120000);

test("Flexible Search", async () => {
  const db = await mock.makeDB(augur, ACCOUNTS);
  const DBName = mock.constants.networkId + "-MarketCreated";

  const blockLogs = [
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
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  let docs = db.fullTextMarketSearch("0x1111111111111111111111111111111111111111");  // market
  expect(docs.length).toEqual(1);

  docs = db.fullTextMarketSearch("share");  // topic
  expect(docs.length).toEqual(1);

  docs = db.fullTextMarketSearch("Foobar");  // description/title
  expect(docs.length).toEqual(1);

  docs = db.fullTextMarketSearch("lol");  // longDescription/description
  expect(docs.length).toEqual(1);

  docs = db.fullTextMarketSearch("blah");  // resolutionSource
  expect(docs.length).toEqual(1);

  docs = db.fullTextMarketSearch("fake");  // _scalarDenomination
  expect(docs.length).toEqual(1);

  docs = db.fullTextMarketSearch("humanity");  // tags
  expect(docs.length).toEqual(1);

  const doc = docs[0];

  expect(doc).toMatchObject({
    id: "0x1111111111111111111111111111111111111111",
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
