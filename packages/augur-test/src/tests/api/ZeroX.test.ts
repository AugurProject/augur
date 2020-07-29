import { WSClient } from '@0x/mesh-rpc-client';
import { SDKConfiguration } from '@augurproject/utils';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { Connectors } from '@augurproject/sdk';
import {
  ACCOUNTS,
  defaultSeedPath,
  loadSeed,
  TestContractAPI,
} from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import * as _ from 'lodash';
import { enableZeroX, makeProvider } from '../../libs';
import { MockBrowserMesh } from '../../libs/MockBrowserMesh';
import { MockMeshServer, stopServer } from '../../libs/MockMeshServer';
import { ZeroXOrders } from '@augurproject/sdk-lite/build';

describe('Augur API :: ZeroX :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;

  let provider: TestEthersProvider;
  let config: SDKConfiguration;

  let meshClient: WSClient;

  beforeAll(async () => {
    const { port } = await MockMeshServer.create();
    meshClient = new WSClient(`ws://localhost:${port}`);

    const seed = await loadSeed(defaultSeedPath);
    provider = await makeProvider(seed, ACCOUNTS);
    config = enableZeroX(provider.getConfig());
  });

  afterAll(() => {
    meshClient.destroy();
    stopServer();
  });

  describe('without wallet', () => {
    beforeAll(async () => {
      const johnConnector = new Connectors.DirectConnector();
      const johnBrowserMesh = new MockBrowserMesh(meshClient);
      john = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        provider,
        config,
        johnConnector
      );

      john.augur.zeroX.mesh = johnBrowserMesh;
      john.augur.zeroX.rpc = meshClient;

      johnConnector.initialize(john.augur, john.db);
      await john.approve();

      const maryConnector = new Connectors.DirectConnector();
      const maryBrowserMesh = new MockBrowserMesh(meshClient);
      mary = await TestContractAPI.userWrapper(
        ACCOUNTS[1],
        provider,
        config,
        maryConnector
      );
      mary.augur.zeroX.mesh = maryBrowserMesh;
      mary.augur.zeroX.rpc = meshClient;

      maryConnector.initialize(mary.augur, mary.db);

      await mary.approve();

      maryBrowserMesh.addOtherBrowserMeshToMockNetwork(johnBrowserMesh);
    });

    test('State API :: ZeroX :: getOrders', async () => {
      // Create a market
      const market = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);

      await john.sync();

      await mary.sync();

      // Place an order
      const expirationTime = new BigNumber(new Date().valueOf()).plus(10000);
      await john.placeZeroXOrder({
        direction: 0,
        market: market.address,
        numTicks: await market.getNumTicks_(),
        numOutcomes: 3,
        outcome: 0,
        tradeGroupId: '42',
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(0),
        displayMaxPrice: new BigNumber(1),
        displayAmount: new BigNumber(10),
        displayPrice: new BigNumber(0.22),
        displayShares: new BigNumber(100000),
        expirationTime,
      });

      // Terrible, but not clear how else to wait on the mesh event propagating to the callback and it finishing updating the DB...
      await sleep(300);

      // Get orders for the market
      const orders: ZeroXOrders = await john.api.route('getZeroXOrders', {
        marketId: market.address,
      });
      expect(orders).toBeDefined();
      expect(orders).toHaveProperty(market.address);
      expect(orders[market.address]).toHaveProperty('0');
      expect(orders[market.address]['0']).toHaveProperty('0');
      const order = _.values(orders[market.address][0]['0'])[0];
      await expect(order).not.toBeUndefined();
      await expect(order.price).toEqual('0.22');
      await expect(order.amount).toEqual('10');
      await expect(order.expirationTimeSeconds.toFixed()).toEqual(
        expirationTime.toFixed()
      );
    });

    test('ZeroX Trade :: placeTrade', async () => {
      const market1 = await john.createReasonableYesNoMarket();

      const outcome = 1;

      await john.sync();
      await mary.sync();

      await john.placeBasicYesNoZeroXTrade(
        0,
        market1.address,
        outcome,
        new BigNumber(20),
        new BigNumber(0.4),
        new BigNumber(0),
        new BigNumber(1000000000000000)
      );

      await john.sync();
      await mary.sync();

      await mary.placeBasicYesNoZeroXTrade(
        1,
        market1.address,
        outcome,
        new BigNumber(10),
        new BigNumber(0.4),
        new BigNumber(0),
        new BigNumber(1000000000000000)
      );

      await john.sync();
      await mary.sync();

      await john.augur.getZeroXOrders({ marketId: market1.address, outcome });

      const johnShares = await john.getNumSharesInMarket(
        market1,
        new BigNumber(outcome)
      );
      const maryShares = await mary.getNumSharesInMarket(
        market1,
        new BigNumber(0)
      );

      await expect(johnShares.toNumber()).toEqual(10 ** 16);
      await expect(maryShares.toNumber()).toEqual(10 ** 16);
    });

    test('Trade :: simulateTrade', async () => {
      const market1 = await john.createReasonableYesNoMarket();

      const outcome = 1;
      const price = new BigNumber(0.4);
      const amount = new BigNumber(100);
      const zero = new BigNumber(0);

      await john.sync();
      await mary.sync();
      // No orders and a do not create orders param means nothing happens
      let simulationData = await john.simulateBasicZeroXYesNoTrade(
        0,
        market1,
        outcome,
        amount,
        price,
        new BigNumber(0),
        true
      );

      await expect(simulationData.tokensDepleted).toEqual(zero);
      await expect(simulationData.sharesDepleted).toEqual(zero);
      await expect(simulationData.sharesFilled).toEqual(zero);
      await expect(simulationData.numFills).toEqual(zero);

      // Simulate making an order
      simulationData = await john.simulateBasicZeroXYesNoTrade(
        0,
        market1,
        outcome,
        amount,
        price,
        new BigNumber(0),
        false
      );

      await expect(simulationData.tokensDepleted).toEqual(
        amount.multipliedBy(price)
      );
      await expect(simulationData.sharesDepleted).toEqual(zero);
      await expect(simulationData.sharesFilled).toEqual(zero);
      await expect(simulationData.numFills).toEqual(zero);

      await john.placeBasicYesNoZeroXTrade(
        0,
        market1.address,
        outcome,
        amount,
        price,
        new BigNumber(0),
        new BigNumber(1000000000000000)
      );

      await john.sync();
      await mary.sync();

      const fillAmount = new BigNumber(50);
      const fillPrice = new BigNumber(0.6);

      simulationData = await mary.simulateBasicZeroXYesNoTrade(
        1,
        market1,
        outcome,
        fillAmount,
        price,
        new BigNumber(0),
        true
      );

      await expect(simulationData.numFills).toEqual(new BigNumber(1));
      await expect(simulationData.sharesFilled).toEqual(fillAmount);
      await expect(simulationData.tokensDepleted).toEqual(
        fillAmount.multipliedBy(fillPrice)
      );
    });
  });
});
