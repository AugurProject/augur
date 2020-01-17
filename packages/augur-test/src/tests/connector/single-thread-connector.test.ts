import { ContractAddresses } from '@augurproject/artifacts';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { SingleThreadConnector } from '@augurproject/sdk/build/connector';
import { SubscriptionEventName } from '@augurproject/sdk/build/constants';
import { MarketCreated } from '@augurproject/sdk/build/events';
import { Controller } from '@augurproject/sdk/build/state/Controller';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { Markets } from '@augurproject/sdk/build/state/getter/Markets';
import { LogFilterAggregator } from '@augurproject/sdk/build/state/logs/LogFilterAggregator';
import { BlockAndLogStreamerSyncStrategy } from '@augurproject/sdk/build/state/sync/BlockAndLogStreamerSyncStrategy';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
} from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { makeDbMock, makeProvider } from '../../libs';

let connector: SingleThreadConnector;
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
      const logFilterAggregator = new LogFilterAggregator({
        getEventTopics: john.augur.contractEvents.getEventTopics,
        parseLogs: john.augur.contractEvents.parseLogs,
        getEventContractAddress: john.augur.contractEvents.getEventContractAddress
      });

      const blockAndLogStreamerListener = BlockAndLogStreamerSyncStrategy.create(
        provider,
        logFilterAggregator
      );

      const bulkSyncStrategy = new BulkSyncStrategy(
        john.augur.provider.getLogs,
        logFilterAggregator.buildFilter,
        logFilterAggregator.onLogsAdded,
        john.augur.contractEvents.parseLogs
      );

      const api = new API(john.augur, db);
      const controller = new Controller(
        john.augur,
        db,
        logFilterAggregator
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

  connector = new SingleThreadConnector();
  console.log("Connector connecting");
  await connector.connect('');
});

test('SingleThreadConnector :: Should route correctly and handle events, extraInfo', async done => {
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

      await (await db).sync(john.augur, mock.constants.chunkSize, 0);

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
