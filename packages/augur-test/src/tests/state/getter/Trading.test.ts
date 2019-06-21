import {
  ACCOUNTS,
  makeDbMock,
  deployContracts,
  ContractAPI,
} from "../../../libs";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { API } from "@augurproject/sdk/build/state/getter/API";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { SECONDS_IN_A_DAY } from "@augurproject/sdk/build/state/getter/Markets";
import { AllOrders, MarketTradingHistory, Orders, OrderState } from "@augurproject/sdk/build/state/getter/Trading";
import { BigNumber } from "bignumber.js";
import { stringTo32ByteHex } from "../../../libs/Utils";

const mock = makeDbMock();

let db: Promise<DB>;
let api: API;
let john: ContractAPI;
let mary: ContractAPI;

beforeAll(async () => {
  const { provider, addresses } = await deployContracts(ACCOUNTS, compilerOutput);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS, 1, provider, addresses);
  db = mock.makeDB(john.augur, ACCOUNTS);
  api = new API(john.augur, db);
}, 120000);

test("State API :: Trading :: getTradingHistory", async () => {
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  // Create a market
  const market = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B")]);

  // Place an order
  const bid = new BigNumber(0);
  const outcome = new BigNumber(0);
  const numShares = new BigNumber(10000000000000);
  const price = new BigNumber(22);
  await john.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Take half the order using the same account
  const cost = numShares.multipliedBy(78).div(2);
  const orderId = await john.getBestOrderId(bid, market.address, outcome);
  await john.fillOrder(orderId, cost, numShares.div(2), "42");

  // And the rest using another account
  await mary.fillOrder(orderId, cost, numShares.div(2), "43");

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  // Get trades by user
  let trades: Array<MarketTradingHistory> = await api.route("getTradingHistory", {
    account: mary.account,
  });

  await expect(trades).toHaveLength(1);

  const trade = trades[0];
  await expect(trade.price).toEqual("0.22");
  await expect(trade.type).toEqual("sell");
  await expect(trade.amount).toEqual("0.0005");
  await expect(trade.maker).toEqual(false);
  await expect(trade.outcome).toEqual(0);
  await expect(trade.selfFilled).toEqual(false);

  // Get trades by market
  trades = await api.route("getTradingHistory", {
    marketId: market.address,
  });

  await expect(trades).toHaveLength(2);

  // Test `ignoreResolvedMarkets` param
  let newTime = (await market.getEndTime_()).plus(1);
  await john.setTimestamp(newTime);

  const noPayoutSet = [
    new BigNumber(100),
    new BigNumber(0),
    new BigNumber(0),
  ];
  await john.doInitialReport(market, noPayoutSet);

  await john.setTimestamp(newTime.plus(SECONDS_IN_A_DAY * 7));

  await john.finalizeMarket(market);

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  trades = await api.route("getTradingHistory", {
    marketId: market.address,
    ignoreResolvedMarkets: true
  });

  await expect(trades).toHaveLength(0);
}, 60000);

