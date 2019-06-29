import { ACCOUNTS, makeDbMock, deployContracts, ContractAPI } from '../../libs';

import { API } from '@augurproject/sdk/build/state/getter/API';
import { BigNumber } from 'bignumber.js';
import { ContractAddresses } from '@augurproject/artifacts';
import { Controller } from '@augurproject/sdk/build/state/Controller';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { EventLogDBRouter } from '@augurproject/sdk/build/state/db/EventLogDBRouter';
import { BlockAndLogStreamerListener } from '@augurproject/sdk/build/state/db/BlockAndLogStreamerListener';
import {
  Markets,
  SECONDS_IN_A_DAY,
} from '@augurproject/sdk/build/state/getter/Markets';
import { SEOConnector } from '@augurproject/sdk/build/connector/seo-connector';
import { SubscriptionEventNames } from '@augurproject/sdk/build/constants';
import { MarketCreated } from "@augurproject/sdk/build/events";

let connector: SEOConnector;
let provider: EthersProvider;
let john: ContractAPI;
let addresses: ContractAddresses;
let db: Promise<DB>;

const mock = makeDbMock();

jest.mock('@augurproject/sdk/build/state/index', () => {
  return {
    __esModule: true,
    buildAPI: () => {
      return new API(john.augur, db);
    },
    create: () => {
      const eventLogDBRouter = new EventLogDBRouter(
        john.augur.events.parseLogs
      );
      const blockAndLogStreamerListener = BlockAndLogStreamerListener.create(
        provider,
        eventLogDBRouter,
        addresses.Augur,
        john.augur.events.getEventTopics
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
  connector = new SEOConnector();

  const contractData = await deployContracts(ACCOUNTS, null);
  provider = contractData.provider;
  addresses = contractData.addresses;

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  db = mock.makeDB(john.augur, ACCOUNTS);

  await john.approveCentralAuthority();
}, 120000);

test('SEOConnector :: Should route correctly and handle events', async done => {
  const yesNoMarket1 = await john.createYesNoMarket({
    endTime: (await john.getTimestamp()).plus(SECONDS_IN_A_DAY),
    feePerCashInAttoCash: new BigNumber(10).pow(18).div(20), // 5% creator fee
    affiliateFeeDivisor: new BigNumber(0),
    designatedReporter: john.account,
    topic: 'yesNo topic 1',
    extraInfo:
      '{"description": "yesNo description 1", "longDescription": "yesNo longDescription 1", "tags": ["yesNo tag1-1", "yesNo tag1-2", "yesNo tag1-3"]}',
  });

  await connector.connect('');

  await connector.on(
    SubscriptionEventNames.MarketCreated,
    async (...args: Array<MarketCreated>): Promise<void> => {
      expect(args[0]).toHaveProperty(
        'extraInfo',
        '{"description": "yesNo description 1", "longDescription": "yesNo longDescription 1", "tags": ["yesNo tag1-1", "yesNo tag1-2", "yesNo tag1-3"]}'
      );

      const getMarkets = connector.bindTo(Markets.getMarkets);
      const markets = await getMarkets({
        universe: john.augur.contracts.universe.address,
      });
      expect(markets).toEqual([yesNoMarket1.address]);

      await connector.off(SubscriptionEventNames.MarketCreated);
      expect(connector.subscriptions).toEqual({});
      done();
    }
  );

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);
}, 15000);

test('SEOConnector :: Should route correctly and handle events', async done => {
  const yesNoMarket1 = await john.createYesNoMarket({
    endTime: (await john.getTimestamp()).plus(SECONDS_IN_A_DAY),
    feePerCashInAttoCash: new BigNumber(10).pow(18).div(20), // 5% creator fee
    affiliateFeeDivisor: new BigNumber(0),
    designatedReporter: john.account,
    topic: 'yesNo topic 1',
    extraInfo:
      '{"description": "yesNo description 1", "longDescription": "yesNo longDescription 1", "tags": ["yesNo tag1-1", "yesNo tag1-2", "yesNo tag1-3"]}',
  });

  await connector.connect('');

  await connector.on(
    SubscriptionEventNames.NewBlock,
    async (...args: any[]): Promise<void> => {
      expect(args).toEqual([
        {
          eventName: SubscriptionEventNames.NewBlock,
          blocksBehindCurrent: 0,
          highestAvailableBlockNumber: expect.any(Number),
          lastSyncedBlockNumber: expect.any(Number),
          percentBehindCurrent: '0.0000',
        },
      ]);

      const getMarkets = connector.bindTo(Markets.getMarkets);
      const markets = await getMarkets({
        universe: john.augur.contracts.universe.address,
      });
      expect(markets[markets.length - 1]).toEqual(yesNoMarket1.address);

      await connector.off(SubscriptionEventNames.NewBlock);
      expect(connector.subscriptions).toEqual({});
      done();
    }
  );

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);
}, 15000);
