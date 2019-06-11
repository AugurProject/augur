import {
  ACCOUNTS,
  makeDbMock,
  deployContracts,
  ContractAPI,
} from "../../libs";

import { API } from "@augurproject/sdk/build/state/getter/API";
import { BigNumber } from "bignumber.js";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Markets, SECONDS_IN_A_DAY } from "@augurproject/sdk/build/state/getter/Markets";
import { WebWorkerConnector } from "@augurproject/sdk/build/connector/ww-connector";
import { SubscriptionEventNames } from "@augurproject/sdk/build/constants";

let connector: WebWorkerConnector;
let provider: EthersProvider;
let john: ContractAPI;
let addresses: any;
let db: DB;
let api: API;

const mock = makeDbMock();

jest.mock("@augurproject/sdk/build/state/Sync.worker", () => {
  return {
    __esModule: true,
    default: () => ({
      onMessage: (event: MessageEvent) => { },
      terminate: () => { },
      postMessage: (message: any) => { },
    }),
  }
});


beforeAll(async () => {
  connector = new WebWorkerConnector();

  const contractData = await deployContracts(ACCOUNTS, compilerOutput);
  provider = contractData.provider;
  addresses = contractData.addresses;

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  db = await mock.makeDB(john.augur, ACCOUNTS);

  api = new API(john.augur, db);
  await john.approveCentralAuthority();
}, 120000);

test("WebWorkerConnector :: Should route correctly and handle events", async (done) => {
  const universe = john.augur.contracts.universe;
  const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
  const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
  const highFeePerCashInAttoCash = new BigNumber(10).pow(18).div(10); // 10% creator fee
  const affiliateFeeDivisor = new BigNumber(0);
  const designatedReporter = john.account;

  const yesNoMarket1 = await john.createYesNoMarket(
    universe,
    endTime,
    lowFeePerCashInAttoCash,
    affiliateFeeDivisor,
    designatedReporter,
    "yesNo topic 1",
    "{\"description\": \"yesNo description 1\", \"longDescription\": \"yesNo longDescription 1\", \"tags\": [\"yesNo tag1-1\", \"yesNo tag1-2\", \"yesNo tag1-3\"]}",
  );

  await connector.connect({ provider, db, augur: john.augur });

  connector.on(SubscriptionEventNames.NewBlock, async (...args: Array<any>): Promise<void> => {
    expect(args).toEqual([{
      highestAvailableBlockNumber: 88,
      lastSyncedBlockNumber: 88,
      blocksBehindCurrent: 0,
      percentBehindCurrent: "0.0000",
    }]);

    await db.sync(john.augur, mock.constants.chunkSize, 0);
    const getMarkets = connector.bindTo(Markets.getMarkets);
    const markets = await getMarkets({
      universe: john.augur.contracts.universe.address,
    });
    expect(markets).toEqual([yesNoMarket1.address]);

    connector.off(SubscriptionEventNames.NewBlock);
    connector.disconnect();
    done();
  });

  // process subscription
  connector.messageReceived({
    subscribed: SubscriptionEventNames.NewBlock,
    subscription: "12345",
  });

  // this should invoke the callback ... if not done won't be called
  connector.messageReceived({
    eventName: SubscriptionEventNames.NewBlock,
    result: [{
      highestAvailableBlockNumber: 88,
      lastSyncedBlockNumber: 88,
      blocksBehindCurrent: 0,
      percentBehindCurrent: "0.0000",
    }],
  });
}, 15000);
