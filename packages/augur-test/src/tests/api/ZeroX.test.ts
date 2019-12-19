import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { BigNumber } from 'bignumber.js';
import { makeDbMock, makeProvider } from "../../libs";
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { MockMeshServer, SERVER_PORT, stopServer } from '../../libs/MockMeshServer';
import { WSClient } from '@0x/mesh-rpc-client';
import { Connectors } from '@augurproject/sdk';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { stringTo32ByteHex } from '../../libs/Utils';
import { ZeroXOrders } from '@augurproject/sdk/build/state/getter/ZeroXOrdersGetters';
import { sleep } from "@augurproject/core/build/libraries/HelperFunctions";
import { MockBrowserMesh } from "../../libs/MockBrowserMesh";
import { formatBytes32String } from 'ethers/utils';
import * as _ from 'lodash';

describe('Augur API :: ZeroX :: ', () => {
  let john: ContractAPI;
  let johnDB: Promise<DB>;
  let johnAPI: API;

  let mary: ContractAPI;
  let maryDB: Promise<DB>;
  let maryAPI: API;

  let meshClient: WSClient;
  const mock = makeDbMock();

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);
    const addresses = provider.getContractAddresses();
    await MockMeshServer.create();
    meshClient = new WSClient(`ws://localhost:${SERVER_PORT}`);
    const meshBrowser = new MockBrowserMesh(meshClient);

    const johnConnector = new Connectors.DirectConnector();
    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses, johnConnector, undefined, meshClient, meshBrowser);
    johnDB = mock.makeDB(john.augur, ACCOUNTS);
    johnConnector.initialize(john.augur, await johnDB);
    johnAPI = new API(john.augur, johnDB);
    await john.approveCentralAuthority();

    const maryConnector = new Connectors.DirectConnector();
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, addresses, maryConnector, undefined, meshClient, meshBrowser);
    maryDB = mock.makeDB(mary.augur, ACCOUNTS);
    maryConnector.initialize(mary.augur, await maryDB);
    maryAPI = new API(mary.augur, maryDB);
    await mary.approveCentralAuthority();
  });

  afterAll(() => {
    meshClient.destroy();
    stopServer();
  });

  test('State API :: ZeroX :: getOrders', async () => {
    // Create a market
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
    ]);

    await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);

    // Place an order
    const direction = 0;
    const outcome = 0;
    const displayPrice = new BigNumber(.22);
    const kycToken = "0x000000000000000000000000000000000000000C";
    const expirationTime = new BigNumber(new Date().valueOf()).plus(10000);
    await john.placeZeroXOrder({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: 3,
      outcome,
      tradeGroupId: "42",
      fingerprint: formatBytes32String('11'),
      kycToken,
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount: new BigNumber(1),
      displayPrice,
      displayShares: new BigNumber(1),
      expirationTime,
    });

    // Terrible, but not clear how else to wait on the mesh event propagating to the callback and it finishing updating the DB...
    await sleep(300);

    // Get orders for the market
    const orders: ZeroXOrders = await johnAPI.route('getZeroXOrders', {
      marketId: market.address,
    });
    const order = _.values(orders[market.address][0]['0'])[0];
    await expect(order).not.toBeUndefined();
    await expect(order.price).toEqual('0.22');
    await expect(order.amount).toEqual('1');
    await expect(order.kycToken).toEqual(kycToken);
    await expect(order.expirationTimeSeconds).toEqual(expirationTime.toFixed());
  });

  test.skip('ZeroX Trade :: placeTrade', async () => {
    const market1 = await john.createReasonableYesNoMarket();

    const outcome = 1;

    await john.placeBasicYesNoZeroXTrade(
      0,
      market1.address,
      outcome,
      new BigNumber(1),
      new BigNumber(0.4),
      new BigNumber(0),
      new BigNumber(1000000000000000)
    );

    await mary.placeBasicYesNoZeroXTrade(
      1,
      market1.address,
      outcome,
      new BigNumber(0.5),
      new BigNumber(0.4),
      new BigNumber(0),
      new BigNumber(1000000000000000)
    );

    await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
    await (await maryDB).sync(mary.augur, mock.constants.chunkSize, 0);

    const johnOrders = await john.augur.getZeroXOrders({marketId: market1.address, outcome});
    const maryOrders = await mary.augur.getZeroXOrders({marketId: market1.address, outcome});

    const johnShares = await john.getNumSharesInMarket(market1, new BigNumber(outcome));
    const maryShares = await mary.getNumSharesInMarket(market1, new BigNumber(0));

    await expect(johnShares.toNumber()).toEqual(10 ** 16 / 2);
    await expect(maryShares.toNumber()).toEqual(10 ** 16 / 2);
  });

  test('Trade :: simulateTrade', async () => {
    const market1 = await john.createReasonableYesNoMarket();

    const outcome = 1;
    const price = new BigNumber(0.4);
    const amount = new BigNumber(1);
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

    await expect(simulationData.tokensDepleted).toEqual(amount.multipliedBy(price));
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

    await (await johnDB).sync(john.augur, mock.constants.chunkSize, 0);
    await (await maryDB).sync(mary.augur, mock.constants.chunkSize, 0);

    const fillAmount = new BigNumber(0.5);
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

    await expect(simulationData.tokensDepleted).toEqual(fillAmount.multipliedBy(fillPrice));
    await expect(simulationData.sharesFilled).toEqual(fillAmount);
    await expect(simulationData.numFills).toEqual(new BigNumber(1));
  });
});
