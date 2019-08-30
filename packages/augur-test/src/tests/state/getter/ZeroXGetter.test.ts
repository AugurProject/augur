import { makeDbMock, makeProvider } from "../../../libs";
import { ContractAPI, loadSeedFile, ACCOUNTS, defaultSeedPath } from "@augurproject/tools";
import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { BigNumber } from 'bignumber.js';
import { stringTo32ByteHex } from '../../../libs/Utils';
import { MockMeshServer, SERVER_PORT, stopServer } from '../../../libs/MockMeshServer';
import { WSClient } from '@0x/mesh-rpc-client';
import { ZeroXOrders } from '@augurproject/sdk/build/state/getter/ZeroXOrdersGetters';
import { sleep } from "@augurproject/core/build/libraries/HelperFunctions";



describe('State API :: ZeroX Getter :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  const mock = makeDbMock();
  let meshClient: WSClient;

  afterAll(() => {
    meshClient.destroy();
    stopServer();
  });

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);
    await MockMeshServer.create();
    meshClient = new WSClient(`ws://localhost:${SERVER_PORT}`);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses, undefined, undefined, meshClient);
    db = mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
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
});
