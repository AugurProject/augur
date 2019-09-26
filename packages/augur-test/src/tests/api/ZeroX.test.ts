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

describe('Augur API :: ZeroX :: ', () => {
  let john: ContractAPI;
  let mary: ContractAPI;
  let meshClient: WSClient;
  let db: DB;
  let api: API;
  const mock = makeDbMock();

  afterAll(() => {
    meshClient.destroy();
    stopServer();
  });

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    await MockMeshServer.create();
    meshClient = new WSClient(`ws://localhost:${SERVER_PORT}`);

    const connector = new Connectors.DirectConnector();

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses, connector, undefined, meshClient);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses, connector, undefined, meshClient);
    const dbPromise = mock.makeDB(john.augur, ACCOUNTS);
    db = await dbPromise;
    connector.initialize(john.augur, db);
    api = new API(john.augur, dbPromise);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
  });

  test('State API :: ZeroX :: getOrders', async () => {
    await john.approveCentralAuthority();

    // Create a market
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
    ]);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Place an order
    const direction = 0;
    const outcome = 0;
    const displayPrice = new BigNumber(.22);
    const kycToken = "0x000000000000000000000000000000000000000C";
    const orderHash = await john.placeZeroXOrder({
      direction,
      market: market.address,
      numTicks: await market.getNumTicks_(),
      numOutcomes: 3,
      outcome,
      tradeGroupId: "42",
      affiliateAddress: "0x000000000000000000000000000000000000000b",
      kycToken,
      doNotCreateOrders: false,
      displayMinPrice: new BigNumber(0),
      displayMaxPrice: new BigNumber(1),
      displayAmount: new BigNumber(1),
      displayPrice: displayPrice,
      displayShares: new BigNumber(0),
      expirationTime: new BigNumber(450),
    });

    // Terrible, but not clear how else to wait on the mesh event propagating to the callback and it finishing updating the DB...
    await sleep(300);

    // Get orders for the market
    let orders: ZeroXOrders = await api.route('getZeroXOrders', {
      marketId: market.address,
    });
    let order = orders[market.address][0]['0'][orderHash];
    await expect(order).not.toBeNull();
    await expect(order.price).toEqual('0.22');
    await expect(order.amount).toEqual('1');
    await expect(order.kycToken).toEqual(kycToken);
    await expect(order.expirationTimeSeconds).toEqual("450");
  });

  test('ZeroX Trade :: placeTrade', async () => {
    const market1 = await john.createReasonableYesNoMarket();

    const outcome = 1;

    await john.placeBasicYesNoZeroXTrade(
      0,
      market1,
      outcome,
      new BigNumber(1),
      new BigNumber(0.4),
      new BigNumber(0),
      new BigNumber(1000000000000000)
    );

    await db.sync(john.augur, mock.constants.chunkSize, 0);

    await mary.placeBasicYesNoZeroXTrade(
      1,
      market1,
      outcome,
      new BigNumber(0.5),
      new BigNumber(0.4),
      new BigNumber(0),
      new BigNumber(1000000000000000)
    );

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
      market1,
      outcome,
      amount,
      price,
      new BigNumber(0),
      new BigNumber(1000000000000000)
    );

    await db.sync(john.augur, mock.constants.chunkSize, 0);

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
