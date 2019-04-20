import { ethers } from "ethers";
import { Controller } from "@augurproject/state/src/Controller";
import { BlockAndLogStreamerListener } from "@augurproject/state/src/db/BlockAndLogStreamerListener";
import { EventLogDBRouter } from "@augurproject/state/src/db/EventLogDBRouter";
import { Augur } from "@augurproject/api";
import { contracts as compilerOutput } from "@augurproject/artifacts";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ACCOUNTS, deployContracts, makeDbMock } from "../../libs";
import { SyncableDB } from "@augurproject/state/build/db/SyncableDB";

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");

const mock = makeDbMock();

beforeEach(async () => {
  await mock.wipeDB();
});

let augur: Augur<ethers.utils.BigNumber>;
let ethersProvider: EthersProvider;
beforeAll(async () => {
  const {provider, dependencies, addresses} = await deployContracts(ACCOUNTS, compilerOutput);
  augur = await Augur.create(provider, dependencies, addresses);
  ethersProvider = provider;
}, 120000);

test("Flexible Search", async () => {
  const trackedUsers: Array<string> = [];
  const eventLogDBRouter = new EventLogDBRouter(augur.events.parseLogs);
  const listener = BlockAndLogStreamerListener.create(ethersProvider, eventLogDBRouter, augur.addresses.Augur, augur.events.getEventTopics);

  const controller = new Controller(
    augur,
    mock.constants.networkId,
    mock.constants.blockstreamDelay,
    mock.constants.defaultStartSyncBlockNumber,
    trackedUsers,
    mock.makeFactory(),
    listener,
  );

  await controller.run();  // populate dbs

  const dbMarketCreated = mock.getDatabases()[`db/${mock.constants.networkId}-MarketCreated`];
  await dbMarketCreated.put({
    _id: "robert",
    description: "Foobar has 12% market share by 2041",
    extraInfo: JSON.stringify({
      longDescription: "lol",
      tags: ["humanity", "30"],
    })});

  const flexSearch = FlexSearch.create({
    doc: {
      id: "id",
      start: "start",
      end: "end",
      field: [
        "title",
        "description",
        "tags",
      ],
    },
  });

  // Re-index flex search with new entry
  await mock.bulkSyncFullTextSearch(dbMarketCreated, flexSearch);

  let docs = SyncableDB.fullTextSearch(flexSearch, "Foobar");  // description/title
  expect(docs.length).toEqual(1);

  docs = SyncableDB.fullTextSearch(flexSearch, "humanity");  // tags
  expect(docs.length).toEqual(1);

  docs = SyncableDB.fullTextSearch(flexSearch, "lol");  // longDescription/description
  expect(docs.length).toEqual(1);

  const doc = docs[0];

  expect(doc).toMatchObject({
    id: "robert",
    title: "Foobar has 12% market share by 2041",
    description: "lol",
    tags: "humanity,30",
  });
  expect(doc).toHaveProperty("start");
  expect(doc).toHaveProperty("end");
});
