import { SECONDS_IN_A_DAY } from '@augurproject/sdk';
import {
  MarketTradingHistory,
  Orders,
  OrderState,
} from '@augurproject/sdk/build/state/getter/OnChainTrading';
import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { makeProvider } from '../../../libs';

describe('State API :: Trading :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      provider,
      seed.addresses
    );
    mary = await TestContractAPI.userWrapper(
      ACCOUNTS[1],
      provider,
      seed.addresses
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

    await john.sync();

    // Get trades by user
    let trades: MarketTradingHistory[] = await john.api.route(
      'getTradingHistory',
      {
        account: mary.account.publicKey,
      }
    );

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
    trades = await john.api.route('getTradingHistory', {
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

    await john.sync();

    trades = await john.api.route('getTradingHistory', {
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

    await john.sync();

    // Get orders for the market
    let orders: Orders = await john.api.route('getOpenOnChainOrders', {
      marketId: market.address,
      orderState: OrderState.OPEN,
    });
    let order = orders[market.address][0]['0'][orderId];
    await expect(order).not.toBeNull();

    await john.fillOrder(orderId, numShares.div(2), '42');

    await john.sync();

    // Get orders for the market
    orders = await john.api.route('getOpenOnChainOrders', {
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

    await john.sync();

    // Get orders for the market
    orders = await john.api.route('getOpenOnChainOrders', {
      marketId: market.address,
    });
    order = orders[market.address][0]['0'][orderId];
    await expect(order.price).toEqual('0');
    await expect(order.amount).toEqual('0');
    await expect(order.orderState).toEqual(OrderState.CANCELED);
    await expect(order.canceledTransactionHash).toEqual(order.transactionHash);

    // Get only Open orders
    orders = await john.api.route('getOpenOnChainOrders', {
      marketId: market.address,
      orderState: OrderState.OPEN,
    });
    await expect(orders).toEqual({});

    // Get Canceled orders
    orders = await john.api.route('getOpenOnChainOrders', {
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

    await john.sync();

    // Test `filterFinalized` param
    orders = await john.api.route('getOpenOnChainOrders', {
      marketId: market.address,
      filterFinalized: true,
    });
    await expect(Object.keys(orders[market.address][0]['0']).length).toEqual(2);
  });
});
