import {Controller} from "@augurproject/state/src/Controller";
import { BlockAndLogStreamerListener } from "@augurproject/state/src/db/BlockAndLogStreamerListener";
import { EventLogDBRouter } from "@augurproject/state/src/db/EventLogDBRouter";
import {Augur} from "@augurproject/api";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import {makeDbMock} from "../../libs/MakeDbMock";
import { ACCOUNTS, compileAndDeployToGanache } from "../../libs/LocalAugur";

const mock = makeDbMock();

beforeEach(async () => {
  mock.cancelFail();
  await mock.wipeDB();
});

let augur: Augur<any>;
let ethersProvider: EthersProvider;
beforeAll(async () => {
  const {provider, dependencies, addresses} = await compileAndDeployToGanache(ACCOUNTS);
  augur = await Augur.create(provider, dependencies, addresses);
  ethersProvider = provider;
}, 60000);

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

  await controller.run();  // re-index flex search with new entry

  let docs = controller.FTS.search("Foobar");  // description/title
  expect(docs.length).toEqual(1);

  docs = controller.FTS.search("humanity");  // tags
  expect(docs.length).toEqual(1);

  docs = controller.FTS.search("lol");  // longDescription/description
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
