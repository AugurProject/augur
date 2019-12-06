import { makeDbMock, makeProvider } from "../../libs";
import { ContractAPI, loadSeedFile, ACCOUNTS, defaultSeedPath } from "@augurproject/tools";
import { API } from '@augurproject/sdk/build/state/getter/API';
import { BigNumber } from 'bignumber.js';
import { ContractAddresses } from '@augurproject/artifacts';
import { Controller } from '@augurproject/sdk/build/state/Controller';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { BlockAndLogStreamerListener } from '@augurproject/sdk/build/state/db/BlockAndLogStreamerListener';
import {
  Markets,
} from '@augurproject/sdk/build/state/getter/Markets';
import { SEOConnector } from '@augurproject/sdk/build/connector/seo-connector';
import { SubscriptionEventName } from '@augurproject/sdk/build/constants';
import { NewBlock } from '@augurproject/sdk/build/events';
import { MarketCreated } from "@augurproject/sdk/build/events";
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';

let connector: SEOConnector;
let provider: EthersProvider;
let john: ContractAPI;
let addresses: ContractAddresses;
let db: Promise<DB>;

const mock = makeDbMock();

jest.mock('@augurproject/sdk/build/state/create-api', () => {
  return {
    __esModule: true,
    buildAPI: () => {
      return new API(john.augur, db);
    },
    create: () => {
      const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(
        provider,
        john.augur.events.getEventTopics,
        john.augur.events.parseLogs,
        john.augur.events.getEventContractAddress,
      );
      const api = new API(john.augur, db);
      const controller = new Controller(
        john.augur,
        db,
        blockAndLogStreamerListener
      );

      return { api, controller };
    },
  };
});

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  provider = await makeProvider(seed, ACCOUNTS);
  addresses = seed.addresses;

  john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses);
  db = mock.makeDB(john.augur, ACCOUNTS);

  await john.approveCentralAuthority();

  connector = new SEOConnector();
  console.log("Connector connecting");
  await connector.connect('');
});

test('SEOConnector :: Should route correctly and handle events, extraInfo', async done => {
  const yesNoMarket1 = await john.createYesNoMarket({
    endTime: (await john.getTimestamp()).plus(SECONDS_IN_A_DAY),
    feePerCashInAttoCash: new BigNumber(10).pow(18).div(20), // 5% creator fee
    affiliateFeeDivisor: new BigNumber(0),
    designatedReporter: john.account.publicKey,
    extraInfo:
      '{"categories": ["yesNo category 1", "yesNo category 2"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1"}',
  });

  connector.on(
    SubscriptionEventName.MarketCreated,
    async (arg: MarketCreated): Promise<void> => {
      expect(arg).toHaveProperty(
        'extraInfo',
        '{"categories": ["yesNo category 1", "yesNo category 2"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1"}'
      );

      const getMarkets = connector.bindTo(Markets.getMarkets);
      const marketList = await getMarkets({
        universe: john.augur.contracts.universe.address,
      });
      expect(marketList.markets[0].id).toEqual(yesNoMarket1.address);

      await connector.off(SubscriptionEventName.MarketCreated);
      expect(connector.subscriptions).toEqual({});
      done();
    }
  );

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);
});
