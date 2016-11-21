"use strict";

var assert = require("chai").assert;
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

describe("Unit tests", function () {
// 107 total tests
    describe("abacus.calculateAdjustedTradingFee", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {
                var adjustedTradingFee = abacus.calculateAdjustedTradingFee(abi.bignum(t.tradingFee), abi.bignum(t.price), abi.bignum(t.range));
                assert(adjustedTradingFee.eq(abi.bignum(t.expected)));
            });
        };
        test({
            tradingFee: "0.02",
            price: "0.4",
            range: 1,
            expected: "0.0192"
        });
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
                var tradingCost = abacus.calculateTradingCost(t.amount, t.price, t.tradingFee, t.makerProportionOfFee, t.range);
                assert.strictEqual(tradingCost.fee.toFixed(), t.expected.fee);
                assert.strictEqual(tradingCost.percentFee.toFixed(), t.expected.percentFee);
                assert.strictEqual(tradingCost.cost.toFixed(), t.expected.cost);
            });
        };
        test({
            amount: 1,
            price: "0.4",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.00768",
                percentFee: "0.0192",
                cost: "0.40768",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.5",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.01",
                percentFee: "0.02",
                cost: "0.51",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "0.5",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.02",
                percentFee: "0.02",
                cost: "1.02",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.5",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0.0075",
                percentFee: "0.015",
                cost: "0.5075",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "1",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "1",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "1",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "2",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "1",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0.04",
                percentFee: "0.02",
                cost: "2.04",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "0",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.01125",
                percentFee: "0.015",
                cost: "0.76125",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "0.75",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.0225",
                percentFee: "0.015",
                cost: "1.5225",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0.0140625",
                percentFee: "0.01875",
                cost: "0.7640625",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.08",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.045",
                percentFee: "0.06",
                cost: "0.795",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "0.75",
            tradingFee: "0.08",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.09",
                percentFee: "0.06",
                cost: "1.59",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.08",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0.05625",
                percentFee: "0.075",
                cost: "0.80625",
                cash: "0"
            }
        });
    });

    describe("abacus.calculateFxpTradingCost", function () {
        var test = function (t) {
            it(JSON.stringify(t), function () {
                var tradingCost = abacus.calculateFxpTradingCost(t.amount, t.price, abi.fix(t.tradingFee), abi.fix(t.makerProportionOfFee), t.range);
                assert.strictEqual(tradingCost.fee.toFixed(), t.expected.fee);
                assert.strictEqual(tradingCost.percentFee.toFixed(), t.expected.percentFee);
                assert.strictEqual(tradingCost.cost.toFixed(), t.expected.cost);
            });
        };
        test({
            amount: 1,
            price: "0.4",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.00768",
                percentFee: "0.0192",
                cost: "0.40768",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.5",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.01",
                percentFee: "0.02",
                cost: "0.51",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "0.5",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.02",
                percentFee: "0.02",
                cost: "1.02",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.5",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0.0075",
                percentFee: "0.015",
                cost: "0.5075",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "1",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "1",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "1",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "2",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "1",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0.04",
                percentFee: "0.02",
                cost: "2.04",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "0",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0",
                percentFee: "0",
                cost: "0",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.01125",
                percentFee: "0.015",
                cost: "0.76125",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "0.75",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.0225",
                percentFee: "0.015",
                cost: "1.5225",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.02",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0.0140625",
                percentFee: "0.01875",
                cost: "0.7640625",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.08",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.045",
                percentFee: "0.06",
                cost: "0.795",
                cash: "0"
            }
        });
        test({
            amount: 2,
            price: "0.75",
            tradingFee: "0.08",
            makerProportionOfFee: "0.5",
            range: 1,
            expected: {
                fee: "0.09",
                percentFee: "0.06",
                cost: "1.59",
                cash: "0"
            }
        });
        test({
            amount: 1,
            price: "0.75",
            tradingFee: "0.08",
            makerProportionOfFee: "0.5",
            range: 2,
            expected: {
                fee: "0.05625",
                percentFee: "0.075",
                cost: "0.80625",
                cash: "0"
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
});
