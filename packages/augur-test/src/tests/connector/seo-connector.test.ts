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
import { SEOConnector } from "@augurproject/sdk/build/connector/seo-connector";
import { SubscriptionEventNames } from "@augurproject/sdk/build//constants";

let connector: SEOConnector;
let provider: EthersProvider;
let john: ContractAPI;
let addresses: any;
let db: DB;
let api: API;

const mock = makeDbMock();

beforeAll(async () => {
  connector = new SEOConnector();

  const contractData = await deployContracts(ACCOUNTS, compilerOutput);
  provider = contractData.provider;
  addresses = contractData.addresses;

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  db = await mock.makeDB(john.augur, ACCOUNTS);

  api = new API(john.augur, db);
  await john.approveCentralAuthority();
}, 120000);

test("SEOConnector :: Should route correctly and handle events", async (done) => {
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

  await connector.on(SubscriptionEventNames.NewBlock, async (...args: Array<any>): Promise<void> => {
    expect(args).toEqual([{
      highestAvailableBlockNumber: 88,
      lastSyncedBlockNumber: 88,
      blocksBehindCurrent: 0,
      percentBehindCurrent: "0.0000",
    }]);

    const getMarkets = connector.bindTo(Markets.getMarkets);
    const markets = await getMarkets({
      universe: john.augur.contracts.universe.address,
    });
    expect(markets).toEqual([yesNoMarket1.address]);

    await connector.off(SubscriptionEventNames.NewBlock);
    expect(connector.subscriptions).toEqual({});
    done();
  });

  await db.sync(john.augur, mock.constants.chunkSize, 0);
}, 15000);
