import { WSClient } from '@0x/mesh-rpc-client';
import { ContractAddresses } from '@augurproject/artifacts';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { Connectors } from '@augurproject/sdk';
import { ZeroXOrders } from '@augurproject/sdk/build/state/getter/ZeroXOrdersGetters';
import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import {
  NULL_ADDRESS,
  stringTo32ByteHex,
} from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import * as _ from 'lodash';
import { makeProvider, MockGnosisRelayAPI } from '../../libs';
import { MockBrowserMesh } from '../../libs/MockBrowserMesh';
import { MockMeshServer, stopServer } from '../../libs/MockMeshServer';

describe('Augur API :: ZeroX :: ', () => {
  let john: TestContractAPI;

  let mary: TestContractAPI;

  let provider: EthersProvider;
  let addresses: ContractAddresses;

  let meshClient: WSClient;

  beforeAll(async () => {
    const { port } = await MockMeshServer.create();
    meshClient = new WSClient(`ws://localhost:${port}`);

    const seed = await loadSeedFile(defaultSeedPath);
    addresses = seed.addresses;
    provider = await makeProvider(seed, ACCOUNTS);
  });

  afterAll(() => {
    meshClient.destroy();
    stopServer();
  });

  describe('with gnosis', () => {
    beforeAll(async () => {
      const johnConnector = new Connectors.DirectConnector();
      const johnGnosis = new MockGnosisRelayAPI();
      const johnBrowserMesh = new MockBrowserMesh(meshClient);
      john = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        provider,
        addresses,
        johnConnector,
        johnGnosis,
        meshClient,
        johnBrowserMesh
      );
      expect(john).toBeDefined();
      johnGnosis.initialize(john);
      johnConnector.initialize(john.augur, john.db);
      await john.approveCentralAuthority();

      const maryConnector = new Connectors.DirectConnector();
      const maryGnosis = new MockGnosisRelayAPI();
      const maryBrowserMesh = new MockBrowserMesh(meshClient);
      mary = await TestContractAPI.userWrapper(
        ACCOUNTS[1],
        provider,
        addresses,
        maryConnector,
        maryGnosis,
        meshClient,
        maryBrowserMesh
      );
      maryGnosis.initialize(mary);
      maryConnector.initialize(mary.augur, mary.db);
      await mary.approveCentralAuthority();

      maryBrowserMesh.addOtherBrowserMeshToMockNetwork(johnBrowserMesh);
      johnBrowserMesh.addOtherBrowserMeshToMockNetwork(maryBrowserMesh);
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

      // Get orders for this market
      const orders: ZeroXOrders = await john.api.route('getZeroXOrders', {
        marketId: market.address,
      });
      expect(orders).toBeDefined();
      expect(orders).toHaveProperty(market.address);
      expect(orders[market.address]).toHaveProperty('0');
      expect(orders[market.address]['0']).toHaveProperty('0');

      const thisOrder = _.values(orders[market.address][0]['0'])[0];
      // Get this order
      const order = await john.api.route('getZeroXOrder', {
        orderHash: thisOrder.orderId,
      });
      await expect(thisOrder).toEqual(order);

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

      const orders: ZeroXOrders = await mary.api.route('getZeroXOrders', {
        marketId: market1.address,
      });

      console.log(`MARY ORDERS: ${JSON.stringify(orders)}`);

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
      const johnShares = await john.getNumSharesInMarket(
        market1,
        new BigNumber(outcome)
      );
      const maryShares = await mary.getNumSharesInMarket(
        market1,
        new BigNumber(0)
      );

      await expect(johnShares.toNumber()).toEqual(10 ** 17);
      await expect(maryShares.toNumber()).toEqual(10 ** 17);
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

    test('Cancel', async () => {
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

      // Get orders for this market
      const orders: ZeroXOrders = await john.api.route('getZeroXOrders', {
        marketId: market.address,
      });
      expect(orders).toBeDefined();
      expect(orders).toHaveProperty(market.address);
      expect(orders[market.address]).toHaveProperty('0');
      expect(orders[market.address]['0']).toHaveProperty('0');
      const order = _.values(orders[market.address][0]['0'])[0];

      await john.cancelOrder(order.orderId);
      await john.sync();
      await mary.sync();
      const allCancels = await john.db.Cancel.toArray();
      expect(allCancels.length).toBe(1);
      expect(allCancels[0]).toMatchObject({
        name: 'Cancel',
        makerAddress: john.account.publicKey,
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        makerAssetData: expect.stringContaining('0x'),
        takerAssetData: expect.stringContaining('0x'),
        senderAddress: john.account.publicKey,
        topics: expect.arrayContaining([
          expect.stringContaining('0x'),
          expect.stringContaining('0x'),
          expect.stringContaining('0x'),
          expect.stringContaining('0x'),
        ]),
      });

      const allDerivedCancels = await john.db.CancelledOrders.toArray();
      expect(allDerivedCancels.length).toBe(1);
      expect(allDerivedCancels[0]).toMatchObject({
        senderAddress: john.account.publicKey,
        makerAddress: john.account.publicKey,
        feeRecipientAddress: NULL_ADDRESS,
        market: market.address,
        price: '0x00000000000000000016',
        outcome: '0x00',
        orderType: '0x00',
      });

      const indexKeyOrders = await john.db.CancelledOrders.where(
        '[makerAddress+market]'
      )
        .equals([john.account.publicKey, market.address])
        .toArray();
      expect(indexKeyOrders.length).toBe(1);
      expect(indexKeyOrders[0]).toMatchObject({
        senderAddress: john.account.publicKey,
        makerAddress: john.account.publicKey,
        feeRecipientAddress: NULL_ADDRESS,
        market: market.address,
        price: '0x00000000000000000016',
        outcome: '0x00',
        orderType: '0x00',
      });
    });
  });

  describe('without gnosis', () => {
    beforeAll(async () => {
      const johnConnector = new Connectors.DirectConnector();
      const johnBrowserMesh = new MockBrowserMesh(meshClient);
      john = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        provider,
        addresses,
        johnConnector,
        undefined,
        meshClient,
        johnBrowserMesh
      );
      john.dependencies.setUseSafe(false);
      johnConnector.initialize(john.augur, john.db);
      await john.approveCentralAuthority();

      const maryConnector = new Connectors.DirectConnector();
      const maryBrowserMesh = new MockBrowserMesh(meshClient);
      mary = await TestContractAPI.userWrapper(
        ACCOUNTS[1],
        provider,
        addresses,
        maryConnector,
        undefined,
        meshClient,
        maryBrowserMesh
      );
      mary.dependencies.setUseSafe(false);
      maryConnector.initialize(mary.augur, mary.db);
      await mary.approveCentralAuthority();

      maryBrowserMesh.addOtherBrowserMeshToMockNetwork(johnBrowserMesh);
      johnBrowserMesh.addOtherBrowserMeshToMockNetwork(maryBrowserMesh);
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

      await expect(johnShares.toNumber()).toEqual(10 ** 17);
      await expect(maryShares.toNumber()).toEqual(10 ** 17);
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
