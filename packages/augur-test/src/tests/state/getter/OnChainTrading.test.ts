import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  MarketTradingHistory,
  Orders,
  OrderState,
} from '@augurproject/sdk/build/state/getter/OnChainTrading';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeedFile,
} from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { makeDbMock, makeProvider } from '../../../libs';

const mock = makeDbMock();

describe('State API :: Trading :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
  let bulkSyncStrategy: BulkSyncStrategy;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses);
    db = mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);

    bulkSyncStrategy = new BulkSyncStrategy(
      john.provider.getLogs,
      (await db).logFilters.buildFilter,
      (await db).logFilters.onLogsAdded,
      john.augur.contractEvents.parseLogs,
    );
  });

  test(':getTradingHistory', async () => {
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();

    // Create a market
    const market1 = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
    ]);
    const market2 = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
    ]);

    // Place an order
    const bid = new BigNumber(0);
    const outcome = new BigNumber(0);
    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);
    await john.placeOrder(
      market1.address,
      bid,
      numShares,
      price,
      outcome,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      market2.address,
      bid,
      numShares,
      price,
      outcome,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    // Take half the order using the same account
    const orderId1 = await john.getBestOrderId(bid, market1.address, outcome);
    const orderId2 = await john.getBestOrderId(bid, market2.address, outcome);
    await john.fillOrder(orderId1, numShares.div(2), '42');
    await john.fillOrder(orderId2, numShares.div(2), '42');

    // And the rest using another account
    await mary.faucet(new BigNumber(1e18)); // faucet enough to cover fills
    await mary.fillOrder(orderId1, numShares.div(2), '43');
    await mary.fillOrder(orderId2, numShares.div(2), '43');

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    // Get trades by user
    let trades: MarketTradingHistory[] = await api.route('getTradingHistory', {
      account: mary.account.publicKey,
    });

    await expect(trades[market1.address]).toHaveLength(1);
    await expect(trades[market2.address]).toHaveLength(1);

    const trade = trades[market1.address][0];
    await expect(trade.price).toEqual('0.22');
    await expect(trade.type).toEqual('sell');
    await expect(trade.amount).toEqual('0.0005');
    await expect(trade.maker).toEqual(false);
    await expect(trade.outcome).toEqual(0);
    await expect(trade.selfFilled).toEqual(false);

    // Get trades by market
    trades = await api.route('getTradingHistory', {
      marketIds: [market1.address],
    });

    await expect(trades[market1.address]).toHaveLength(2);
    await expect(trades[market2.address]).toBeUndefined();

    // Test `filterFinalized` param
    const newTime = (await market1.getEndTime_()).plus(1);
    await john.setTimestamp(newTime);

    const noPayoutSet = [
      new BigNumber(100),
      new BigNumber(0),
      new BigNumber(0),
    ];
    await john.doInitialReport(market1, noPayoutSet);

    await john.setTimestamp(newTime.plus(SECONDS_IN_A_DAY.times(7)));

    await john.finalizeMarket(market1);

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    trades = await api.route('getTradingHistory', {
      marketIds: [market1.address, market2.address],
      filterFinalized: true,
    });

    await expect(trades[market1.address]).toBeUndefined();
    await expect(trades[market2.address]).toHaveLength(2);
  });

  test('State API :: Trading :: getOpenOnChainOrders', async () => {
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();

    // Create a market
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
    ]);

    // Place an order
    const bid = new BigNumber(0);
    const outcome = new BigNumber(0);
    const numShares = new BigNumber(10000000000000);
    const price = new BigNumber(22);
    await john.placeOrder(
      market.address,
      bid,
      numShares,
      price,
      outcome,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    // Take half the order using the same account
    const orderId = await john.getBestOrderId(bid, market.address, outcome);

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    // Get orders for the market
    let orders: Orders = await api.route('getOpenOnChainOrders', {
      marketId: market.address,
      orderState: OrderState.OPEN,
    });
    let order = orders[market.address][0]['0'][orderId];
    await expect(order).not.toBeNull();

    await john.fillOrder(orderId, numShares.div(2), '42');

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    // Get orders for the market
    orders = await api.route('getOpenOnChainOrders', {
      marketId: market.address,
    });
    order = orders[market.address][0]['0'][orderId];
    await expect(order.price).toEqual('0.22');
    await expect(order.amount).toEqual('0.0005');
    await expect(order.tokensEscrowed).toEqual('0.00011');
    await expect(order.sharesEscrowed).toEqual('0');
    await expect(order.orderState).toEqual(OrderState.FILLED);

    // Cancel order
    await john.cancelNativeOrder(orderId);

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    // Get orders for the market
    orders = await api.route('getOpenOnChainOrders', {
      marketId: market.address,
    });
    order = orders[market.address][0]['0'][orderId];
    await expect(order.price).toEqual('0');
    await expect(order.amount).toEqual('0');
    await expect(order.orderState).toEqual(OrderState.CANCELED);
    await expect(order.canceledTransactionHash).toEqual(order.transactionHash);

    // Get only Open orders
    orders = await api.route('getOpenOnChainOrders', {
      marketId: market.address,
      orderState: OrderState.OPEN,
    });
    await expect(orders).toEqual({});

    // Get Canceled orders
    orders = await api.route('getOpenOnChainOrders', {
      marketId: market.address,
      orderState: OrderState.CANCELED,
    });
    order = orders[market.address][0]['0'][orderId];
    await expect(order.price).toEqual('0');

    // Move time forward and place a new order
    const initialTimestamp = await john.getTimestamp();
    const newTimestamp = initialTimestamp.plus(24 * 60 * 60);
    await john.setTimestamp(newTimestamp);

    await john.placeOrder(
      market.address,
      bid,
      numShares,
      price,
      outcome,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    // Test `filterFinalized` param
    orders = await api.route('getOpenOnChainOrders', {
      marketId: market.address,
      filterFinalized: true,
    });
    await expect(Object.keys(orders[market.address][0]['0']).length).toEqual(2);
  });
});
