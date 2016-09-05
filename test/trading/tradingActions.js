/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var augur = require("../../src");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");

describe("getTradingActions", function () {
    var txOriginal;
    before("getTradingActions", function () {
        txOriginal = augur.tx;
        augur.tx = new require("augur-contracts").Tx("2").functions;
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
                    "gasEth": "0.01450404",
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
                    "gasEth": "0.01450404",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0192",
                    "costEth": "3",
                    "avgPrice": "0.6"
                }];
                assert.deepEqual(actions, expected);
            }
        });

        runTestCase({
            description: "ask with same shares and price, shares below precision limit",
            type: "buy",
            orderShares: "0.0001",
            orderLimitPrice: "0.8",
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
                        amount: "0.0001",
                        price: "0.8",
                        outcome: "outcomeasdf123"
                    }
                }
            },
            userAddress: "abcd1234",
            assertions: function (actions) {
                assert.isArray(actions);
                var expected = [{
                    "action": "BUY",
                    "shares": "0.0001",
                    "gasEth": "0.01574842",
                    "feeEth": "0.0128",
                    "costEth": "0.000081",
                    "avgPrice": "0.8"
                }];
                assert.lengthOf(actions, expected.length);
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0192",
                    "costEth": "1.2",
                    "avgPrice": "0.6"
                }, {
                    "action": "BID",
                    "shares": "3",
                    "gasEth": "0.01450404",
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
                    "gasEth": "0.01574842",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0192",
                    "costEth": "0.8",
                    "avgPrice": "0.4"
                }, {
                    "action": "BID",
                    "shares": "3",
                    "gasEth": "0.01450404",
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
                    "gasEth": "0.01574842",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.036",
                    "costEth": "1",
                    "avgPrice": "0.33333333333333333333"
                }, {
                    "action": "BID",
                    "shares": "2",
                    "gasEth": "0.01450404",
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
                    "gasEth": "0.01574842",
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
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.02119592",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0192",
                    "costEth": "1.2",
                    "avgPrice": "0.6"
                }, {
                    "action": "ASK",
                    "shares": "3",
                    "gasEth": "0.01393518",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0192",
                    "costEth": "1.2",
                    "avgPrice": "0.6"
                }, {
                    "action": "ASK",
                    "shares": "2",
                    "gasEth": "0.01393518",
                    "feeEth": "0.01152",
                    "costEth": "1.2",
                    "avgPrice": "0.6"
                }, {
                    "action": "SHORT_ASK",
                    "shares": "1",
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.02119592",
                    "feeEth": "0.0192",
                    "costEth": "-0.8",
                    "avgPrice": "0.6"
                }, {
                    "action": "SHORT_ASK",
                    "shares": "3",
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.02119592",
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
                    "gasEth": "0.02119592",
                    "feeEth": "0.0168",
                    "costEth": "-0.6",
                    "avgPrice": "0.7"
                }, {
                    "action": "SHORT_ASK",
                    "shares": "3",
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.02119592",
                    "feeEth": "0.0296",
                    "costEth": "-0.7",
                    "avgPrice": "0.76666666666666666667"
                }, {
                    "action": "SHORT_ASK",
                    "shares": "2",
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.02119592",
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
                    "gasEth": "0.01393518",
                    "feeEth": "0.01152",
                    "costEth": "1.2",
                    "avgPrice": "0.6"
                }, {
                    "action": "SHORT_ASK",
                    "shares": "3",
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0192",
                    "costEth": "1.2",
                    "avgPrice": "0.6"
                }, {
                    "action": "SHORT_SELL",
                    "shares": "3",
                    "gasEth": "0.02119592",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0192",
                    "costEth": "1.2",
                    "avgPrice": "0.6"
                }, {
                    "action": "SHORT_ASK",
                    "shares": "3",
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0168",
                    "costEth": "1.4",
                    "avgPrice": "0.7"
                }, {
                    "action": "SHORT_SELL",
                    "shares": "3",
                    "gasEth": "0.02119592",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0168",
                    "costEth": "1.4",
                    "avgPrice": "0.7"
                }, {
                    "action": "SHORT_ASK",
                    "shares": "3",
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0128",
                    "costEth": "1.6",
                    "avgPrice": "0.8"
                }, {
                    "action": "SHORT_SELL",
                    "shares": "1",
                    "gasEth": "0.02119592",
                    "feeEth": "0.0168",
                    "costEth": "-0.3",
                    "avgPrice": "0.7"
                }, {
                    "action": "SHORT_ASK",
                    "shares": "2",
                    "gasEth": "0.02791268",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0072",
                    "costEth": "1.8",
                    "avgPrice": "0.9"
                }, {
                    "action": "SHORT_SELL",
                    "shares": "3",
                    "gasEth": "0.02119592",
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
                    "gasEth": "0.01574842",
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
                    "gasEth": "0.01393518",
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
                    "gasEth": "0.01574842",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0192",
                    "costEth": "1.2",
                    "avgPrice": "0.6"
                }, {
                    "action": "ASK",
                    "shares": "3",
                    "gasEth": "0.01393518",
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
                    "gasEth": "0.01574842",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0168",
                    "costEth": "1.4",
                    "avgPrice": "0.7"
                }, {
                    "action": "ASK",
                    "shares": "3",
                    "gasEth": "0.01393518",
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
                    "gasEth": "0.01574842",
                    "feeEth": "0.0296",
                    "costEth": "2.3",
                    "avgPrice": "0.76666666666666666667"
                }, {
                    "action": "ASK",
                    "shares": "2",
                    "gasEth": "0.01393518",
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
                    "gasEth": "0.01574842",
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
                    "gasEth": "0.01574842",
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
