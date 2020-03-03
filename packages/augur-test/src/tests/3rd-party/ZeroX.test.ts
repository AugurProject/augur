import { WSClient } from '@0x/mesh-rpc-client';
import {
  getAddressesForNetwork,
  ContractAddresses,
  NetworkId,
} from '@augurproject/artifacts';
import { sleep } from '@augurproject/core/build/libraries/HelperFunctions';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import {
  GnosisRelayAPI,
  GnosisSafeState,
} from '@augurproject/gnosis-relay-api';
import { Connectors } from '@augurproject/sdk';
import {
  ZeroXOrder,
  ZeroXOrders,
} from '@augurproject/sdk/build/state/getter/ZeroXOrdersGetters';
import { ACCOUNTS } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider } from 'ethers/providers';
import { formatBytes32String } from 'ethers/utils';
import * as _ from 'lodash';

describe('3rd Party :: ZeroX :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;

  let meshClient: WSClient;
  let providerJohn: EthersProvider;
  let providerMary: EthersProvider;
  let networkId: NetworkId;
  let addresses: ContractAddresses;

  beforeAll(async () => {
    providerJohn = new EthersProvider(
      new JsonRpcProvider('http://localhost:8545'),
      5,
      0,
      40
    );
    providerMary = new EthersProvider(
      new JsonRpcProvider('http://localhost:8545'),
      5,
      0,
      40
    );
    networkId = await providerJohn.getNetworkId() as NetworkId;
    addresses = getAddressesForNetwork(networkId);

    meshClient = new WSClient('ws://localhost:60557');
  }, 240000);

  afterAll(() => {
    meshClient.destroy();
  });

  describe('with gnosis', () => {
    beforeAll(async () => {
      const johnConnector = new Connectors.DirectConnector();
      john = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        providerJohn,
        addresses,
        johnConnector,
        new GnosisRelayAPI('http://localhost:8888/api/'),
        meshClient,
        undefined
      );
      johnConnector.initialize(john.augur, john.db);

      await john.approveCentralAuthority();
      const johnSafe = await john.fundSafe();
      const johnSafeStatus = await john.getSafeStatus(johnSafe);
      console.log(`Safe ${johnSafe}: ${johnSafeStatus}`);
      expect(johnSafeStatus).toBe(GnosisSafeState.AVAILABLE);
      await john.augur.setGasPrice(new BigNumber(90000));
      john.setGnosisSafeAddress(johnSafe);
      john.setUseGnosisSafe(true);
      john.setUseGnosisRelay(true);

      const maryConnector = new Connectors.DirectConnector();
      mary = await TestContractAPI.userWrapper(
        ACCOUNTS[2],
        providerMary,
        addresses,
        maryConnector,
        new GnosisRelayAPI('http://localhost:8888/api/'),
        meshClient,
        undefined
      );
      maryConnector.initialize(mary.augur, await mary.db);

      await mary.approveCentralAuthority();
      const marySafe = await mary
        .fundSafe()
        .catch(e => console.error(`Safe funding failed: ${JSON.stringify(e)}`));
      if (marySafe) {
        const marySafeStatus = await mary.getSafeStatus(marySafe);
        console.log(`Safe ${marySafe}: ${marySafeStatus}`);
        expect(marySafeStatus).toBe(GnosisSafeState.AVAILABLE);
        await john.sendEther(marySafe, new BigNumber(10 ** 15));
        await mary.augur.setGasPrice(new BigNumber(90000));
        mary.setGnosisSafeAddress(marySafe);
        mary.setUseGnosisSafe(true);
        mary.setUseGnosisRelay(true);
      }
    }, 240000);

    test('State API :: ZeroX :: placeThenGetOrders', async () => {
      await expect(mary.augur.getUseGnosisSafe()).toEqual(true);
      // Create a market
      const market = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);
      await john.sync();

      // Give John enough cash to pay for the 0x order.
      await john.faucet(new BigNumber(1e22));

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
      // Terrible, but not clear how else to wait on the mesh event propagating to the callback and it finishing updating the DB...
      await sleep(300);

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
    }, 240000);

    test('State API :: ZeroX :: getOrders :: Poor', async () => {
      // Create a market
      const market = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);
      await john.sync();

      // Give John enough cash to pay for the 0x order.
      await john.faucet(new BigNumber(1e22));

      // Place an order
      const direction = 0;
      const outcome = 0;
      const displayPrice = new BigNumber(0.22);
      const expirationTime = new BigNumber(new Date().valueOf()).plus(1000000);
      await expect(
        john.placeZeroXOrder({
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
          displayAmount: new BigNumber(1e20), // insane amount
          displayPrice,
          displayShares: new BigNumber(0),
          expirationTime,
        })
      ).rejects.toThrow();
    }, 240000);

    test('ZeroX Trade :: placeTrade', async () => {
      const market1 = await john.createReasonableYesNoMarket();

      await john.sync();

      const outcome = 1;
      await john.placeBasicYesNoZeroXTrade(
        0,
        market1.address,
        outcome,
        new BigNumber(10),
        new BigNumber(0.4),
        new BigNumber(0),
        new BigNumber(1000000000000000)
      );

      await john.placeBasicYesNoZeroXTrade(
        0,
        market1.address,
        outcome,
        new BigNumber(10),
        new BigNumber(0.4),
        new BigNumber(0),
        new BigNumber(1000000000000000)
      );

      await john.placeBasicYesNoZeroXTrade(
        0,
        market1.address,
        outcome,
        new BigNumber(10),
        new BigNumber(0.4),
        new BigNumber(0),
        new BigNumber(1000000000000000)
      );

      await john.placeBasicYesNoZeroXTrade(
        0,
        market1.address,
        outcome,
        new BigNumber(70),
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
        new BigNumber(100),
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

      await expect(johnShares.toNumber()).toEqual(10 ** 18);
      await expect(maryShares.toNumber()).toEqual(10 ** 18);
    }, 240000);

    test('Trade :: simulateTrade', async () => {
      // Give John enough cash to pay for the 0x order.
      await john.faucet(new BigNumber(1e22));

      const market1 = await john.createReasonableYesNoMarket();

      const outcome = 1;
      const price = new BigNumber(0.4);
      const amount = new BigNumber(100);
      const zero = new BigNumber(0);

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
      await expect(simulationData.tokensDepleted).toEqual(
        fillAmount.multipliedBy(fillPrice)
      );
      await expect(simulationData.sharesFilled).toEqual(fillAmount);

    }, 240000);
  });

  describe('without gnosis', () => {
    beforeAll(async () => {
      const connectorJohn = new Connectors.DirectConnector();
      john = await TestContractAPI.userWrapper(
        ACCOUNTS[0],
        providerJohn,
        addresses,
        connectorJohn,
        undefined,
        meshClient,
        undefined
      );
      connectorJohn.initialize(john.augur, john.db);
      await john.approveCentralAuthority();
    }, 120000);

    test('State API :: ZeroX :: getOrders', async () => {
      // Create a market
      const market = await john.createReasonableMarket([
        stringTo32ByteHex('A'),
        stringTo32ByteHex('B'),
      ]);
      await john.sync();

      // Give John enough cash to pay for the 0x order.
      await john.faucet(new BigNumber(1e22));

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