test("State API :: Trading :: getOrders/getAllOrders", async () => {
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  // Create a market
  const market = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B")]);

  // Place an order
  const bid = new BigNumber(0);
  const outcome = new BigNumber(0);
  const numShares = new BigNumber(10000000000000);
  const price = new BigNumber(22);
  await john.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Take half the order using the same account
  const cost = numShares.multipliedBy(78).div(2);
  const orderId = await john.getBestOrderId(bid, market.address, outcome);

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market
  let orders: Orders = await api.route("getOrders", {
    marketId: market.address,
    orderState: OrderState.OPEN
  });
  let order = orders[market.address][0]["0"][orderId];
  await expect(order).not.toBeNull();

  await john.fillOrder(orderId, cost, numShares.div(2), "42");

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market
  orders = await api.route("getOrders", {
    marketId: market.address,
  });
  order = orders[market.address][0]["0"][orderId];
  await expect(order.price).toEqual("0.22");
  await expect(order.amount).toEqual("0.0005");
  await expect(order.tokensEscrowed).toEqual("0.00011");
  await expect(order.sharesEscrowed).toEqual("0");
  await expect(order.orderState).toEqual(OrderState.FILLED);

  let allOrders: AllOrders = await api.route("getAllOrders", {
    account: john.account,
  });
  await expect(allOrders[orderId].tokensEscrowed).toEqual("0.00011");
  await expect(allOrders[orderId].sharesEscrowed).toEqual("0");

  // Change order Price
  const newPrice = new BigNumber(25);
  await john.setOrderPrice(orderId, newPrice, stringTo32ByteHex(""), stringTo32ByteHex(""));

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market
  orders = await api.route("getOrders", {
    marketId: market.address,
  });
  order = orders[market.address][0]["0"][orderId];
  await expect(order.price).toEqual("0.25");
  await expect(order.tokensEscrowed).toEqual("0.000125");

  allOrders = await api.route("getAllOrders", {
    account: john.account,
  });
  await expect(allOrders[orderId].tokensEscrowed).toEqual("0.000125");

  // Cancel order
  await john.cancelOrder(orderId);

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market
  orders = await api.route("getOrders", {
    marketId: market.address,
  });
  order = orders[market.address][0]["0"][orderId];
  await expect(order.price).toEqual("0");
  await expect(order.amount).toEqual("0");
  await expect(order.orderState).toEqual(OrderState.CANCELED);
  await expect(order.canceledTransactionHash).toEqual(order.transactionHash);

  allOrders = await api.route("getAllOrders", {
    account: john.account,
  });
  await expect(allOrders.orderId).toBeUndefined();

  // Get only Open orders
  orders = await api.route("getOrders", {
    marketId: market.address,
    orderState: OrderState.OPEN
  });
  await expect(orders).toEqual({});

  allOrders = await api.route("getAllOrders", {
    account: john.account,
  });
  await expect(allOrders).toEqual({});

  // Get Canceled orders
  orders = await api.route("getOrders", {
    marketId: market.address,
    orderState: OrderState.CANCELED
  });
  order = orders[market.address][0]["0"][orderId];
  await expect(order.price).toEqual("0");

  // Move time forward and place a new order
  const initialTimestamp = await john.getTimestamp();
  const newTimestamp = initialTimestamp.plus(24 * 60 * 60);
  await john.setTimestamp(newTimestamp);

  await john.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  const newOrderId = await john.getBestOrderId(bid, market.address, outcome);

  await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market after the initial time
  orders = await api.route("getOrders", {
    marketId: market.address,
    latestCreationTime: initialTimestamp.plus(1).toNumber()
  });
  order = orders[market.address][0]["0"][orderId];
  await expect(order.orderId).toEqual(orderId);

  // Get order for the market before the new time
  orders = await api.route("getOrders", {
    marketId: market.address,
    earliestCreationTime: initialTimestamp.plus(1).toNumber()
  });
  order = orders[market.address][0]["0"][newOrderId];
  await expect(order.orderId).toEqual(newOrderId);

}, 60000);

test("State API :: Trading :: getBetterWorseOrders", async () => {
  await john.approveCentralAuthority();

  // Create a market
  const market = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B")]);

  // Place orders of varying price
  const bid = new BigNumber(0);
  const outcome = new BigNumber(0);
  const numShares = new BigNumber(10000000000000);
  const lowPrice = new BigNumber(10);
  const highPrice = new BigNumber(20);
  await john.placeOrder(market.address, bid, numShares, lowPrice, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  const lowOrderId = await john.getBestOrderId(bid, market.address, outcome);
  await john.placeOrder(market.address, bid, numShares, highPrice, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  const highOrderId = await john.getBestOrderId(bid, market.address, outcome);


  await (await db).sync(john.augur, mock.constants.chunkSize, 0);

  // Get better worse order ids for a price in the middle
  let betterWorseOrders = await api.route("getBetterWorseOrders", {
    marketId: market.address,
    outcome: outcome.toNumber(),
    orderType: "buy",
    price: 0.15,
  });

  await expect(betterWorseOrders.betterOrderId).toEqual(highOrderId);
  await expect(betterWorseOrders.worseOrderId).toEqual(lowOrderId);

  // Get better worse order ids for a high price
  betterWorseOrders = await api.route("getBetterWorseOrders", {
    marketId: market.address,
    outcome: outcome.toNumber(),
    orderType: "buy",
    price: 0.25,
  });

  await expect(betterWorseOrders.betterOrderId).toEqual(null);
  await expect(betterWorseOrders.worseOrderId).toEqual(highOrderId);

  // Get better worse order ids for a low price
  betterWorseOrders = await api.route("getBetterWorseOrders", {
    marketId: market.address,
    outcome: outcome.toNumber(),
    orderType: "buy",
    price: 0.05,
  });

  await expect(betterWorseOrders.betterOrderId).toEqual(lowOrderId);
  await expect(betterWorseOrders.worseOrderId).toEqual(null);

}, 60000);
