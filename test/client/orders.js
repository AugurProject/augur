/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));

var accounts = [
    augur.from,
    "0x0da70d5a92d6cfcd4c12e2a83950676fdf4c95f9",
    "0x4a0cf714e2c1b785ff2d650320acf63be9eb25c6",
    "0xef2b2ba637921b8cf51b8a89576666a5d4322c69",
    "0xf0c4ee355432a7c7da12bdef04543723d110d591"
];
var markets = augur.getMarketsInBranch(augur.branches.dev);
var marketId = markets[markets.length - 1];

describe("orders.create", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            var orders = augur.orders.create(t);
            assert.isObject(orders);
            assert.property(orders, t.market);
            assert.property(orders[t.market], t.outcome.toString());
            assert.isArray(orders[t.market][t.outcome]);
            assert.isAbove(orders[t.market][t.outcome].length, 0);
            var numOrders = orders[t.market][t.outcome].length;
            for (var i = 0; i < numOrders; ++i) {
                assert.property(orders[t.market][t.outcome][i], "price");
                assert.property(orders[t.market][t.outcome][i], "amount");
                assert.property(orders[t.market][t.outcome][i], "expiration");
                assert.property(orders[t.market][t.outcome][i], "cap");
            }
            var lastOrder = orders[t.market][t.outcome][numOrders-1];
            assert.strictEqual(lastOrder.price, t.price);
            assert.strictEqual(lastOrder.amount, t.amount);
            assert.strictEqual(lastOrder.expiration, t.expiration);
            assert.strictEqual(lastOrder.cap, t.cap);
        });
    };
    test({
        account: accounts[0],
        market: marketId,
        outcome: 1,
        price: "0.25",
        amount: "1.2",
        expiration: 0,
        cap: 0
    });
    test({
        account: accounts[0],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "1.2",
        expiration: 0,
        cap: 0
    });
    test({
        account: accounts[0],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "0.2",
        expiration: 100,
        cap: 0
    });
    test({
        account: accounts[1],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "0.2",
        expiration: 0,
        cap: 10
    });
    test({
        account: accounts[1],
        market: marketId,
        outcome: 1,
        price: "0.25",
        amount: "1.2",
        expiration: 100,
        cap: 10
    });
});

describe("orders.get", function () {
    var test = function (t) {
        it("account=" + t.account, function () {
            var orders = augur.orders.get(t.account);
            if (t.expected === "object") {
                assert.isObject(orders);
                assert.isAbove(Object.keys(orders).length, 0);
                for (var market in orders) {
                    if (!orders.hasOwnProperty(market)) continue;
                    assert.isObject(orders[market]);
                    assert.isAbove(Object.keys(orders[market]).length, 0);
                    for (var outcome in orders[market]) {
                        if (orders[market].hasOwnProperty(outcome)) continue;
                        assert.isArray(orders[market][outcome]);
                        assert.isAbove(orders[market][outcome].length, 0);
                        for (var i = 0, n = orders[market][outcome].length; i < n; ++i) {
                            assert.property(orders[market][outcome][i], "price");
                            assert.property(orders[market][outcome][i], "amount");
                            assert.property(orders[market][outcome][i], "expiration");
                            assert.property(orders[market][outcome][i], "cap");
                            assert.isString(orders[market][outcome][i].price);
                            assert.isString(orders[market][outcome][i].amount);
                            assert.isNumber(orders[market][outcome][i].expiration);
                            assert.isNumber(orders[market][outcome][i].cap);
                        }
                    }
                }
            } else {
                assert.isNull(orders);
            }
        });
    };
    test({account: accounts[0], expected: "object"});
    test({account: accounts[1], expected: "object"});
    test({account: accounts[2], expected: null});
    test({account: accounts[3], expected: null});
    test({account: accounts[4], expected: null});
});

describe("orders.cancel", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            var orders = augur.orders.create(t);
            var numOrders = orders[t.market][t.outcome].length;
            var orderId = orders[t.market][t.outcome][numOrders-1].id;
            var updated = augur.orders.cancel(t.account, t.market, t.outcome, orderId);
            assert.strictEqual(updated[t.market][t.outcome].length, numOrders-1);
        });
    };
    test({
        account: accounts[0],
        market: marketId,
        outcome: 1,
        price: "0.25",
        amount: "1.2",
        expiration: 0,
        cap: 0
    });
    test({
        account: accounts[0],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "1.2",
        expiration: 0,
        cap: 0
    });
    test({
        account: accounts[0],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "0.2",
        expiration: 100,
        cap: 0
    });
    test({
        account: accounts[1],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "0.2",
        expiration: 0,
        cap: 10
    });
    test({
        account: accounts[1],
        market: marketId,
        outcome: 1,
        price: "0.25",
        amount: "1.2",
        expiration: 100,
        cap: 10
    });
});

