import { ethers } from "ethers";
import { Augur } from "@augurproject/api";
import { contracts as compilerOutput } from "@augurproject/artifacts";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ACCOUNTS, deployContracts, makeDbMock } from "../../libs";

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
  const db = await mock.makeDB(augur, ACCOUNTS);
  const syncableDBName = mock.constants.networkId + "-MarketCreated";

  const blockLogs = [
    {
      _id: "robert",
      blockNumber: 1,
      description: "Foobar has 12% market share by 2041",
      extraInfo: JSON.stringify({
        longDescription: "lol",
        tags: ["humanity", "30"],
      })
    }
  ];
  await db.addNewBlock(syncableDBName, blockLogs);
  await db.sync(augur, mock.constants.chunkSize, mock.constants.blockstreamDelay);

  const syncableDB = await db.getSyncableDatabase(syncableDBName);

  let docs = syncableDB.fullTextSearch("Foobar");  // description/title
  expect(docs.length).toEqual(1);

  docs = syncableDB.fullTextSearch("humanity");  // tags
  expect(docs.length).toEqual(1);

  docs = syncableDB.fullTextSearch("lol");  // longDescription/description
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
