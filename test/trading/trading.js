/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var join = require("path").join;
var assert = require("chai").assert;
var async = require("async");
var abi = require("augur-abi");
var clone = require("clone");
var augurpath = "../../src/index";
var augur = require(augurpath);
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var tools = require("../tools");
var random = require("../random");
var errors = require("augur-contracts").errors;
var abacus = require("../../src/modules/abacus");
var trade = require("../../src/modules/trade");
var DEBUG = false;

describe("Unit tests", function () {

    describe("abacus.calculateTradingCost", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {
                var adjustedTradingFee = abacus.calculateAdjustedTradingFee(abi.bignum(t.tradingFee), abi.bignum(t.price), abi.bignum(t.range));
                assert(adjustedTradingFee.eq(abi.bignum(t.expected)));
            });
        };
        test({
            tradingFee: "0.02",
            price: "0.5",
            range: 1,
            expected: "0.02"
        });
        test({
            tradingFee: "0.02",
            price: "1",
            range: 1,
            expected: "0"
        });
        test({
            tradingFee: "0.02",
            price: "0",
            range: 1,
            expected: "0"
        });
        test({
            tradingFee: "0.02",
            price: "0.75",
            range: 1,
            expected: "0.015"
        });
        test({
            tradingFee: "0.08",
            price: "0.75",
            range: 1,
            expected: "0.06"
        });
        test({
            tradingFee: "0.02",
            price: "0.5",
            range: 2,
            expected: "0.015"
        });
        test({
            tradingFee: "0.02",
            price: "1",
            range: 2,
            expected: "0.02"
        });
        test({
            tradingFee: "0.02",
            price: "0",
            range: 2,
            expected: "0"
        });
        test({
            tradingFee: "0.02",
            price: "0.75",
            range: 2,
            expected: "0.01875"
        });
        test({
            tradingFee: "0.08",
            price: "0.75",
            range: 2,
            expected: "0.075"
        });
    });

    describe("abacus.calculateTradingCost", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {
                var tradingCost = abacus.calculateTradingCost(t.amount, t.price, t.tradingFee, t.range);
                assert.strictEqual(tradingCost.fee.toFixed(), t.expected.fee);
                assert.strictEqual(tradingCost.percentFee.toFixed(), t.expected.percentFee);
                assert.strictEqual(tradingCost.cost.toFixed(), t.expected.cost);
            });
        };
        test({
            amount: 1,
            price: "0.5",
            tradingFee: "0.02",
            range: 1,
            expected: {
                fee: "0.01",
                percentFee: "0.02",
                cost: "0.51"
            }
        });
        test({
            amount: 2,
            price: "0.5",
            tradingFee: "0.02",
            range: 1,
            expected: {
                fee: "0.02",
                percentFee: "0.02",
                cost: "1.02"
            }
        });
        test({
            amount: 1,
            price: "0.5",
            tradingFee: "0.02",
            range: 2,
            expected: {
                fee: "0.0075",
                percentFee: "0.015",
                cost: "0.5075"
            }
        });
        test({
            amount: 1,
            price: "1",
            tradingFee: "0.02",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "1"
            }
        });
        test({
            amount: 2,
            price: "1",
            tradingFee: "0.02",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "2"
            }
        });
        test({
            amount: 2,
            price: "1",
            tradingFee: "0.02",
            range: 2,
            expected: {
                fee: "0.04",
                percentFee: "0.02",
                cost: "2.04"
            }
        });
        test({
            amount: 1,
            price: "0",
            tradingFee: "0.02",
            range: 2,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0"
            }
        });
        test({
            amount: 2,
            price: "0",
            tradingFee: "0.02",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0"
            }
        });
        test({
            amount: 1,
            price: "0",
            tradingFee: "0.02",
            range: 2,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.02",
            range: 1,
            expected: {
                fee: "0.01125",
                percentFee: "0.015",
                cost: "0.76125"
            }
        });
        test({
            amount: 2,
            price: "0.75",
            tradingFee: "0.02",
            range: 1,
            expected: {
                fee: "0.0225",
                percentFee: "0.015",
                cost: "1.5225"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.02",
            range: 2,
            expected: {
                fee: "0.0140625",
                percentFee: "0.01875",
                cost: "0.7640625"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.08",
            range: 1,
            expected: {
                fee: "0.045",
                percentFee: "0.06",
                cost: "0.795"
            }
        });
        test({
            amount: 2,
            price: "0.75",
            tradingFee: "0.08",
            range: 1,
            expected: {
                fee: "0.09",
                percentFee: "0.06",
                cost: "1.59"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.08",
            range: 2,
            expected: {
                fee: "0.05625",
                percentFee: "0.075",
                cost: "0.80625"
            }
        });
    });

    describe("abacus.maxOrdersPerTrade", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {
                var maxOrders = abacus.maxOrdersPerTrade(t.type, t.gasLimit);
                assert.strictEqual(maxOrders, t.expected);
            });
        };
        test({type: "sell", expected: 4});
        test({type: "buy", expected: 4});
        test({type: "sell", gasLimit: 3135000, expected: 4});
        test({type: "buy", gasLimit: 3135000, expected: 4});
        test({type: "sell", gasLimit: 3500000, expected: 5});
        test({type: "buy", gasLimit: 3500000, expected: 5});
        test({type: "sell", gasLimit: 4250000, expected: 6});
        test({type: "buy", gasLimit: 4250000, expected: 6});
        test({type: "sell", gasLimit: 4712388, expected: 7});
        test({type: "buy", gasLimit: 4712388, expected: 6});
        test({type: "sell", gasLimit: 10000000, expected: 16});
        test({type: "buy", gasLimit: 10000000, expected: 14});
        test({type: "sell", gasLimit: 100000000, expected: 162});
        test({type: "buy", gasLimit: 100000000, expected: 150});
    });

    describe("abacus.sumTradeGas", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {
                assert.strictEqual(abacus.sumTradeGas(t.tradeTypes), t.expected);
            });
        };
        test({
            tradeTypes: ["buy"],
            expected: constants.TRADE_GAS[0].buy
        });
        test({
            tradeTypes: ["sell"],
            expected: constants.TRADE_GAS[0].sell
        });
        test({
            tradeTypes: ["buy", "buy"],
            expected: constants.TRADE_GAS[0].buy + constants.TRADE_GAS[1].buy
        });
        test({
            tradeTypes: ["sell", "sell"],
            expected: constants.TRADE_GAS[0].sell + constants.TRADE_GAS[1].sell
        });
        test({
            tradeTypes: ["buy", "sell"],
            expected: constants.TRADE_GAS[0].buy + constants.TRADE_GAS[1].sell
        });
        test({
            tradeTypes: ["sell", "buy"],
            expected: constants.TRADE_GAS[0].sell + constants.TRADE_GAS[1].buy
        });
        test({
            tradeTypes: ["buy", "buy", "buy"],
            expected: constants.TRADE_GAS[0].buy + 2*constants.TRADE_GAS[1].buy
        });
        test({
            tradeTypes: ["sell", "sell", "sell"],
            expected: constants.TRADE_GAS[0].sell + 2*constants.TRADE_GAS[1].sell
        });
        test({
            tradeTypes: ["buy", "sell", "sell"],
            expected: constants.TRADE_GAS[0].buy + 2*constants.TRADE_GAS[1].sell
        });
        test({
            tradeTypes: ["sell", "buy", "buy"],
            expected: constants.TRADE_GAS[0].sell + 2*constants.TRADE_GAS[1].buy
        });
        test({
            tradeTypes: ["buy", "buy", "sell"],
            expected: constants.TRADE_GAS[0].buy + constants.TRADE_GAS[1].buy + constants.TRADE_GAS[1].sell
        });
        test({
            tradeTypes: ["sell", "sell", "buy"],
            expected: constants.TRADE_GAS[0].sell + constants.TRADE_GAS[1].sell + constants.TRADE_GAS[1].buy
        });
    });

    describe("trade.isUnderGasLimit", function () {
        before(function () {
            trade.rpc = {
                blockNumber: function (callback) {
                    if (!utils.is_function(callback)) return "0x1";
                    callback("0x1");
                },
            };
        });
        after(function () { delete trade.rpc; });
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                trade.rpc.getBlock = function (blockNumber, pending, callback) {
                    if (!utils.is_function(callback)) return {gasLimit: abi.hex(t.gasLimit)};
                    callback({gasLimit: abi.hex(t.gasLimit)});
                };
                assert.strictEqual(trade.isUnderGasLimit(t.tradeTypes, t.gasLimit), t.expected);
                assert.strictEqual(trade.isUnderGasLimit(t.tradeTypes), t.expected);
                trade.isUnderGasLimit(t.tradeTypes, t.gasLimit, function (isUnderGasLimit) {
                    assert.strictEqual(isUnderGasLimit, t.expected);
                    trade.isUnderGasLimit(t.tradeTypes, function (isUnderGasLimit) {
                        assert.strictEqual(isUnderGasLimit, t.expected);
                        trade.isUnderGasLimit(t.tradeTypes, null, function (isUnderGasLimit) {
                            assert.strictEqual(isUnderGasLimit, t.expected);
                            done();
                        });
                    });
                });
            });
        };
        test({
            tradeTypes: ["buy"],
            gasLimit: 3135000,
            expected: true
        });
        test({
            tradeTypes: ["sell", "buy"],
            gasLimit: 3135000,
            expected: true
        });
        test({
            tradeTypes: ["buy", "buy", "sell"],
            gasLimit: 3135000,
            expected: true
        });
        test({
            tradeTypes: ["sell", "buy", "sell", "buy"],
            gasLimit: 3135000,
            expected: true
        });
        test({
            tradeTypes: ["buy", "sell", "sell", "buy", "buy"],
            gasLimit: 3135000,
            expected: false
        });
        test({
            tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell"],
            gasLimit: 3135000,
            expected: false
        });
        test({
            tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell", "sell"],
            gasLimit: 3135000,
            expected: false
        });
        test({
            tradeTypes: ["buy", "buy", "buy", "buy", "buy", "buy", "buy"],
            gasLimit: 3135000,
            expected: false
        });
        test({
            tradeTypes: ["buy"],
            gasLimit: 4712388,
            expected: true
        });
        test({
            tradeTypes: ["sell", "buy"],
            gasLimit: 4712388,
            expected: true
        });
        test({
            tradeTypes: ["buy", "buy", "sell"],
            gasLimit: 4712388,
            expected: true
        });
        test({
            tradeTypes: ["sell", "buy", "sell", "buy"],
            gasLimit: 4712388,
            expected: true
        });
        test({
            tradeTypes: ["buy", "sell", "sell", "buy", "buy"],
            gasLimit: 4712388,
            expected: true
        });
        test({
            tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell"],
            gasLimit: 4712388,
            expected: true
        });
        test({
            tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell", "sell"],
            gasLimit: 4712388,
            expected: true
        });
        test({
            tradeTypes: ["buy", "buy", "buy", "buy", "buy", "buy", "buy"],
            gasLimit: 4712388,
            expected: false
        });
    });

    describe("trade.checkGasLimit", function () {
        this.timeout(tools.TIMEOUT);
        var mockTrades = {
            "0x1": {id: "0x1", type: "buy", owner: "0x1001001"},
            "0x2": {id: "0x2", type: "buy", owner: "0xdeadbeef"},
            "0x3": {id: "0x3", type: "buy", owner: "0xdeadbeef"},
            "0x4": {id: "0x4", type: "buy", owner: "0xdeadbeef"},
            "0x5": {id: "0x5", type: "buy", owner: "0xdeadbeef"},
            "0x6": {id: "0x6", type: "buy", owner: "0xdeadbeef"},
            "0x7": {id: "0x7", type: "buy", owner: "0xdeadbeef"},
            "0x8": {id: "0x8", type: "buy", owner: "0xdeadbeef"},
            "0x9": {id: "0x9", type: "sell", owner: "0xdeadbeef"},
            "0x10": {id: "0x10", type: "sell", owner: "0xdeadbeef"},
            "0x11": {id: "0x11", type: "sell", owner: "0xdeadbeef"},
            "0x12": {id: "0x12", type: "sell", owner: "0xdeadbeef"},
            "0x13": {id: "0x13", type: "sell", owner: "0xdeadbeef"},
            "0x14": {id: "0x14", type: "sell", owner: "0xdeadbeef"},
            "0x15": {id: "0x15", type: "sell", owner: "0xdeadbeef"},
            "0x16": {id: "0x16", type: "sell", owner: "0xdeadbeef"}
        }
        var checkGasLimit = augur.checkGasLimit;
        before(function () {
            trade.rpc = {
                blockNumber: function (callback) {
                    callback("0x1");
                }
            };
            trade.get_trade = function (trade_id, callback) {
                callback(mockTrades[trade_id]);
            };
            trade.errors = clone(errors);
        });
        after(function () {
            delete trade.rpc;
            delete trade.get_trade;
        });
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                trade.rpc.getBlock = function (blockNumber, pending, callback) {
                    callback({gasLimit: t.gasLimit});
                };
                trade.checkGasLimit(t.trade_ids, t.sender, function (err, trade_ids) {
                    assert.deepEqual(err, t.expected.error);
                    assert.deepEqual(trade_ids, t.expected.trade_ids);
                    done();
                });
            });
        };
        test({
            gasLimit: "0x47e7c4",
            sender: "0x42",
            trade_ids: ["0x1", "0x2", "0x3", "0x4"],
            expected: {
                error: null,
                trade_ids: ["0x1", "0x2", "0x3", "0x4"]
            }
        });
        test({
            gasLimit: "0x47e7c4",
            sender: "0x42",
            trade_ids: ["0x13", "0x14", "0x15", "0x16"],
            expected: {
                error: null,
                trade_ids: ["0x13", "0x14", "0x15", "0x16"]
            }
        });
        test({
            gasLimit: "0x47e7c4",
            sender: "0x42",
            trade_ids: ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6", "0x7", "0x8"],
            expected: {
                error: null,
                trade_ids: ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6"]
            }
        });
        test({
            gasLimit: "0x47e7c4",
            sender: "0x42",
            trade_ids: ["0x9", "0x10", "0x11", "0x12", "0x13", "0x14", "0x15", "0x16"],
            expected: {
                error: null,
                trade_ids: ["0x9", "0x10", "0x11", "0x12", "0x13", "0x14", "0x15"]
            }
        });
        test({
            gasLimit: "0x47e7c4",
            sender: "0x42",
            trade_ids: ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6", "0x7", "0x9"],
            expected: {
                error: errors.GAS_LIMIT_EXCEEDED,
                trade_ids: undefined
            }
        });
        test({
            gasLimit: "0x47e7c4",
            sender: "0x1001001",
            trade_ids: ["0x1", "0x2", "0x3"],
            expected: {
                error: {error: "-5", message: errors.trade["-5"]},
                trade_ids: undefined
            }
        });
    });

    describe("getTradingActions", function () {
        var txOriginal;
        before("getTradingActions", function () {
            txOriginal = augur.tx;
            augur.tx = new require('augur-contracts').Tx("2").functions;
        });

        after("getTradingActions", function () {
            augur.tx = txOriginal;
        });

        describe("buy actions", function () {
            runTestCase({
                description: "no asks",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "BID",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0288",
                        "costEth": "3",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "no limit price and no asks",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: null,
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 0);
                }
            });

            runTestCase({
                description: "no suitable asks",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {
                        "order1": {
                            id: "order1",
                            type: "sell",
                            amount: "5",
                            price: "0.7", // price too high
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            owner: "abcd1234", // user's ask
                            type: "sell",
                            amount: "5",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        },
                        "order3": {
                            id: "order3",
                            type: "sell",
                            amount: "5",
                            price: "0.6",
                            outcome: "differentOutcome" // different outcome
                        }
                    }
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "BID",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0288",
                        "costEth": "3",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "ask with same shares and price",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {
                        "order1": {
                            id: "order1",
                            type: "sell",
                            amount: "5",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    }
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "BUY",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "3",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "ask with less shares and same price",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {
                        "order1": {
                            id: "order1",
                            type: "sell",
                            amount: "2",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    }
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "BUY",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }, {
                        "action": "BID",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.01728",
                        "costEth": "1.8",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "ask with same shares and lower price",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {
                        "order1": {
                            id: "order1",
                            type: "sell",
                            amount: "5",
                            price: "0.4",
                            outcome: "outcomeasdf123"
                        }
                    }
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "BUY",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "2",
                        "avgPrice": "0.4"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "ask with less shares and lower price",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {
                        "order1": {
                            id: "order1",
                            type: "sell",
                            amount: "2",
                            price: "0.4",
                            outcome: "outcomeasdf123"
                        }
                    }
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "BUY",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "0.8",
                        "avgPrice": "0.4"
                    }, {
                        "action": "BID",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.01728",
                        "costEth": "1.8",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "asks with same shares and lower prices",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {
                        "order1": {
                            id: "order1",
                            type: "sell",
                            amount: "1",
                            price: "0.4",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "sell",
                            amount: "2",
                            price: "0.3",
                            outcome: "outcomeasdf123"
                        },
                        "order3": {
                            id: "order3",
                            type: "sell",
                            amount: "2",
                            price: "0.2",
                            outcome: "outcomeasdf123"
                        }
                    }
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "BUY",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0488",
                        "costEth": "1.4",
                        "avgPrice": "0.28"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "asks with less shares and lower price",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {
                        "order1": {
                            id: "order1",
                            type: "sell",
                            amount: "1",
                            price: "0.4",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "sell",
                            amount: "2",
                            price: "0.3",
                            outcome: "outcomeasdf123"
                        }
                    }
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "BUY",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.036",
                        "costEth": "1",
                        "avgPrice": "0.33333333333333333333"
                    }, {
                        "action": "BID",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.01152",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "no limit price specified and asks on order book",
                type: "buy",
                orderShares: "5",
                orderLimitPrice: null,
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {
                        "order1": {
                            id: "order1",
                            type: "sell",
                            amount: "1",
                            price: "0.4",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "sell",
                            amount: "2",
                            price: "0.3",
                            outcome: "outcomeasdf123"
                        }
                    }
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "BUY",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.036",
                        "costEth": "1",
                        "avgPrice": "0.33333333333333333333"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });
        });

        describe("sell actions", function () {
            runTestCase({
                description: "no bids, no position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SHORT_ASK",
                        "shares": "5",
                        "gasEth": "0.1254",
                        "feeEth": "0.0288",
                        "costEth": "-2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with same shares and prices, no position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "5",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SHORT_SELL",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "-2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });


            runTestCase({
                description: "bid with less amount and same price, position greater than remaining order shares",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "6",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "2",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }, {
                        "action": "ASK",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.01728",
                        "costEth": "1.8",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with less amount and same price, position smaller than remaining order shares",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "4",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "2",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 3);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }, {
                        "action": "ASK",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.01152",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }, {
                        "action": "SHORT_ASK",
                        "shares": "1",
                        "gasEth": "0.1254",
                        "feeEth": "0.00576",
                        "costEth": "-0.4",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });


            runTestCase({
                description: "bid with less amount and same price, no position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "2",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SHORT_SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "-0.8",
                        "avgPrice": "0.6"
                    }, {
                        "action": "SHORT_ASK",
                        "shares": "3",
                        "gasEth": "0.1254",
                        "feeEth": "0.01728",
                        "costEth": "-1.2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with same shares and higher price, no position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "5",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SHORT_SELL",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0168",
                        "costEth": "-1.5",
                        "avgPrice": "0.7"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with less shares and higher price, no position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "2",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SHORT_SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0168",
                        "costEth": "-0.6",
                        "avgPrice": "0.7"
                    }, {
                        "action": "SHORT_ASK",
                        "shares": "3",
                        "gasEth": "0.1254",
                        "feeEth": "0.01728",
                        "costEth": "-1.2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bids with less shares and higher prices, no position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SHORT_SELL",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.0296",
                        "costEth": "-0.7",
                        "avgPrice": "0.76666666666666666667"
                    }, {
                        "action": "SHORT_ASK",
                        "shares": "2",
                        "gasEth": "0.1254",
                        "feeEth": "0.01152",
                        "costEth": "-0.8",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bids with same shares and higher prices, no position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        },
                        "order3": {
                            id: "order3",
                            type: "buy",
                            amount: "2",
                            price: "0.9",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SHORT_SELL",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0368",
                        "costEth": "-0.9",
                        "avgPrice": "0.82"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "no limit price, bids with same shares, no position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: null,
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "0",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        },
                        "order3": {
                            id: "order3",
                            type: "buy",
                            amount: "2",
                            price: "0.9",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 0);
                }
            });

            runTestCase({
                description: "no bids, smaller position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "2",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "ASK",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.01152",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }, {
                        "action": "SHORT_ASK",
                        "shares": "3",
                        "gasEth": "0.1254",
                        "feeEth": "0.01728",
                        "costEth": "-1.2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with same shares and price, smaller position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "2",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "5",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }, {
                        "action": "SHORT_SELL",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "-1.2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with less shares and same price, smaller position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "2",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "2",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }, {
                        "action": "SHORT_ASK",
                        "shares": "3",
                        "gasEth": "0.1254",
                        "feeEth": "0.01728",
                        "costEth": "-1.2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with same shares and higher price, smaller position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "2",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "5",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0168",
                        "costEth": "1.4",
                        "avgPrice": "0.7"
                    }, {
                        "action": "SHORT_SELL",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.0168",
                        "costEth": "-0.9",
                        "avgPrice": "0.7"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with less shares and higher price, smaller position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "2",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "2",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0168",
                        "costEth": "1.4",
                        "avgPrice": "0.7"
                    }, {
                        "action": "SHORT_ASK",
                        "shares": "3",
                        "gasEth": "0.1254",
                        "feeEth": "0.01728",
                        "costEth": "-1.2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bids with less shares and higher prices, smaller position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "2",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 3);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0128",
                        "costEth": "1.6",
                        "avgPrice": "0.8"
                    }, {
                        "action": "SHORT_SELL",
                        "shares": "1",
                        "gasEth": "0.0627",
                        "feeEth": "0.0168",
                        "costEth": "-0.3",
                        "avgPrice": "0.7"
                    }, {
                        "action": "SHORT_ASK",
                        "shares": "2",
                        "gasEth": "0.1254",
                        "feeEth": "0.01152",
                        "costEth": "-0.8",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bids with same shares and higher prices, smaller position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "2",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        },
                        "order3": {
                            id: "order3",
                            type: "buy",
                            amount: "2",
                            price: "0.9",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0072",
                        "costEth": "1.8",
                        "avgPrice": "0.9"
                    }, {
                        "action": "SHORT_SELL",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.0296",
                        "costEth": "-0.7",
                        "avgPrice": "0.76666666666666666667"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "no limit price, bids with same shares, smaller position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: null,
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "2",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        },
                        "order3": {
                            id: "order3",
                            type: "buy",
                            amount: "2",
                            price: "0.9",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0072",
                        "costEth": "1.8",
                        "avgPrice": "0.9"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "no bids, same position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "5",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {},
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "ASK",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0288",
                        "costEth": "3",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with same shares and price, same position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "5",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "5",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SELL",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "3",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with less shares and same price, same position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "5",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "2",
                            price: "0.6",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0192",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }, {
                        "action": "ASK",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.01728",
                        "costEth": "1.8",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with same shares and higher price, same position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "5",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "5",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SELL",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0168",
                        "costEth": "3.5",
                        "avgPrice": "0.7"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bid with less shares and higher price, same position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "5",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "2",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.0168",
                        "costEth": "1.4",
                        "avgPrice": "0.7"
                    }, {
                        "action": "ASK",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.01728",
                        "costEth": "1.8",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bids with less shares and higher prices, same position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "5",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 2);
                    var expected = [{
                        "action": "SELL",
                        "shares": "3",
                        "gasEth": "0.0627",
                        "feeEth": "0.0296",
                        "costEth": "2.3",
                        "avgPrice": "0.76666666666666666667"
                    }, {
                        "action": "ASK",
                        "shares": "2",
                        "gasEth": "0.0627",
                        "feeEth": "0.01152",
                        "costEth": "1.2",
                        "avgPrice": "0.6"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "bids with same shares and higher prices, same position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: "0.6",
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "5",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        },
                        "order3": {
                            id: "order3",
                            type: "buy",
                            amount: "2",
                            price: "0.9",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SELL",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0368",
                        "costEth": "4.1",
                        "avgPrice": "0.82"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });

            runTestCase({
                description: "no limit price, bids with same shares, same position",
                type: "sell",
                orderShares: "5",
                orderLimitPrice: null,
                takerFee: "0.02",
                makerFee: "0.01",
                userPositionShares: "5",
                outcomeId: "outcomeasdf123",
                range: "1",
                marketOrderBook: {
                    buy: {
                        "order1": {
                            id: "order1",
                            type: "buy",
                            amount: "1",
                            price: "0.7",
                            outcome: "outcomeasdf123"
                        },
                        "order2": {
                            id: "order2",
                            type: "buy",
                            amount: "2",
                            price: "0.8",
                            outcome: "outcomeasdf123"
                        },
                        "order3": {
                            id: "order3",
                            type: "buy",
                            amount: "2",
                            price: "0.9",
                            outcome: "outcomeasdf123"
                        }
                    },
                    sell: {}
                },
                userAddress: "abcd1234",
                assertions: function (actions) {
                    assert.isArray(actions);
                    assert.lengthOf(actions, 1);
                    var expected = [{
                        "action": "SELL",
                        "shares": "5",
                        "gasEth": "0.0627",
                        "feeEth": "0.0368",
                        "costEth": "4.1",
                        "avgPrice": "0.82"
                    }];
                    assert.deepEqual(actions, expected);
                }
            });
        });

        function runTestCase(testCase) {
            it(testCase.description, function () {
                var actions = augur.getTradingActions({
                    type: testCase.type,
                    orderShares: testCase.orderShares,
                    orderLimitPrice: testCase.orderLimitPrice,
                    takerFee: testCase.takerFee,
                    makerFee: testCase.makerFee,
                    userAddress: testCase.userAddress,
                    userPositionShares: testCase.userPositionShares,
                    outcomeId: testCase.outcomeId,
                    range: testCase.range,
                    marketOrderBook: testCase.marketOrderBook
                });
                testCase.assertions(actions);
            });
        }
    });

    describe("makeTradeHash", function () {
        var augur;
        before(function () {
            augur = tools.setup(require(augurpath), process.argv.slice(2));
        });
        var test = function (t) {
            it(JSON.stringify(t), function () {
                this.timeout(tools.TIMEOUT);
                var trade_ids = t.trade_ids || random.hashArray(t.numTrades || random.int(1, 100));
                var tradeHash = augur.makeTradeHash(t.max_value, t.max_amount, trade_ids);
                var contractTradeHash = augur.Trades.makeTradeHash({
                    max_value: abi.fix(t.max_value, "hex"),
                    max_amount: abi.fix(t.max_amount, "hex"),
                    trade_ids: trade_ids
                });
                assert.strictEqual(tradeHash, contractTradeHash);
            });
        };
        test({max_value: 1, max_amount: 0, trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
        test({max_value: 0, max_amount: 1, trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
        test({max_value: 1, max_amount: 0, trade_ids: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]});
        test({max_value: 0, max_amount: 1, trade_ids: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]});
        test({max_value: 1, max_amount: 0, trade_ids: ["-0x8000000000000000000000000000000000000000000000000000000000000000"]});
        test({max_value: 0, max_amount: 1, trade_ids: ["-0x8000000000000000000000000000000000000000000000000000000000000000"]});
        test({max_value: "0x0", max_amount: "0x1", trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
        test({max_value: "0x1", max_amount: "0x0", trade_ids: ["0xb5865502c4ce95c1fd5178c975863dd9d412363934a7072fa4bad093190c786a"]});
        test({max_value: "0x0", max_amount: "0x1", trade_ids: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]});
        test({max_value: "0x1", max_amount: "0x0", trade_ids: ["0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]});
        test({max_value: "0x0", max_amount: "0x1", trade_ids: ["-0x4a79aafd3b316a3e02ae87368a79c2262bedc9c6cb58f8d05b452f6ce6f38796"]});
        test({max_value: "0x1", max_amount: "0x0", trade_ids: ["-0x4a79aafd3b316a3e02ae87368a79c2262bedc9c6cb58f8d05b452f6ce6f38796"]});
        test({max_value: "0x0", max_amount: "0x1", trade_ids: ["-0x8000000000000000000000000000000000000000000000000000000000000000"]});
        test({max_value: "0x1", max_amount: "0x0", trade_ids: ["-0x8000000000000000000000000000000000000000000000000000000000000000"]});
        for (var i = 1; i < 2; ++i) {
            for (var j = 1; j < 2; ++j) {
                for (var k = 1; k < 2; ++k) {
                    test({max_value: i, max_amount: j, numTrades: k});
                    test({max_value: i, max_amount: j});
                    test({max_value: random.int(1, i), max_amount: random.int(1, j), numTrades: random.int(1, k)});
                }
            }
        }
    });

    // describe("Trade.short_sell", function () {
    //     var mockOrderBook = {
    //         buy: {
    //             "0x1": {
    //                 id: "0x1",
    //                 type: "buy",
    //                 market: "0xa",
    //                 amount: "1",
    //                 price: "0.1",
    //                 owner: "0x1000000000000000000000000000000000000000"
    //             }
    //         },
    //         sell: {}
    //     };
    //     var checkGasLimit = augur.checkGasLimit;
    //     var commitTrade = augur.commitTrade;
    //     var rpc = {fastforward: augur.rpc.fastforward, receipt: augur.rpc.receipt};
    //     var transact = augur.transact;
    //     var test = function (t) {
    //         augur.checkGasLimit = function (trade_ids, sender, callback) {
    //             callback(null, trade_ids);
    //         };
    //         augur.commitTrade = function (p) {
    //             var txHash = "0xdeadbeef";
    //             p.onSent({txHash: txHash, callReturn: "1"});
    //             p.onSuccess({txHash: txHash, callReturn: "1"});
    //         };
    //         augur.rpc.fastforward = function (blocks, callback) {
    //             callback(10);
    //         };
    //         it(JSON.stringify(t), function (done) {
    //             augur.short_sell({
    //                 buyer_trade_id: t.buyer_trade_id,
    //                 max_amount: t.max_amount,
    //                 sender: t.sender,
    //                 onTradeHash: function (r) {
    //                     console.log("onTradeHash:", r);
    //                 },
    //                 onCommitSent: function (r) {
    //                     console.log("onCommitSent:", r);
    //                 }
    //                 onCommitSuccess: function (r) {
    //                     console.log("onCommitSuccess:", r);
    //                 },
    //                 onCommitFailed: function (e) {
    //                     console.log("onCommitFailed:", e);
    //                 },
    //                 onNextBlock: function (r) {
    //                     console.log("onNextBlock:", r);
    //                 },
    //                 onTradeSent: function (r) {
    //                     console.log("onTradeSent:", r);
    //                 },
    //                 onTradeSuccess: function (r) {
    //                     console.log("onTradeSuccess:", r);
    //                 },
    //                 onTradeFailed: function (e) {
    //                     console.log("onTradeFailed:", e);
    //                 }
    //             });
    //         });
    //     };
    //     test({
    //         buyer_trade_id: "0x1",
    //         max_amount: 1,
    //         sender: "0x2000000000000000000000000000000000000000"
    //     });
    // });

});

describe("Integration tests", function () {

    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;

    var augur = tools.setup(require(augurpath), process.argv.slice(2));
    augur.options.debug.trading = DEBUG;
    var password = fs.readFileSync(join(process.env.HOME, ".ethereum", ".password")).toString();
    var unlockable = augur.rpc.accounts();
    // var markets = {};
    var markets = {
        binary: "0x602e5982a16fded3a298dc1cc202d777925b7a98c95a0a3c09c8bcc7d1f936eb",
        categorical: "0x339203020b1a79c893969394a55418a7e1b5a87f05d219701915cd03638e6f42",
        scalar: "0x6b23d0d9e8c82b83ad93b3f6d2c7a2e667fad53b65272cb798eeeefa3c34de90"
    };

    before("Top-up accounts and create new markets", function (done) {
        this.timeout(tools.TIMEOUT*unlockable.length + tools.TIMEOUT*3);
        tools.top_up(augur, null, unlockable, password, function (err, unlocked) {
            assert.isNull(err, JSON.stringify(err));
            assert.isArray(unlocked);
            assert.isAbove(unlocked.length, 0);
            unlockable = clone(unlocked);
            var expiration = parseInt(new Date().getTime() / 995);
            tools.create_each_market_type(augur, null, expiration, function (err, newMarkets) {
                assert.isNull(err, JSON.stringify(err));
                assert.isObject(newMarkets);
                assert.isString(newMarkets.binary);
                assert.isString(newMarkets.categorical);
                assert.isString(newMarkets.scalar);
                assert.isNotNull(augur.getMarketInfo(newMarkets.binary));
                assert.isNotNull(augur.getMarketInfo(newMarkets.categorical));
                assert.isNotNull(augur.getMarketInfo(newMarkets.scalar));
                markets = clone(newMarkets);
                done();
            });
        });
    });

    beforeEach("Top-up accounts", function (done) {
        this.timeout(tools.TIMEOUT*unlockable.length);
        tools.top_up(augur, null, unlockable, password, function (err, unlocked) {
            assert.isNull(err, JSON.stringify(err));
            assert.isArray(unlocked);
            assert.isAbove(unlocked.length, 0);
            done();
        });
    });

    describe("trade.isUnderGasLimit", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                assert.strictEqual(augur.isUnderGasLimit(t.tradeTypes), t.expected);
                augur.isUnderGasLimit(t.tradeTypes, function (isUnderGasLimit) {
                    assert.strictEqual(isUnderGasLimit, t.expected);
                    augur.isUnderGasLimit(t.tradeTypes, null, function (isUnderGasLimit) {
                        assert.strictEqual(isUnderGasLimit, t.expected);
                        done();
                    });
                });
            });
        };
        test({
            tradeTypes: ["buy"],
            expected: true
        });
        test({
            tradeTypes: ["sell", "buy"],
            expected: true
        });
        test({
            tradeTypes: ["buy", "buy", "sell"],
            expected: true
        });
        test({
            tradeTypes: ["sell", "buy", "sell", "buy"],
            expected: true
        });
        test({
            tradeTypes: ["buy", "sell", "sell", "buy", "buy"],
            expected: true
        });
        test({
            tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell"],
            expected: true
        });
        test({
            tradeTypes: ["sell", "sell", "sell", "sell", "sell", "sell", "sell"],
            expected: true
        });
        test({
            tradeTypes: ["buy", "buy", "buy", "buy", "buy", "buy", "buy"],
            expected: false
        });
    });

    describe("BuyAndSellShares.buy", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(tools.TIMEOUT);
                augur.get_total_trades(markets[t.market], function (initialTotalTrades) {
                    initialTotalTrades = parseInt(initialTotalTrades);
                    augur.buy({
                        amount: t.amount,
                        price: t.price,
                        market: markets[t.market],
                        outcome: t.outcome,
                        onSent: function (r) {
                            assert.isString(r.txHash);
                            assert.isNull(r.callReturn);
                        },
                        onSuccess: function (r) {
                            assert.include(augur.get_trade_ids(markets[t.market]), abi.hex(r.callReturn));
                            augur.get_trade(r.callReturn, function (trade) {
                                assert.isObject(trade);
                                assert.approximately(Number(trade.amount), Number(t.amount), tools.EPSILON);
                                assert.approximately(Number(trade.price), Number(t.price), tools.EPSILON);
                                assert.strictEqual(abi.format_int256(trade.market), markets[t.market]);
                                assert.strictEqual(trade.outcome, t.outcome);
                                augur.get_total_trades(markets[t.market], function (totalTrades) {
                                    assert.isAbove(parseInt(totalTrades), initialTotalTrades);
                                    done();
                                });
                            });
                        },
                        onFailed: done
                    });
                });
            });
        };
        test({
            market: "binary",
            amount: 1,
            price: "0.5",
            outcome: "1"
        });
        test({
            market: "binary",
            amount: "0.25",
            price: "0.52",
            outcome: "1"
        });
        test({
            market: "binary",
            amount: "1.5",
            price: "0.1",
            outcome: "2"
        });
        test({
            market: "categorical",
            amount: 1,
            price: "0.5",
            outcome: "3"
        });
        test({
            market: "categorical",
            amount: "0.25",
            price: "0.52",
            outcome: "3"
        });
        test({
            market: "categorical",
            amount: "1.5",
            price: "0.1",
            outcome: "7"
        });
        test({
            market: "scalar",
            amount: 1,
            price: "2.5",
            outcome: "1"
        });
        test({
            market: "scalar",
            amount: "0.25",
            price: "2.6",
            outcome: "1"
        });
        test({
            market: "scalar",
            amount: "1.5",
            price: "1.2",
            outcome: "2"
        });
    });

    describe("BuyAndSellShares.sell", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(tools.TIMEOUT);
                var initShares = augur.getParticipantSharesPurchased(markets[t.market], augur.from, t.outcome);
                augur.buyCompleteSets({
                    market: markets[t.market],
                    amount: t.amount,
                    onSent: function (r) {
                        assert.isNull(r.callReturn);
                    },
                    onSuccess: function (r) {
                        var finalShares = augur.getParticipantSharesPurchased(markets[t.market], augur.from, t.outcome);
                        assert.strictEqual(parseFloat(finalShares - initShares), parseFloat(t.amount));
                        augur.get_total_trades(markets[t.market], function (initialTotalTrades) {
                            initialTotalTrades = parseInt(initialTotalTrades);
                            augur.sell({
                                amount: t.amount,
                                price: t.price,
                                market: markets[t.market],
                                outcome: t.outcome,
                                onSent: function (r) {
                                    assert.isString(r.txHash);
                                    assert.isNull(r.callReturn);
                                },
                                onSuccess: function (r) {
                                    assert.include(augur.get_trade_ids(markets[t.market]), abi.hex(r.callReturn));
                                    augur.get_trade(r.callReturn, function (trade) {
                                        assert.isObject(trade);
                                        assert.approximately(Number(trade.amount), Number(t.amount), tools.EPSILON);
                                        assert.approximately(Number(trade.price), Number(t.price), tools.EPSILON);
                                        assert.strictEqual(abi.format_int256(trade.market), markets[t.market]);
                                        assert.strictEqual(trade.outcome, t.outcome);
                                        augur.get_total_trades(markets[t.market], function (totalTrades) {
                                            assert.isAbove(parseInt(totalTrades), initialTotalTrades);
                                            done();
                                        });
                                    });
                                },
                                onFailed: done
                            });
                        });
                    },
                    onFailed: done
                });
            });
        };
        test({
            market: "binary",
            amount: 1,
            price: "0.5",
            outcome: "1"
        });
        test({
            market: "binary",
            amount: "0.25",
            price: "0.52",
            outcome: "1"
        });
        test({
            market: "binary",
            amount: "1.5",
            price: "0.9",
            outcome: "2"
        });
        test({
            market: "categorical",
            amount: 1,
            price: "0.5",
            outcome: "3"
        });
        test({
            market: "categorical",
            amount: "0.25",
            price: "0.52",
            outcome: "3"
        });
        test({
            market: "categorical",
            amount: "1.5",
            price: "0.9",
            outcome: "7"
        });
        test({
            market: "scalar",
            amount: 1,
            price: "2.5",
            outcome: "1"
        });
        test({
            market: "scalar",
            amount: "0.25",
            price: "2.6",
            outcome: "1"
        });
        test({
            market: "scalar",
            amount: "1.5",
            price: "1.2",
            outcome: "2"
        });
    });

    describe("BuyAndSellShares.cancel", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(tools.TIMEOUT);
                augur.buyCompleteSets({
                    market: markets[t.market],
                    amount: t.amount,
                    onSent: utils.noop,
                    onSuccess: function (r) {
                        augur.sell({
                            amount: t.amount,
                            price: t.price,
                            market: markets[t.market],
                            outcome: t.outcome,
                            onSent: function (r) {
                                assert(r.txHash);
                                assert.isNull(r.callReturn);
                            },
                            onSuccess: function (r) {
                                assert(r.txHash);
                                assert.isNotNull(r.callReturn);
                                assert.include(augur.get_trade_ids(markets[t.market]), abi.hex(r.callReturn));
                                augur.cancel(r.callReturn, function (r) {
                                    assert.isNull(r.callReturn);
                                }, function (r) {
                                    assert(r.txHash);
                                    assert.strictEqual(r.callReturn, "1");
                                    done();
                                }, done);
                            },
                            onFailed: done
                        });
                    },
                    onFailed: done
                });
            });
        };
        test({
            market: "binary",
            amount: 1,
            price: "0.5",
            outcome: "1"
        });
        test({
            market: "binary",
            amount: "0.25",
            price: "0.52",
            outcome: "1"
        });
        test({
            market: "binary",
            amount: "1.5",
            price: "0.1",
            outcome: "2"
        });
        test({
            market: "categorical",
            amount: 1,
            price: "0.5",
            outcome: "3"
        });
        test({
            market: "categorical",
            amount: "0.25",
            price: "0.52",
            outcome: "3"
        });
        test({
            market: "categorical",
            amount: "1.5",
            price: "0.1",
            outcome: "7"
        });
        test({
            market: "scalar",
            amount: 1,
            price: "2.5",
            outcome: "1"
        });
        test({
            market: "scalar",
            amount: "0.25",
            price: "2.6",
            outcome: "1"
        });
        test({
            market: "scalar",
            amount: "1.5",
            price: "1.2",
            outcome: "2"
        });
    });

    describe("Trade.trade", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(tools.TIMEOUT*3);
                var active = augur.from;
                augur.rpc.personal("unlockAccount", [unlockable[0], password]);
                augur.rpc.personal("unlockAccount", [unlockable[1], password]);
                augur.useAccount(unlockable[0]);
                if (t.type === "buy") {
                    augur.buyCompleteSets({
                        market: markets[t.market],
                        amount: t.amount,
                        onSent: utils.noop,
                        onSuccess: function (r) {
                            augur.sell({
                                amount: t.amount,
                                price: t.price,
                                market: markets[t.market],
                                outcome: t.outcome,
                                onSent: utils.noop,
                                onSuccess: function (r) {
                                    var new_trade_id = r.callReturn;
                                    augur.useAccount(unlockable[1]);
                                    var trade_ids = augur.get_trade_ids(markets[t.market]);
                                    assert.include(trade_ids, abi.hex(new_trade_id));
                                    var orderBook = augur.getOrderBook(markets[t.market]);
                                    // console.log("[before] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                                    var cost = augur.calculateTradingCost(t.amount, t.price, augur.getTradingFee(markets[t.market]), augur.getCumScale(markets[t.market])).cost.toFixed();
                                    augur.trade({
                                        max_value: cost,
                                        max_amount: 0,
                                        trade_ids: [new_trade_id],
                                        sender: unlockable[1],
                                        onTradeHash: function (r) {
                                            assert.notProperty(r, "error");
                                            assert.isString(r);
                                        },
                                        onCommitSent: function (r) {
                                            assert.strictEqual(r.callReturn, "1");
                                        },
                                        onCommitSuccess: function (r) {
                                            assert.strictEqual(r.callReturn, "1");
                                        },
                                        onCommitFailed: function (e) {
                                            augur.useAccount(active);
                                            console.error(e);
                                            assert.isNull(e);
                                        },
                                        onTradeSent: function (r) {
                                            assert.isNull(r.callReturn);
                                        },
                                        onTradeSuccess: function (r) {
                                            console.log("trade succeeded:", r);
                                            var orderBook = augur.getOrderBook(markets[t.market]);
                                            console.log("[after] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                                            assert.isObject(r);
                                            assert.notProperty(r, "error");
                                            assert.property(r, "unmatchedCash");
                                            assert.property(r, "unmatchedShares");
                                            assert.property(r, "sharesBought");
                                            assert.property(r, "cashFromTrade");
                                            assert.isAtMost(abi.number(r.unmatchedCash), t.expected.unmatchedCash);
                                            assert.strictEqual(abi.number(r.unmatchedShares), t.expected.unmatchedShares);
                                            assert.isAtMost(abi.number(r.sharesBought), t.expected.sharesBought);
                                            assert.strictEqual(abi.number(r.cashFromTrade), t.expected.cashFromTrade);
                                            assert.deepEqual(augur.get_trade(new_trade_id), {
                                                id: "0x0",
                                                type: "sell",
                                                market: "0x0",
                                                amount: "0",
                                                price: "0",
                                                owner: "0x0000000000000000000000000000000000000000",
                                                block: 0,
                                                outcome: "0"
                                            });
                                            assert.notProperty(augur.getOrderBook(markets[t.market]).sell, new_trade_id);
                                            augur.useAccount(active);
                                            done();
                                        },
                                        onTradeFailed: function (e) {
                                            augur.useAccount(active);
                                            console.error(JSON.stringify(e, null, 2));
                                            assert.isNull(e);
                                        }
                                    });
                                },
                                onFailed: function (e) {
                                    augur.useAccount(active);
                                    console.error(JSON.stringify(e, null, 2));
                                    assert.isNull(e);
                                }
                            });
                        },
                        onFailed: function (e) {
                            augur.useAccount(active);
                            console.error(JSON.stringify(e, null, 2));
                            assert.isNull(e);
                        }
                    });
                } else {
                    augur.buy({
                        amount: t.amount,
                        price: t.price,
                        market: markets[t.market],
                        outcome: t.outcome,
                        onSent: utils.noop,
                        onSuccess: function (r) {
                            var new_trade_id = r.callReturn;
                            augur.useAccount(unlockable[1]);
                            augur.buyCompleteSets({
                                market: markets[t.market],
                                amount: t.amount,
                                onSent: utils.noop,
                                onSuccess: function (r) {
                                    var trade_ids = augur.get_trade_ids(markets[t.market]);
                                    assert.include(trade_ids, abi.hex(new_trade_id));
                                    var orderBook = augur.getOrderBook(markets[t.market]);
                                    // console.log("[before] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                                    augur.trade({
                                        max_value: 0,
                                        max_amount: t.amount,
                                        trade_ids: [new_trade_id],
                                        onTradeHash: function (r) {
                                            assert.notProperty(r, "error");
                                            assert.isString(r);
                                        },
                                        onCommitSent: function (r) {
                                            assert.strictEqual(r.callReturn, "1");
                                        },
                                        onCommitSuccess: function (r) {
                                            assert.strictEqual(r.callReturn, "1");
                                        },
                                        onCommitFailed: function (e) {
                                            augur.useAccount(active);
                                            console.error(JSON.stringify(e, null, 2));
                                            assert.isNull(e);
                                        },
                                        onTradeSent: function (r) {
                                            assert.isNull(r.callReturn);
                                        },
                                        onTradeSuccess: function (r) {
                                            // console.log("trade success:", r);
                                            var orderBook = augur.getOrderBook(markets[t.market]);
                                            // console.log("[after] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                                            assert.isObject(r);
                                            assert.notProperty(r, "error");
                                            assert.property(r, "unmatchedCash");
                                            assert.property(r, "unmatchedShares");
                                            assert.property(r, "sharesBought");
                                            assert.property(r, "cashFromTrade");
                                            assert.isAtMost(abi.number(r.unmatchedCash), t.expected.unmatchedCash);
                                            assert.strictEqual(abi.number(r.unmatchedShares), t.expected.unmatchedShares);
                                            assert.strictEqual(abi.number(r.sharesBought), t.expected.sharesBought);
                                            assert.strictEqual(abi.number(r.cashFromTrade), t.expected.cashFromTrade);
                                            assert.deepEqual(augur.get_trade(new_trade_id), {
                                                id: "0x0",
                                                type: "sell",
                                                market: "0x0",
                                                amount: "0",
                                                price: "0",
                                                owner: "0x0000000000000000000000000000000000000000",
                                                block: 0,
                                                outcome: "0"
                                            });
                                            assert.notProperty(augur.getOrderBook(markets[t.market]).buy, new_trade_id);
                                            augur.useAccount(active);
                                            done();
                                        },
                                        onTradeFailed: function (e) {
                                            augur.useAccount(active);
                                            console.error(JSON.stringify(e, null, 2));
                                            assert.isNull(e);
                                        }
                                    });
                                },
                                onFailed: function (e) {
                                    augur.useAccount(active);
                                    console.error(JSON.stringify(e, null, 2));
                                    assert.isNull(e);
                                }
                            });
                        },
                        onFailed: function (e) {
                            augur.useAccount(active);
                            console.error(JSON.stringify(e, null, 2));
                            assert.isNull(e);
                        }
                    });
                }
            });
        };
        test({
            type: "buy",
            market: "binary",
            amount: 1,
            outcome: "1",
            price: "0.1",
            expected: {
                unmatchedCash: 0.9,
                unmatchedShares: 0,
                sharesBought: 1,
                cashFromTrade: 0
            }
        });
        test({
            type: "sell",
            market: "binary",
            amount: 1,
            outcome: "1",
            price: "0.1",
            expected: {
                unmatchedCash: 0.9,
                unmatchedShares: 0,
                sharesBought: 0,
                cashFromTrade: 0.1
            }
        });
        test({
            type: "buy",
            market: "categorical",
            amount: 2,
            outcome: "3",
            price: "0.1",
            expected: {
                unmatchedCash: 1.8,
                unmatchedShares: 0,
                sharesBought: 2,
                cashFromTrade: 0
            }
        });
        test({
            type: "sell",
            market: "categorical",
            amount: 2,
            outcome: "3",
            price: "0.1",
            expected: {
                unmatchedCash: 0.9,
                unmatchedShares: 0,
                sharesBought: 0,
                cashFromTrade: 0.2
            }
        });
        test({
            type: "buy",
            market: "scalar",
            amount: 1,
            outcome: "1",
            price: "3.4",
            expected: {
                unmatchedCash: 0,
                unmatchedShares: 0,
                sharesBought: 1,
                cashFromTrade: 0
            }
        });
        test({
            type: "sell",
            market: "scalar",
            amount: 1,
            outcome: "1",
            price: "3.4",
            expected: {
                unmatchedCash: 0,
                unmatchedShares: 0,
                sharesBought: 0,
                cashFromTrade: 3.4
            }
        });
    });

    describe("Trade.short_sell", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(tools.TIMEOUT*3);
                var active = augur.from;
                augur.rpc.personal("unlockAccount", [unlockable[0], password]);
                augur.rpc.personal("unlockAccount", [unlockable[1], password]);
                augur.useAccount(unlockable[0]);
                augur.buy({
                    amount: t.amount,
                    price: t.price,
                    market: markets[t.market],
                    outcome: t.outcome,
                    onSent: utils.noop,
                    onSuccess: function (r) {
                        var new_trade_id = r.callReturn;
                        augur.useAccount(unlockable[1]);
                        var trade_ids = augur.get_trade_ids(markets[t.market]);
                        assert.include(trade_ids, abi.hex(new_trade_id));
                        var orderBook = augur.getOrderBook(markets[t.market]);
                        // console.log("[before] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                        augur.short_sell({
                            buyer_trade_id: new_trade_id,
                            max_amount: t.amount,
                            sender: unlockable[1],
                            onTradeHash: function (r) {
                                assert.notProperty(r, "error");
                                assert.isString(r);
                            },
                            onCommitSent: function (r) {
                                assert.strictEqual(r.callReturn, "1");
                            },
                            onCommitSuccess: function (r) {
                                assert.strictEqual(r.callReturn, "1");
                            },
                            onCommitFailed: function (e) {
                                augur.useAccount(active);
                                done(e);
                            },
                            onTradeSent: function (r) {
                                assert.isNull(r.callReturn);
                            },
                            onTradeSuccess: function (r) {
                                // console.log("short_sell succeeded:", r);
                                var orderBook = augur.getOrderBook(markets[t.market]);
                                // console.log("[after] order book for", markets[t.market], JSON.stringify(orderBook, null, 4));
                                assert.isObject(r);
                                assert.notProperty(r, "error");
                                assert.property(r, "matchedShares");
                                assert.property(r, "unmatchedShares");
                                assert.property(r, "cashFromTrade");
                                assert.property(r, "price");
                                assert.strictEqual(abi.number(r.matchedShares), t.expected.matchedShares);
                                assert.strictEqual(abi.number(r.unmatchedShares), t.expected.unmatchedShares);
                                assert.strictEqual(abi.number(r.cashFromTrade), t.expected.cashFromTrade);
                                assert.strictEqual(abi.number(r.price), t.expected.price);
                                augur.useAccount(active);
                                done();
                            },
                            onTradeFailed: function (e) {
                                augur.useAccount(active);
                                done(e);
                            }
                        });
                    },
                    onFailed: function (e) {
                        augur.useAccount(active);
                        done(e);
                    }
                });
            });
        };
        test({
            market: "binary",
            amount: 1,
            outcome: "1",
            price: "0.1",
            expected: {
                unmatchedShares: 0,
                matchedShares: 1,
                cashFromTrade: 0.1,
                price: 0.1
            }
        });
        test({
            market: "categorical",
            amount: 2,
            outcome: "3",
            price: "0.1",
            expected: {
                unmatchedShares: 0,
                matchedShares: 2,
                cashFromTrade: 0.2,
                price: 0.1
            }
        });
        test({
            market: "scalar",
            amount: 1,
            outcome: "1",
            price: "3.4",
            expected: {
                unmatchedShares: 0,
                matchedShares: 1,
                cashFromTrade: 3.4,
                price: 3.4
            }
        });
    });

    describe("BuyAndSellShares.buyCompleteSetsThenSell", function () {
        var test = function (t) {
            it(JSON.stringify(t), function (done) {
                this.timeout(tools.TIMEOUT);
                var initShares = augur.getParticipantSharesPurchased(markets[t.market], augur.from, t.outcome);
                var initialTotalTrades = parseInt(augur.get_total_trades(markets[t.market]));
                augur.buyCompleteSetsThenSell({
                    amount: t.amount,
                    price: t.price,
                    market: markets[t.market],
                    outcome: t.outcome,
                    onSent: function (r) {
                        assert.isNull(r.callReturn);
                    },
                    onSuccess: function (r) {
                        assert.isNotNull(r.callReturn);
                        var tradeID = r.callReturn;
                        var finalShares = augur.getParticipantSharesPurchased(markets[t.market], augur.from, t.outcome);
                        assert.strictEqual(parseFloat(finalShares - initShares), 0);
                        assert.include(augur.get_trade_ids(markets[t.market]), abi.hex(tradeID));
                        var trade = augur.get_trade(tradeID);
                        assert.isObject(trade);
                        assert.approximately(Number(trade.amount), Number(t.amount), tools.EPSILON);
                        assert.approximately(Number(trade.price), Number(t.price), tools.EPSILON);
                        assert.strictEqual(abi.format_int256(trade.market), markets[t.market]);
                        assert.strictEqual(trade.outcome, t.outcome);
                        var totalTrades = parseInt(augur.get_total_trades(markets[t.market]));
                        assert.isAbove(totalTrades, initialTotalTrades);
                        done();
                    },
                    onFailed: function (e) {
                        console.error(JSON.stringify(e, null, 2));
                        assert.isNull(e);
                    }
                });
            });
        };
        test({
            market: "binary",
            amount: 1,
            price: "0.5",
            outcome: "1"
        });
        test({
            market: "binary",
            amount: "0.25",
            price: "0.52",
            outcome: "1"
        });
        test({
            market: "binary",
            amount: "1.5",
            price: "0.9",
            outcome: "2"
        });
        test({
            market: "categorical",
            amount: 1,
            price: "0.5",
            outcome: "3"
        });
        test({
            market: "categorical",
            amount: "0.25",
            price: "0.52",
            outcome: "3"
        });
        test({
            market: "categorical",
            amount: "1.5",
            price: "0.9",
            outcome: "7"
        });
        test({
            market: "scalar",
            amount: 1,
            price: "2.5",
            outcome: "1"
        });
        test({
            market: "scalar",
            amount: "0.25",
            price: "2.6",
            outcome: "1"
        });
        test({
            market: "scalar",
            amount: "1.5",
            price: "1.2",
            outcome: "2"
        });
    });

});