describe("orders.reset", function () {
    var test = function (t) {
        it("account=" + t.account, function () {
            assert.isTrue(augur.orders.reset(t.account));
            assert.isNull(augur.orders.get(t.account));
        });
    };
    for (var i = 0; i < accounts.length; ++i) {
        test({account: accounts[i]});
    }
});

describe("orders.limit.sharesToTrade", function () {
    var test = function (t) {
        it(JSON.stringify(t), function () {
            var shares = augur.orders.limit.sharesToTrade(t.q, t.outcome, t.alpha, t.cap, t.isBuy);
            assert.notProperty(shares, "error");
            var zero = augur.orders.limit.f(shares, augur.utils.toDecimal(t.q), t.outcome, augur.utils.toDecimal(t.alpha), augur.utils.toDecimal(t.cap));
            assert.closeTo(zero.toNumber(), 0, 1e-12);
            assert.strictEqual(abi.number(shares).toFixed(5), t.expected);
        });
    };
    test({
        q: [10, 10, 10, 10, 10],
        outcome: 1,
        alpha: "0.0079",
        cap: "0.3",
        expected: "0.18974",
        isBuy: true
    });
    test({
        q: [10, 10, 10, 10, 10],
        outcome: 1,
        alpha: "0.0079",
        cap: "0.6",
        expected: "0.70132",
        isBuy: true
    });
    test({
        q: [10, 10, 10, 10, 10],
        outcome: 1,
        alpha: "0.0079",
        cap: "0.9",
        expected: "1.43950",
        isBuy: true
    });
    test({
        q: [5, 6, 10, 13, 10, 2, 1, 12, 1],
        outcome: 1,
        alpha: "0.0079",
        cap: "0.3",
        expected: "6.49217",
        isBuy: true
    });
    test({
        q: [5, 6, 10, 13, 10, 2, 1, 12, 1],
        outcome: 1,
        alpha: "0.0079",
        cap: "0.6",
        expected: "7.22194",
        isBuy: true
    });
    test({
        q: [5, 6, 10, 13, 10, 2, 1, 12, 1],
        outcome: 1,
        alpha: "0.0079",
        cap: "0.9",
        expected: "8.21047",
        isBuy: true
    });
    test({
        q: [5, 6, 10, 13, 10, 2, 1, 12, 1],
        outcome: 1,
        alpha: "0.0079",
        cap: "0.1",
        expected: "-28.33089",
        isBuy: false
    });
});

describe("checkOrder", function () {
    var test = function (t) {
        it("market=" + t.market + ", outcome=" + t.outcome + ", order=" + JSON.stringify(t.order), function (done) {
            this.timeout(augur.constants.TIMEOUT);
            var Price = augur.price;
            var Trade = augur.trade;
            augur.price = function (price) { return t.currentPrice; };
            augur.trade = function (trade) {
                assert.strictEqual(trade.branch, t.order.branch);
                assert.strictEqual(trade.market, t.order.market);
                assert.strictEqual(trade.outcome, t.order.outcome);
                assert.strictEqual(trade.amount, abi.string(t.order.amount));
                trade.callbacks.onTradeSent();
                var updated = augur.orders.cancel(
                    t.order.account,
                    t.order.market,
                    t.order.outcome,
                    orderId
                );
                assert.strictEqual(updated[t.order.market][t.order.outcome].length, numOrders-1);
                trade.callbacks.onTradeSuccess();
            };
            var orders = augur.orders.create(t.order);
            var numOrders = orders[t.order.market][t.order.outcome].length;
            var orderId = orders[t.order.market][t.order.outcome][numOrders-1].id;
            augur.getMarketInfo(t.market, function (info) {
                augur.checkOrder(info, t.outcome, t.order, {
                    onPriceMatched: function (order) {
                        assert.strictEqual(JSON.stringify(order), JSON.stringify(t.order));
                    },
                    nextOrder: function () {
                        augur.price = Price;
                        augur.trade = Trade;
                        done();
                    }
                });
            });
        });
    };
    test({
        currentPrice: "0.49",
        market: marketId,
        outcome: 1,
        order: {
            account: augur.from,
            market: marketId,
            branch: augur.branches.dev,
            outcome: 1,
            price: new BigNumber("0.5"),
            amount: new BigNumber("1.2"),
            expiration: 0,
            cap: 0
        }
    });
    test({
        currentPrice: "0.51",
        market: marketId,
        outcome: 1,
        order: {
            account: augur.from,
            market: marketId,
            branch: augur.branches.dev,
            outcome: 1,
            price: "0.5",
            amount: "-1.2",
            expiration: 0,
            cap: 0
        }
    });
});

