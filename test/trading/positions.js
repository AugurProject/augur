/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var augur = require("../../src");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");

describe("positions", function () {

    function fix(n) {
        return abi.format_int256(abi.fix(n, "hex"));
    }

    var txOriginal;

    before(function () {
        txOriginal = augur.tx;
        augur.tx = new require("augur-contracts").Tx("2").functions;
    });

    after(function () {
        augur.tx = txOriginal;
    });

    describe("modifyPosition", function () {
        var test = function (t) {
            it(t.description, function () {
                t.assertions(augur.modifyPosition(t.typeCode, t.position, t.numShares));
            });
        };
        test({
            description: "buy 1 share, no position",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
            position: new BigNumber("0"),
            numShares: fix("1"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("1", 10));
            }
        });
        test({
            description: "buy 1 share, position 1",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
            position: new BigNumber("1", 10),
            numShares: fix("1"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("2", 10));
            }
        });
        test({
            description: "buy 0.1 share, position 0.2",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
            position: new BigNumber("0.2", 10),
            numShares: fix("0.1"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("0.3", 10));
            }
        });
        test({
            description: "buy 0.2 shares, position 123.4567",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
            position: new BigNumber("123.4567", 10),
            numShares: fix("0.2"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("123.6567", 10));
            }
        });
        test({
            description: "buy 123.4567 shares, position 0.2",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000001",
            position: new BigNumber("0.2", 10),
            numShares: fix("123.4567"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("123.6567", 10));
            }
        });
        test({
            description: "sell 1 share, position 0",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
            position: new BigNumber("0"),
            numShares: fix("1"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("-1", 10));
            }
        });
        test({
            description: "sell 1 share, position 1",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
            position: new BigNumber("1", 10),
            numShares: fix("1"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("0"));
            }
        });
        test({
            description: "sell 0.1 share, position 0.2",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
            position: new BigNumber("0.2", 10),
            numShares: fix("0.1"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("0.1", 10));
            }
        });
        test({
            description: "sell 0.2 shares, position 123.4567",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
            position: new BigNumber("123.4567", 10),
            numShares: fix("0.2"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("123.2567", 10));
            }
        });
        test({
            description: "sell 123.4567 shares, position 0.2",
            typeCode: "0x0000000000000000000000000000000000000000000000000000000000000002",
            position: new BigNumber("0.2", 10),
            numShares: fix("123.4567"),
            assertions: function (output) {
                assert.deepEqual(output, new BigNumber("-123.2567", 10));
            }
        });
    });

    describe("calculateCompleteSetsShareTotals", function () {
        var test = function (t) {
            it(t.description, function () {
                t.assertions(augur.calculateCompleteSetsShareTotals(t.logs));
            });
        };
        test({
            description: "no logs",
            logs: [],
            assertions: function (output) {
                assert.deepEqual(output, {});
            }
        });
        test({
            description: "1 log, 1 market: buy 1 share",
            logs: [{
                data: fix("1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1", 10)
                });
            }
        });
        test({
            description: "2 logs, 1 market: [buy 1, sell 1]",
            logs: [{
                data: fix("1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0")
                });
            }
        });
        test({
            description: "2 logs, 1 market: [buy 3.1415, sell 2.1]",
            logs: [{
                data: fix("3.1415"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("2.1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1.0415", 10)
                });
            }
        });
        test({
            description: "2 logs, 1 market: [sell 3.1415, buy 2.1]",
            logs: [{
                data: fix("3.1415"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }, {
                data: fix("2.1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("-1.0415", 10)
                });
            }
        });
        test({
            description: "4 logs, 1 market: [buy 3.1415, buy 2, buy 10.1, sell 0.5]",
            logs: [{
                data: fix("3.1415"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("2"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("10.1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("0.5"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("14.7415", 10)
                });
            }
        });
        test({
            description: "4 logs, 2 markets: [buy 50 of 1, buy 0.1 of 1, buy 0.42 of 2, sell 0.1 of 2]",
            logs: [{
                data: fix("50"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("0.1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("0.42"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x8000000000000000000000000000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("0.1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x8000000000000000000000000000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("50.1", 10),
                    "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("0.32", 10)
                });
            }
        });
        test({
            description: "4 logs, 4 markets: [sell 50 of 1, buy 0.1 of 2, buy 0.42 of 3, buy 1 of 4]",
            logs: [{
                data: fix("50"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x0000000000000000000000000000000000000000000000000000000000000002"
                ]
            }, {
                data: fix("0.1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x8000000000000000000000000000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("0.42"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x00000000000000000000000000000000000000000000000000000000deadbeef",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }, {
                data: fix("1"),
                topics: [
                    "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                    "0x1111111111111111111111111111111111111111111111111111111111111111",
                    "0x0000000000000000000000000000000000000000000000000000000000000001"
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("-50", 10),
                    "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("0.1", 10),
                    "0x00000000000000000000000000000000000000000000000000000000deadbeef": new BigNumber("0.42", 10),
                    "0x1111111111111111111111111111111111111111111111111111111111111111": new BigNumber("1", 10)
                });
            }
        });
    });

    describe("calculateShortSellShareTotals", function () {
        var test = function (t) {
            it(t.description, function () {
                t.assertions(augur.calculateShortSellShareTotals(t.logs));
            });
        };
        test({
            description: "no logs",
            logs: [],
            assertions: function (output) {
                assert.deepEqual(output, {});
            }
        });
        test({
            description: "1 log, 1 market: 1 outcome 1",
            logs: [{
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("1").replace("0x", "")+
                    "0000000000000000000000000000000100000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1", 10)
                });
            }
        });
        test({
            description: "2 logs, 1 market: [0.1 outcome 1, 0.2 outcome 1]",
            logs: [{
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("0.1").replace("0x", "")+
                    "0000000000000000000000000000000100000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }, {
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("0.2").replace("0x", "")+
                    "0000000000000000000000000000000200000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("0.3", 10)
                });
            }
        });
        test({
            description: "2 logs, 2 markets: [123.456789 outcome 1 market 1, 987654.321 outcome 3 market 2]",
            logs: [{
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("123.456789").replace("0x", "")+
                    "0000000000000000000000000000000100000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }, {
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("987654.321").replace("0x", "")+
                    "0000000000000000000000000000000200000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x8000000000000000000000000000000000000000000000000000000000000000",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("123.456789", 10),
                    "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("987654.321", 10)
                });
            }
        });
        test({
            description: "4 logs, 2 markets: [50 outcome 1 market 1, 10 outcome 1 market 1, 3.1415 outcome 2 market 1, 123.456789 outcome 1 market 2]",
            logs: [{
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("50").replace("0x", "")+
                    "0000000000000000000000000000000100000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }, {
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("10").replace("0x", "")+
                    "0000000000000000000000000000000200000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }, {
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("3.1415").replace("0x", "")+
                    "0000000000000000000000000000000200000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000002", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }, {
                data: "0x"+
                    "1000000000000000000000000000000000000000000000000000000000000000"+
                    fix("123.456789").replace("0x", "")+
                    "0000000000000000000000000000000200000000000000000000000000000000"+
                    "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                topics: [
                    "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                    "0x8000000000000000000000000000000000000000000000000000000000000000",
                    "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                    "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                ]
            }],
            assertions: function (output) {
                assert.deepEqual(output, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("63.1415", 10),
                    "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("123.456789", 10)
                });
            }
        });
    });

    describe("calculateShareTotals", function () {
        var test = function (t) {
            it(t.description, function () {
                t.assertions(augur.calculateShareTotals(t.logs));
            });
        };
        test({
            description: "no logs",
            logs: {
                shortAskBuyCompleteSets: [],
                shortSellBuyCompleteSets: [],
                completeSets: []
            },
            assertions: function (output) {
                assert.deepEqual(output, {
                    shortAskBuyCompleteSets: {},
                    shortSellBuyCompleteSets: {},
                    completeSets: {}
                });
            }
        });
        test({
            description: "4 short ask logs, 1 short sell log, 2 complete sets logs",
            logs: {
                shortAskBuyCompleteSets: [{
                    data: fix("50"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }, {
                    data: fix("0.1"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }, {
                    data: fix("0.42"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x8000000000000000000000000000000000000000000000000000000000000000",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }, {
                    data: fix("0.1"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x8000000000000000000000000000000000000000000000000000000000000000",
                        "0x0000000000000000000000000000000000000000000000000000000000000002"
                    ]
                }],
                shortSellBuyCompleteSets: [{
                    data: "0x"+
                        "1000000000000000000000000000000000000000000000000000000000000000"+
                        fix("1").replace("0x", "")+
                        "0000000000000000000000000000000100000000000000000000000000000000"+
                        "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                    topics: [
                        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                    ]
                }],
                completeSets: [{
                    data: fix("3.1415"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000002"
                    ]
                }, {
                    data: fix("2.1"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }]
            },
            assertions: function (output) {
                assert.deepEqual(output, {
                    shortAskBuyCompleteSets: {
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("50.1", 10),
                        "0x8000000000000000000000000000000000000000000000000000000000000000": new BigNumber("0.32", 10)
                    },
                    shortSellBuyCompleteSets: {
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("1", 10)
                    },
                    completeSets: {
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": new BigNumber("-1.0415", 10)
                    }
                });
            }
        });
    });

    describe("decreasePosition", function () {
        var test = function (t) {
            it(t.description, function () {
                t.assertions(augur.decreasePosition(t.position, t.adjustment));
            });
        };
        test({
            description: "no position, no adjustment",
            position: {
                "1": "0",
                "2": "0"
            },
            adjustment: new BigNumber("0"),
            assertions: function (output) {
                assert.deepEqual(output, {
                    "1": "0",
                    "2": "0"
                });
            }
        });
        test({
            description: "position [1, 1], adjustment 1",
            position: {
                "1": "1",
                "2": "1"
            },
            adjustment: new BigNumber("1", 10),
            assertions: function (output) {
                assert.deepEqual(output, {
                    "1": "0",
                    "2": "0"
                });
            }
        });
        test({
            description: "position [1, 1], adjustment 0.75",
            position: {
                "1": "1",
                "2": "1"
            },
            adjustment: new BigNumber("0.75", 10),
            assertions: function (output) {
                assert.deepEqual(output, {
                    "1": "0.25",
                    "2": "0.25"
                });
            }
        });
        test({
            description: "position [2, 1], adjustment 2",
            position: {
                "1": "2",
                "2": "1"
            },
            adjustment: new BigNumber("2", 10),
            assertions: function (output) {
                assert.deepEqual(output, {
                    "1": "0",
                    "2": "-1"
                });
            }
        });
        test({
            description: "position [2.1, 0.9], adjustment 0.2",
            position: {
                "1": "2.1",
                "2": "0.9"
            },
            adjustment: new BigNumber("0.2", 10),
            assertions: function (output) {
                assert.deepEqual(output, {
                    "1": "1.9",
                    "2": "0.7"
                });
            }
        });
        test({
            description: "position [2.1, 0.9], adjustment 0.9",
            position: {
                "1": "2.1",
                "2": "0.9"
            },
            adjustment: new BigNumber("0.9", 10),
            assertions: function (output) {
                assert.deepEqual(output, {
                    "1": "1.2",
                    "2": "0"
                });
            }
        });
        test({
            description: "position [2.1, 0.9], adjustment 2",
            position: {
                "1": "2.1",
                "2": "0.9"
            },
            adjustment: new BigNumber("2", 10),
            assertions: function (output) {
                assert.deepEqual(output, {
                    "1": "0.1",
                    "2": "-1.1"
                });
            }
        });
    });

    describe("findUniqueMarketIDs", function () {
        var test = function (t) {
            it(t.description, function () {
                t.assertions(augur.findUniqueMarketIDs(t.shareTotals));
            });
        };
        test({
            description: "no markets",
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {},
                completeSets: {}
            },
            assertions: function (output) {
                assert.deepEqual(output, []);
            }
        });
        test({
            description: "1 short ask market, 1 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {"0x1": null},
                shortSellBuyCompleteSets: {},
                completeSets: {}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1"]);
            }
        });
        test({
            description: "1 short sell market, 1 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {"0x1": null},
                completeSets: {}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1"]);
            }
        });
        test({
            description: "1 complete sets market, 1 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {},
                completeSets: {"0x1": null}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1"]);
            }
        });
        test({
            description: "2 short ask markets, 2 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {"0x1": null, "0x2": null},
                shortSellBuyCompleteSets: {},
                completeSets: {}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1", "0x2"]);
            }
        });
        test({
            description: "2 short sell markets, 2 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {"0x1": null, "0x2": null},
                completeSets: {}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1", "0x2"]);
            }
        });
        test({
            description: "2 short ask markets, 1 short sell market, 3 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {"0x1": null, "0x2": null},
                shortSellBuyCompleteSets: {"0x3": null},
                completeSets: {}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1", "0x2", "0x3"]);
            }
        });
        test({
            description: "2 short ask markets, 1 short sell market, 2 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {"0x1": null, "0x2": null},
                shortSellBuyCompleteSets: {"0x1": null},
                completeSets: {}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1", "0x2"]);
            }
        });
        test({
            description: "2 short ask markets, 1 short sell market, 3 complete sets markets, 3 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {"0x1": null, "0x2": null},
                shortSellBuyCompleteSets: {"0x3": null},
                completeSets: {"0x1": null, "0x2": null, "0x3": null}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1", "0x2", "0x3"]);
            }
        });
        test({
            description: "3 short ask markets, 3 short sell markets, 1 complete sets market, 7 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {"0x1": null, "0x2": null, "0x3": null},
                shortSellBuyCompleteSets: {"0x4": null, "0x5": null, "0x6": null},
                completeSets: {"0x7": null}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6", "0x7"]);
            }
        });
        test({
            description: "3 short ask markets, 3 short sell markets, 1 complete sets market, 6 unique",
            shareTotals: {
                shortAskBuyCompleteSets: {"0x1": null, "0x2": null, "0x3": null},
                shortSellBuyCompleteSets: {"0x2": null, "0x4": null, "0x5": null},
                completeSets: {"0x6": null}
            },
            assertions: function (output) {
                assert.deepEqual(output, ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6"]);
            }
        });
    });

    describe("adjustPositions", function () {
        var getPositionInMarket;
        beforeEach(function () {
            getPositionInMarket = augur.getPositionInMarket;
        });
        afterEach(function () {
            augur.getPositionInMarket = getPositionInMarket;
        });
        var test = function (t) {
            it(t.description, function (done) {
                augur.getPositionInMarket = function (marketID, account, callback) {
                    if (!callback) return t.onChainPosition;
                    callback(t.onChainPosition);
                };
                augur.adjustPositions(t.account, t.marketIDs, t.shareTotals, function (err, adjusted) {
                    assert.isNull(err);
                    t.assertions({
                        async: adjusted,
                        sync: augur.adjustPositions(t.account, t.marketIDs, t.shareTotals)
                    });
                    done();
                });
            });
        };
        test({
            description: "1 market, 2 outcomes, no position, short ask 0, short sell 0, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {},
                completeSets: {}
            },
            onChainPosition: {
                "1": "0",
                "2": "0"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "0",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 1 position, short ask 0, short sell 0, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {},
                completeSets: {}
            },
            onChainPosition: {
                "1": "1",
                "2": "0"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "1",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 1 position, short ask 0, short sell 1, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("1", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "0",
                "2": "1"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "-1",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 2 positions, short ask 1, short sell 0, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("1", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "1",
                "2": "1"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "0",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 2 positions, short ask 1, short sell 1, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {
                    "0x1": new BigNumber("1", 10)
                },
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("1", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "1",
                "2": "2"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "-1",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 1 position, short ask 0, short sell 2, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("2", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "2",
                "2": "0"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "0",
                        "2": "-2"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 2 positions, short ask 0, short sell 2 [1 of 1, 1 of 2], complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {},
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("2", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "1",
                "2": "1"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "-1",
                        "2": "-1"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 2 positions, short ask 2, short sell 2, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {
                    "0x1": new BigNumber("2", 10)
                },
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("2", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "2",
                "2": "4"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "-2",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 2 positions, short ask 2, short sell 2 [1 of 1, 1 of 2], complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {
                    "0x1": new BigNumber("2", 10)
                },
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("2", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "3",
                "2": "3"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "-1",
                        "2": "-1"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 2 positions, short ask 2, short sell 5, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {
                    "0x1": new BigNumber("2", 10)
                },
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("5", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "7",
                "2": "2"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "0",
                        "2": "-5"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 2 positions, short ask 5, short sell 2, complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {
                    "0x1": new BigNumber("5", 10)
                },
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("2", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "5",
                "2": "7"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "-2",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 outcomes, 2 positions, short ask 5.1, short sell 2.2 [1.2 of 1, 1 of 2], complete sets 0",
            account: "0xb0b",
            marketIDs: ["0x1"],
            shareTotals: {
                shortAskBuyCompleteSets: {
                    "0x1": new BigNumber("5.1", 10)
                },
                shortSellBuyCompleteSets: {
                    "0x1": new BigNumber("2.2", 10)
                },
                completeSets: {}
            },
            onChainPosition: {
                "1": "6.1",
                "2": "6.3"
            },
            assertions: function (output) {
                assert.isObject(output);
                assert.isObject(output.async);
                assert.isObject(output.sync);
                assert.deepEqual(output.async, output.sync);
                assert.deepEqual(output.async, {
                    "0x1": {
                        "1": "-1.2",
                        "2": "-1"
                    }
                });
            }
        });
    });
    describe("getAdjustedPositions", function () {
        var getPositionInMarket;
        var getShortAskBuyCompleteSetsLogs;
        var getMakerShortSellLogs;
        var getCompleteSetsLogs;
        beforeEach(function () {
            getPositionInMarket = augur.getPositionInMarket;
            getShortAskBuyCompleteSetsLogs = augur.getShortAskBuyCompleteSetsLogs;
            getMakerShortSellLogs = augur.getMakerShortSellLogs;
            getCompleteSetsLogs = augur.getCompleteSetsLogs;
        });
        afterEach(function () {
            augur.getPositionInMarket = getPositionInMarket;
            augur.getShortAskBuyCompleteSetsLogs = getShortAskBuyCompleteSetsLogs;
            augur.getMakerShortSellLogs = getMakerShortSellLogs;
            augur.getCompleteSetsLogs = getCompleteSetsLogs;
        });
        var test = function (t) {
            it(t.description, function () {
                augur.getPositionInMarket = function (marketID, account, callback) {
                    if (!callback) return t.onChainPosition;
                    callback(t.onChainPosition);
                };
                augur.getShortAskBuyCompleteSetsLogs = function (account, options, callback) {
                    if (!callback) return t.logs.shortAskBuyCompleteSets;
                    callback(null, t.logs.shortAskBuyCompleteSets);
                }
                augur.getMakerShortSellLogs = function (account, options, callback) {
                    if (!callback) return t.logs.shortSellBuyCompleteSets;
                    callback(null, t.logs.shortSellBuyCompleteSets);
                }
                augur.getCompleteSetsLogs = function (account, options, callback) {
                    if (!callback) return t.logs.completeSets;
                    callback(null, t.logs.completeSets);
                }
                t.assertions({
                    sync: augur.getAdjustedPositions(t.account, t.options)
                });
            });
        };
        test({
            description: "no logs",
            account: "0xb0b",
            options: {},
            logs: {
                shortAskBuyCompleteSets: [],
                shortSellBuyCompleteSets: [],
                completeSets: []
            },
            assertions: function (output) {
                assert.deepEqual(output.sync, {});
            }
        });
        test({
            description: "1 market, 1 short sell log",
            account: "0xb0b",
            onChainPosition: {
                "1": "0",
                "2": "1"
            },
            logs: {
                shortAskBuyCompleteSets: [],
                shortSellBuyCompleteSets: [{
                    data: "0x"+
                        "1000000000000000000000000000000000000000000000000000000000000000"+
                        fix("1").replace("0x", "")+
                        "0000000000000000000000000000000100000000000000000000000000000000"+
                        "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                    topics: [
                        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                    ]
                }],
                completeSets: []
            },
            assertions: function (output) {
                assert.deepEqual(output.sync, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                        "1": "-1",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 1 short ask log",
            account: "0xb0b",
            onChainPosition: {
                "1": "3",
                "2": "3"
            },
            logs: {
                shortAskBuyCompleteSets: [{
                    data: fix("3"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }],
                shortSellBuyCompleteSets: [],
                completeSets: []
            },
            assertions: function (output) {
                assert.deepEqual(output.sync, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                        "1": "0",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 1 buy complete sets log",
            account: "0xb0b",
            onChainPosition: {
                "1": "3",
                "2": "3"
            },
            logs: {
                shortAskBuyCompleteSets: [],
                shortSellBuyCompleteSets: [],
                completeSets: [{
                    data: fix("3"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }]
            },
            assertions: function (output) {
                assert.deepEqual(output.sync, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                        "1": "0",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 2 complete sets logs [1 buy, 1 sell]",
            account: "0xb0b",
            onChainPosition: {
                "1": "0.9",
                "2": "0.9"
            },
            logs: {
                shortAskBuyCompleteSets: [],
                shortSellBuyCompleteSets: [],
                completeSets: [{
                    data: fix("3"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }, {
                    data: fix("2.1"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000002"
                    ]
                }]
            },
            assertions: function (output) {
                assert.deepEqual(output.sync, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                        "1": "0",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 1 short ask log, 2 complete sets logs [1 buy, 1 sell]",
            account: "0xb0b",
            onChainPosition: {
                "1": "3.9",
                "2": "3.9"
            },
            logs: {
                shortAskBuyCompleteSets: [{
                    data: fix("3"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }],
                shortSellBuyCompleteSets: [],
                completeSets: [{
                    data: fix("3"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }, {
                    data: fix("2.1"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000002"
                    ]
                }]
            },
            assertions: function (output) {
                assert.deepEqual(output.sync, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                        "1": "0",
                        "2": "0"
                    }
                });
            }
        });
        test({
            description: "1 market, 1 short ask log, 1 short sell log, 2 complete sets logs [1 buy, 1 sell]",
            account: "0xb0b",
            onChainPosition: {
                "1": "3.9",
                "2": "4.9"
            },
            logs: {
                shortAskBuyCompleteSets: [{
                    data: fix("3"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }],
                shortSellBuyCompleteSets: [{
                    data: "0x"+
                        "1000000000000000000000000000000000000000000000000000000000000000"+
                        fix("1").replace("0x", "")+
                        "0000000000000000000000000000000100000000000000000000000000000000"+
                        "0000000000000000000000000000000000000000000000000000000000000001", // outcome
                    topics: [
                        "0x17c6c0dcf7960856660a58fdb9238dc76130b17e20b6511d08e811a3a92ca8c7",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x000000000000000000000000000000000000000000000000000000000000d00d", // taker
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b"  // maker
                    ]
                }],
                completeSets: [{
                    data: fix("3"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000001"
                    ]
                }, {
                    data: fix("2.1"),
                    topics: [
                        "0x2e6b18139c987afb05efb85deddaa40262aa36c9ddebb9be215461cb22078175",
                        "0x0000000000000000000000000000000000000000000000000000000000000b0b",
                        "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                        "0x0000000000000000000000000000000000000000000000000000000000000002"
                    ]
                }]
            },
            assertions: function (output) {
                assert.deepEqual(output.sync, {
                    "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff": {
                        "1": "-1",
                        "2": "0"
                    }
                });
            }
        });
    });
});
