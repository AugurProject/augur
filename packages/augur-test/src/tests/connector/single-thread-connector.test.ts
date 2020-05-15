import { SDKConfiguration } from '@augurproject/artifacts';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { SingleThreadConnector } from '@augurproject/sdk/build/connector';
import { SubscriptionEventName } from '@augurproject/sdk/build/constants';
import { Markets } from '@augurproject/sdk/build/state/getter/Markets';
import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeed,
  TestContractAPI,
} from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import { makeProvider } from '../../libs';

let connector: SingleThreadConnector;
let provider: TestEthersProvider;
let john: TestContractAPI;

beforeAll(async () => {
  const seed = await loadSeed(defaultSeedPath);
  provider = await makeProvider(seed, ACCOUNTS);
  connector = new SingleThreadConnector();

  john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    provider.getConfig(),
    connector
  );

  await john.approve();

  console.log('Connector connecting');
  const config: SDKConfiguration = {
    networkId: await provider.getNetworkId(),
    ethereum: {
      http: '',
      rpcRetryCount: 5,
      rpcRetryInterval: 0,
      rpcConcurrency: 40,
    },
    warpSync: {
      enabled: false,
    },
  };
  connector.client = john.augur;

  // No need to sync. This starts the 'sync' process we use in prod.
  await connector.connect(config);
});

test('SingleThreadConnector :: Should route correctly and handle events, extraInfo', async done => {
  connector.on(
    SubscriptionEventName.DBMarketCreatedEvent,
    async (event: any): Promise<void> => {
      connector.off(SubscriptionEventName.DBMarketCreatedEvent);

      const marketIds = _.map(event.data, 'market');
      const getMarketsInfo = connector.bindTo(Markets.getMarketsInfo);
      const marketList = await getMarketsInfo({
        marketIds,
      });

      expect(marketList[0].categories[0]).toEqual(
        'yesNo category 1'.toLowerCase()
      );
      expect(marketList[0].categories[1]).toEqual(
        'yesNo category 2'.toLowerCase()
      );
      expect(marketList[0].description).toEqual('yesNo description 1');
      expect(marketList[0].details).toEqual('yesNo longDescription 1');
      expect(marketList[0].id).toEqual(yesNoMarket1.address);

      expect(connector.subscriptions).toEqual({});
      done();
    }
  );

  const yesNoMarket1 = await john.createYesNoMarket({
    endTime: (await john.getTimestamp()).plus(SECONDS_IN_A_DAY),
    feePerCashInAttoCash: new BigNumber(10).pow(18).div(20), // 5% creator fee
    affiliateFeeDivisor: new BigNumber(0),
    designatedReporter: john.account.address,
    extraInfo:
      '{"categories": ["yesNo category 1", "yesNo category 2"], "description": "yesNo description 1", "longDescription": "yesNo longDescription 1"}',
  });
});