describe("checkOutcomeOrderList", function () {
    var test = function (t) {
        it("account=" + t.account + ", market=" + t.market + ", outcome=" + t.outcome, function (done) {
            this.timeout(augur.constants.TIMEOUT);
            var checkOrder = augur.checkOrder;
            augur.checkOrder = function (marketInfo, outcome, order, cb) {
                assert.isObject(marketInfo);
                assert.strictEqual(marketInfo._id, t.market);
                assert.strictEqual(outcome, t.outcome);
                assert.include(orderList, order);
                assert.isObject(order);
                assert.property(order, "price");
                assert.property(order, "amount");
                assert.property(order, "expiration");
                assert.property(order, "cap");
                cb.nextOrder(order);
            };
            var orders = augur.orders.create(t);
            var orderList = orders[t.market][t.outcome];
            augur.getMarketInfo(t.market, function (info) {
                augur.checkOutcomeOrderList(info, t.outcome, orderList, function (matchedOrders) {
                    assert.notProperty(matchedOrders, "error");
                    assert.isArray(matchedOrders);
                    assert.strictEqual(matchedOrders.length, 1);
                    assert.isTrue(augur.orders.reset(t.account));
                    augur.checkOrder = checkOrder;
                    done();
                });
            });
        });
    };
    test({
        account: accounts[0],
        market: marketId,
        outcome: 1,
        price: "0.25",
        amount: "1.2",
        expiration: 0,
        cap: 0
    });
    test({
        account: accounts[0],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "1.2",
        expiration: 0,
        cap: 0
    });
    test({
        account: accounts[0],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "0.2",
        expiration: 100,
        cap: 0
    });
    test({
        account: accounts[1],
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "0.2",
        expiration: 0,
        cap: 10
    });
    test({
        account: accounts[1],
        market: marketId,
        outcome: 1,
        price: "0.25",
        amount: "1.2",
        expiration: 100,
        cap: 10
    });
});

describe("checkOrderBook", function () {
    var test = function (t) {
        it("market=" + t.market + ", order=" + JSON.stringify(t), function (done) {
            this.timeout(augur.constants.TIMEOUT);
            var checkOutcomeOrderList = augur.checkOutcomeOrderList;
            augur.checkOutcomeOrderList = function (marketInfo, outcome, orderList, cb) {
                assert.isObject(marketInfo);
                assert.strictEqual(marketInfo._id, t.market);
                assert.isArray(orderList);
                cb.nextOutcome(orderList);
            };
            var orders = augur.orders.create(t);
            augur.checkOrderBook(t.market, function (matchedOrders) {
                assert.notProperty(matchedOrders, "error");
                assert.isArray(matchedOrders);
                assert.strictEqual(matchedOrders.length, 1);
                assert.isTrue(augur.orders.reset(t.account));
                augur.checkOutcomeOrderList = checkOutcomeOrderList;
                done();
            });
        });
    };
    test({
        account: augur.from,
        market: marketId,
        outcome: 1,
        price: "0.25",
        amount: "1.2",
        expiration: 0,
        cap: 0
    });
    test({
        account: augur.from,
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "1.2",
        expiration: 0,
        cap: 0
    });
    test({
        account: augur.from,
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "0.2",
        expiration: 100,
        cap: 0
    });
    test({
        account: augur.from,
        market: marketId,
        outcome: 2,
        price: "0.75",
        amount: "0.2",
        expiration: 0,
        cap: 10
    });
    test({
        account: augur.from,
        market: marketId,
        outcome: 1,
        price: "0.25",
        amount: "1.2",
        expiration: 100,
        cap: 10
    });
});
