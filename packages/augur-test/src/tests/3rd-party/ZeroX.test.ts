import { WSClient } from '@0x/mesh-rpc-client';
import { buildConfig } from '@augurproject/artifacts';
import { SDKConfiguration } from '@augurproject/utils';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Connectors } from '@augurproject/sdk';
import { ACCOUNTS } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider } from 'ethers/providers';
import { formatBytes32String } from 'ethers/utils';
import * as _ from 'lodash';
import { ZeroXOrders, ZeroXOrder } from '@augurproject/sdk-lite';

describe('3rd Party :: ZeroX :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;

  let meshClient: WSClient;
  let providerJohn: EthersProvider;
  let providerMary: EthersProvider;
  let config: SDKConfiguration;

  beforeAll(async () => {
    config = buildConfig('local');
    providerJohn = new EthersProvider(
      new JsonRpcProvider(config.ethereum.http),
      config.ethereum.rpcRetryCount,
      config.ethereum.rpcRetryInterval,
      config.ethereum.rpcConcurrency
    );
    providerMary = new EthersProvider(
      new JsonRpcProvider(config.ethereum.http),
      config.ethereum.rpcRetryCount,
      config.ethereum.rpcRetryInterval,
      config.ethereum.rpcConcurrency
    );

    meshClient = new WSClient(config.zeroX.rpc.ws);
  }, 240000);

  afterAll(() => {
    meshClient.destroy();
  });

  describe('Trades', () => {
    beforeAll(async () => {
      const connectorJohn = new Connectors.DirectConnector();
      john = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        providerJohn,
        config,
        connectorJohn
      );
      john.augur.zeroX.rpc = meshClient;
      connectorJohn.initialize(john.augur, john.db);
      await john.approve();
    }, 120000);

    test('State API :: ZeroX :: getOrders', async () => {
      // Create a market
      const market = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);
      await john.sync();

      // Give John enough cash to pay for the 0x order.
      await john.faucetCash(new BigNumber(1e22));

      // Place an order
      const direction = 0;
      const outcome = 0;
      const displayPrice = new BigNumber(0.22);
      const expirationTime = new BigNumber(new Date().valueOf()).plus(1000000);
      await john.placeZeroXOrder({
        direction,
        market: market.address,
        numTicks: await market.getNumTicks_(),
        numOutcomes: 3,
        outcome,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(10),
        displayPrice,
        displayShares: new BigNumber(0),
        expirationTime,
      });

      await john.sync();

      // Get orders for the market
      const orders: ZeroXOrders = await john.api.route('getZeroXOrders', {
        marketId: market.address,
      });
      const order: ZeroXOrder = _.values(orders[market.address][0]['0'])[0];
      await expect(order).not.toBeUndefined();
      await expect(order.price).toEqual('0.22');
      await expect(order.amount).toEqual('10');
      await expect(order.expirationTimeSeconds.toString()).toEqual(
        expirationTime.toFixed()
      );
    }, 60000);
  });
});
