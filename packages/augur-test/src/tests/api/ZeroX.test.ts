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
  }, 120000);

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
  }, 60000);

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
  }, 150000);

  /*
  test('Trade :: simulateTrade', async () => {
    const market1 = await john.createReasonableYesNoMarket();

    const orderAmount = new BigNumber(1);
    const orderPrice = new BigNumber(0.4);
    await john.placeBasicYesNoTrade(
      0,
      market1,
      1,
      orderAmount,
      orderPrice,
      new BigNumber(0)
    );

    const fillAmount = new BigNumber(0.5);
    const fillPrice = new BigNumber(0.6);
    let simulationData = await mary.simulateBasicYesNoTrade(
      1,
      market1,
      1,
      fillAmount,
      orderPrice,
      new BigNumber(0)
    );

    await expect(simulationData.tokensDepleted).toEqual(
      fillAmount.multipliedBy(fillPrice)
    );
    await expect(simulationData.sharesFilled).toEqual(fillAmount);

    await mary.placeBasicYesNoTrade(
      1,
      market1,
      1,
      orderAmount,
      orderPrice,
      new BigNumber(0)
    );
    await john.placeBasicYesNoTrade(
      1,
      market1,
      1,
      orderAmount,
      orderPrice,
      new BigNumber(0)
    );

    simulationData = await mary.simulateBasicYesNoTrade(
      0,
      market1,
      1,
      orderAmount,
      orderPrice,
      new BigNumber(0)
    );

    const expectedFees = orderAmount.multipliedBy(fillPrice).dividedBy(50); // 2% combined market & reporter fees
    await expect(simulationData.sharesDepleted).toEqual(orderAmount);
    await expect(simulationData.sharesFilled).toEqual(orderAmount);
    await expect(simulationData.settlementFees).toEqual(expectedFees);
  }, 150000);
  */
});
