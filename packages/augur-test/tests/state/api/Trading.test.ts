import {
  ACCOUNTS,
  makeDbMock,
  deployContracts,
  ContractAPI,
} from "../../../libs";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { API } from "@augurproject/state/src/api/API";
import { DB } from "@augurproject/state/src/db/DB";
import { MarketTradingHistory, Orders } from "@augurproject/state/src/api/Trading";
import { ethers } from "ethers";
import { stringTo32ByteHex } from "../../../libs/Utils";

const mock = makeDbMock();

let db: DB<any>;
let api: API<any>;
let john: ContractAPI;
let mary: ContractAPI;

beforeAll(async () => {
  const {provider, addresses} = await deployContracts(ACCOUNTS, compilerOutput);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS, 1, provider, addresses);
  db = await mock.makeDB(john.augur, ACCOUNTS);
  api = new API<any>(john.augur, db);
}, 120000);
/*
test("State API :: Trading :: getTradingHistory", async () => {
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  // Create a market
  const market = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B")]);

  // Place an order
  const bid = new ethers.utils.BigNumber(0);
  const outcome = new ethers.utils.BigNumber(0);
  const numShares = new ethers.utils.BigNumber(10000000000000);
  const price = new ethers.utils.BigNumber(22);
  await john.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Take half the order using the same account
  const cost = numShares.mul(78).div(2);
  const orderId = await john.getBestOrderId(bid, market.address, outcome);
  await john.fillOrder(orderId, cost, numShares.div(2), "42");

  // And the rest using another account
  await mary.fillOrder(orderId, cost, numShares.div(2), "43");

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  // Get trades by user
  let trades: Array<MarketTradingHistory> = await api.route("getTradingHistory", {
    account: mary.account,
  });

  await expect(trades).toHaveLength(1);

  const trade = trades[0];
  await expect(trade.price).toEqual("0.0022");
  await expect(trade.type).toEqual("sell");
  await expect(trade.amount).toEqual("0.05");
  await expect(trade.maker).toEqual(false);
  await expect(trade.outcome).toEqual(0);
  await expect(trade.selfFilled).toEqual(false);

  // Get trades by market
  trades = await api.route("getTradingHistory", {
    marketId: market.address,
  });

  await expect(trades).toHaveLength(2);

}, 60000);
*/
test("State API :: Trading :: getOrders", async () => {
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  // Create a market
  const market = await john.createReasonableMarket(john.augur.contracts.universe, [stringTo32ByteHex("A"), stringTo32ByteHex("B")]);

  // Place an order
  const bid = new ethers.utils.BigNumber(0);
  const outcome = new ethers.utils.BigNumber(0);
  const numShares = new ethers.utils.BigNumber(10000000000000);
  const price = new ethers.utils.BigNumber(22);
  await john.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));

  // Take half the order using the same account
  const cost = numShares.mul(78).div(2);
  const orderId = await john.getBestOrderId(bid, market.address, outcome);
  await john.fillOrder(orderId, cost, numShares.div(2), "42");

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market
  let orders: Orders = await api.route("getOrders", {
    marketId: market.address,
  });

  let order = orders[market.address][0]["0"][orderId];
  await expect(order.price).toEqual("0.22");
  await expect(order.amount).toEqual("0.0005");
  await expect(order.tokensEscrowed).toEqual("0.00011");
  await expect(order.sharesEscrowed).toEqual("0");

  // Change order Price
  const newPrice = new ethers.utils.BigNumber(25);
  await john.setOrderPrice(orderId, newPrice, stringTo32ByteHex(""), stringTo32ByteHex(""));

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market
  orders = await api.route("getOrders", {
    marketId: market.address,
  });

  order = orders[market.address][0]["0"][orderId];
  await expect(order.price).toEqual("0.25");
  await expect(order.tokensEscrowed).toEqual("0.000125");

  // Cancel order
  await john.cancelOrder(orderId);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market
  orders = await api.route("getOrders", {
    marketId: market.address,
  });

  order = orders[market.address][0]["0"][orderId];
  await expect(order.price).toEqual("0");
  await expect(order.amount).toEqual("0");
  await expect(order.orderState).toEqual("CANCELED");
  await expect(order.canceledTransactionHash).toEqual(order.transactionHash);

  // Get only Open orders
  orders = await api.route("getOrders", {
    marketId: market.address,
    orderState: "OPEN"
  });

  await expect (orders).toEqual({});

  // Get Canceled orders
  orders = await api.route("getOrders", {
    marketId: market.address,
    orderState: "CANCELED"
  });

  order = orders[market.address][0]["0"][orderId];
  await expect(order.price).toEqual("0");

  // Move time forward and place a new order
  const initialTimestamp = await john.getTimestamp();
  const newTimestamp = initialTimestamp.add(24 * 60 * 60);
  await john.setTimestamp(newTimestamp);

  await john.placeOrder(market.address, bid, numShares, price, outcome, stringTo32ByteHex(""), stringTo32ByteHex(""), stringTo32ByteHex("42"));
  const newOrderId = await john.getBestOrderId(bid, market.address, outcome);

  await db.sync(john.augur, mock.constants.chunkSize, 0);

  // Get orders for the market after the initial time
  orders = await api.route("getOrders", {
    marketId: market.address,
    latestCreationTime: initialTimestamp.add(1).toNumber()
  });

  order = orders[market.address][0]["0"][orderId];
  await expect(order.orderId).toEqual(orderId);

  // Get order for the market before the new time
  orders = await api.route("getOrders", {
    marketId: market.address,
    earliestCreationTime: initialTimestamp.add(1).toNumber()
  });

  order = orders[market.address][0]["0"][newOrderId];
  await expect(order.orderId).toEqual(newOrderId);

}, 60000);
