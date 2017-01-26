"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var noop = require("../../../src/utilities").noop;
var BigNumber = require("bignumber.js");

// a function to quickly reset the callCounts object.
function ClearCallCounts(callCounts) {
    var keys = Object.keys(callCounts);
    for (keys in callCounts) {
        callCounts[keys] = 0;
    }
};

describe("takeOrder.placeBuy", function() {
    // 3 tests total
    var executeTrade = augur.executeTrade;
    var placeBid = augur.placeBid;
    var callCounts = {
        executeTrade: 0,
        placeBid: 0,
        tradeCommitLockCallback: 0
    };
    afterEach(function() {
        ClearCallCounts(callCounts);
        augur.executeTrade = executeTrade;
        augur.placeBid = placeBid;
    });
    var test = function(t) {
        it(t.description, function(done) {
            augur.executeTrade = t.executeTrade;
            augur.placeBid = t.placeBid;

            augur.placeBuy(t.market, t.outcomeID, t.numShares, t.limitPrice, t.address, t.totalCost, t.tradingFees, t.orderBooks, t.doNotMakeOrders, t.tradeGroupID, t.tradeCommitmentCallback, t.tradeCommitLockCallback);

            t.assertions(done);
        });
    };
    test({
        description: 'Should return if an error is returned from executeTrade',
        market: { id: '0xa1' },
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '51',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} }},
        doNotMakeOrders: true,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeTrade: function(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeTrade++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '1');
            assert.equal(numShares, 0);
            assert.equal(totalEthWithFee, '51');
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb({ error: 999, message: 'Uh-Oh!' }, undefined);
        },
        placeBid: function(market, outcomeID, sharesRemaining, limitPrice, tradeGroupID) {
            callCounts.placeBid++;
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                executeTrade: 1,
                placeBid: 0,
                tradeCommitLockCallback: 2
            });
            done();
        }
    });
    test({
        description: 'Should handle a placedBuy that is filled in one trade',
        market: { id: '0xa1' },
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '51',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} }},
        doNotMakeOrders: true,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeTrade: function(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeTrade++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '1');
            assert.equal(numShares, 0);
            assert.equal(totalEthWithFee, '51');
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb(null, { filledShares: new BigNumber('100'), remainingEth: new BigNumber('0') });
        },
        placeBid: function(market, outcomeID, sharesRemaining, limitPrice, tradeGroupID) {
            callCounts.placeBid++;
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                executeTrade: 1,
                placeBid: 0,
                tradeCommitLockCallback: 2
            });
            done();
        }
    });
    test({
        description: 'Should handle a placedBuy that is partially filled, then place a bid for the remaining shares using the remaining eth',
        market: { id: '0xa1' },
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '51',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} }},
        doNotMakeOrders: false,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeTrade: function(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeTrade++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '1');
            assert.equal(numShares, 0);
            assert.equal(totalEthWithFee, '51');
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb(null, { filledShares: new BigNumber('80'), remainingEth: new BigNumber('10.1') });
        },
        placeBid: function(market, outcomeID, sharesRemaining, limitPrice, tradeGroupID) {
            callCounts.placeBid++;
            assert.deepEqual(market, { id: '0xa1' });
            assert.equal(outcomeID, '1');
            assert.equal(sharesRemaining, '20');
            assert.equal(limitPrice, '0.5');
            assert.equal(tradeGroupID, '0x000abc123');
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                executeTrade: 1,
                placeBid: 1,
                tradeCommitLockCallback: 2
            });
            done();
        }
    });
});

describe("takeOrder.placeSell", function() {
    // ? tests total
    var executeTrade = augur.executeTrade;
    var getParticipantSharesPurchased = augur.getParticipantSharesPurchased;
    var placeAsk = augur.placeAsk;
    var placeShortAsk = augur.placeShortAsk;
    var getOrderBook = augur.getOrderBook;
    var calculateSellTradeIDs = augur.calculateSellTradeIDs;
    var placeShortSell = augur.placeShortSell;
    var callCounts = {
        executeTrade: 0,
        getParticipantSharesPurchased: 0,
        placeAsk: 0,
        placeShortAsk: 0,
        getOrderBook: 0,
        calculateSellTradeIDs: 0,
        placeShortSell: 0,
        tradeCommitLockCallback: 0
    };
    afterEach(function() {
        ClearCallCounts(callCounts);
        augur.executeTrade = executeTrade;
        augur.getParticipantSharesPurchased = getParticipantSharesPurchased;
        augur.placeAsk = placeAsk;
        augur.placeShortAsk = placeShortAsk;
        augur.getOrderBook = getOrderBook;
        augur.calculateSellTradeIDs = calculateSellTradeIDs;
        augur.placeShortSell = placeShortSell;
    });
    var test = function(t) {
        it(t.description, function(done) {
            augur.executeTrade = t.executeTrade;
            augur.getParticipantSharesPurchased = t.getParticipantSharesPurchased;
            augur.placeAsk = t.placeAsk;
            augur.placeShortAsk = t.placeShortAsk;
            augur.getOrderBook = t.getOrderBook;
            augur.calculateSellTradeIDs = t.calculateSellTradeIDs;
            augur.placeShortSell = t.placeShortSell;

            augur.placeSell(t.market, t.outcomeID, t.numShares, t.limitPrice, t.address, t.totalCost, t.tradingFees, t.orderBooks, t.doNotMakeOrders, t.tradeGroupID, t.tradeCommitmentCallback, t.tradeCommitLockCallback);

            t.assertions(done);
        });
    };
    test({
        description: 'Should handle an error from executeTrade.',
        market: { id: '0xa1' },
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '51',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} } },
        doNotMakeOrders: true,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeTrade: function(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeTrade++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '1');
            assert.equal(numShares, '100');
            assert.equal(totalEthWithFee, 0);
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb({ error: 999, message: 'Uh-Oh!' }, undefined);
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
        },
        placeAsk: function(market, outcomeID, askShares, limitPrice, tradeGroupID) {
            callCounts.placeAsk++;
        },
        placeShortAsk: function(market, outcomeID, shortAskShares, limitPrice, tradeGroupID) {
            callCounts.placeShortAsk++;
        },
        getOrderBook: function(marketID, cb) {
            callCounts.getOrderBook++;
        },
        calculateSellTradeIDs: function(marketID, outcomeID, limitPrice, orderBook, address) {
            callCounts.calculateSellTradeIDs++;
        },
        placeShortSell: function(market, outcomeID, remainingShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback) {
            callCounts.placeShortSell++;
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                executeTrade: 1,
                getParticipantSharesPurchased: 0,
                placeAsk: 0,
                placeShortAsk: 0,
                getOrderBook: 0,
                calculateSellTradeIDs: 0,
                placeShortSell: 0,
                tradeCommitLockCallback: 2
            });
            done();
        }
    });
    test({
        description: 'Should handle a sell order where the order is completely filled by the executeTrade call',
        market: { id: '0xa1' },
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '51',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} } },
        doNotMakeOrders: true,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeTrade: function(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeTrade++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '1');
            assert.equal(numShares, '100');
            assert.equal(totalEthWithFee, 0);
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb(null, { remainingShares: new BigNumber('0') });
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
        },
        placeAsk: function(market, outcomeID, askShares, limitPrice, tradeGroupID) {
            callCounts.placeAsk++;
        },
        placeShortAsk: function(market, outcomeID, shortAskShares, limitPrice, tradeGroupID) {
            callCounts.placeShortAsk++;
        },
        getOrderBook: function(marketID, cb) {
            callCounts.getOrderBook++;
        },
        calculateSellTradeIDs: function(marketID, outcomeID, limitPrice, orderBook, address) {
            callCounts.calculateSellTradeIDs++;
        },
        placeShortSell: function(market, outcomeID, remainingShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback) {
            callCounts.placeShortSell++;
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                executeTrade: 1,
                getParticipantSharesPurchased: 0,
                placeAsk: 0,
                placeShortAsk: 0,
                getOrderBook: 0,
                calculateSellTradeIDs: 0,
                placeShortSell: 0,
                tradeCommitLockCallback: 2
            });
            done();
        }
    });
    test({
        description: 'Should handle a sell order where the order is only partially filled by the sell order and we have a position still but are looking to short ask as well.',
        market: { id: '0xa1' },
        outcomeID: '1',
        numShares: '100',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '51',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} } },
        doNotMakeOrders: false,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeTrade: function(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeTrade++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '1');
            assert.equal(numShares, '100');
            assert.equal(totalEthWithFee, 0);
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            cb(null, { remainingShares: new BigNumber('40') });
        },
        getParticipantSharesPurchased: function(marketID, address, outcomeID, cb) {
            callCounts.getParticipantSharesPurchased++;
            assert.equal(marketID, '0xa1');
            assert.equal(address, '0x1');
            assert.equal(outcomeID, '1');
            cb('10');
        },
        placeAsk: function(market, outcomeID, askShares, limitPrice, tradeGroupID) {
            callCounts.placeAsk++;
            assert.deepEqual(market, { id: '0xa1' });
            assert.equal(outcomeID, '1');
            assert.equal(askShares, new BigNumber('10'));
            assert.equal(limitPrice, '0.5');
            assert.equal(tradeGroupID, '0x000abc123');
        },
        placeShortAsk: function(market, outcomeID, shortAskShares, limitPrice, tradeGroupID) {
            callCounts.placeShortAsk++;
            assert.deepEqual(market, { id: '0xa1' });
            assert.equal(outcomeID, '1');
            assert.equal(shortAskShares, new BigNumber('30'));
            assert.equal(limitPrice, '0.5');
            assert.equal(tradeGroupID, '0x000abc123');
        },
        getOrderBook: function(marketID, cb) {
            callCounts.getOrderBook++;
        },
        calculateSellTradeIDs: function(marketID, outcomeID, limitPrice, orderBook, address) {
            callCounts.calculateSellTradeIDs++;
        },
        placeShortSell: function(market, outcomeID, remainingShares, limitPrice, address, totalCost, tradingFees, orderBooks, tradeGroupID, tradeCommitmentCallback) {
            callCounts.placeShortSell++;
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                executeTrade: 1,
                getParticipantSharesPurchased: 1,
                placeAsk: 1,
                placeShortAsk: 1,
                getOrderBook: 0,
                calculateSellTradeIDs: 0,
                placeShortSell: 0,
                tradeCommitLockCallback: 2
            });
            done();
        }
    });
});

describe("takeOrder.placeShortSell", function() {
    // 3 tests total
    var executeShortSell = augur.executeShortSell;
    var placeShortAsk = augur.placeShortAsk;
    var callCounts = {
        tradeCommitLockCallback: 0,
        executeShortSell: 0,
        placeShortAsk: 0
    };
    afterEach(function() {
        ClearCallCounts(callCounts);
        augur.executeShortSell = executeShortSell;
        augur.placeShortAsk = placeShortAsk;
    });
    var test = function(t) {
        it(t.description, function(done) {
            augur.executeShortSell = t.executeShortSell;
            augur.placeShortAsk = t.placeShortAsk;

            augur.placeShortSell(t.market, t.outcomeID, t.numShares, t.limitPrice, t.address, t.totalCost, t.tradingFees, t.orderBooks, t.doNotMakeOrders, t.tradeGroupID, t.tradeCommitmentCallback, t.tradeCommitLockCallback);

            t.assertions(done);
        });
    };
    test({
        description: 'Should handle an error from executeShortSell',
        market: { id: '0xa1' },
        outcomeID: '2',
        numShares: '50',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '25.5',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} } },
        doNotMakeOrders: true,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeShortSell: function(marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeShortSell++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '2');
            assert.equal(numShares, '50');
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb({ error: 999, message: 'Uh-Oh!' }, undefined);
        },
        placeShortAsk: function(market, outcomeID, remainingShares, limitPrice, tradeGroupID) {
            callCounts.placeShortAsk++;
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                tradeCommitLockCallback: 2,
                executeShortSell: 1,
                placeShortAsk: 0
            });
            done();
        }
    });
    test({
        description: 'Should call executeShortSell and completely fill the sell order',
        market: { id: '0xa1' },
        outcomeID: '2',
        numShares: '50',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '25.5',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} } },
        doNotMakeOrders: true,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeShortSell: function(marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeShortSell++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '2');
            assert.equal(numShares, '50');
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb(null, { remainingShares: new BigNumber('0') });
        },
        placeShortAsk: function(market, outcomeID, remainingShares, limitPrice, tradeGroupID) {
            callCounts.placeShortAsk++;
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                tradeCommitLockCallback: 2,
                executeShortSell: 1,
                placeShortAsk: 0
            });
            done();
        }
    });
    test({
        description: 'Should call executeShortSell and partially fill the sell order, then place a shortAsk for the rest of the order',
        market: { id: '0xa1' },
        outcomeID: '2',
        numShares: '50',
        limitPrice: '0.5',
        address: '0x1',
        totalCost: '25.5',
        tradingFees: '0.01',
        orderBooks: { '0xa1': { buy: {}, sell: {} } },
        doNotMakeOrders: false,
        tradeGroupID: '0x000abc123',
        tradeCommitmentCallback: noop,
        tradeCommitLockCallback: function(lock) {
            callCounts.tradeCommitLockCallback++;
            switch(callCounts.tradeCommitLockCallback) {
            case 2:
                assert.isFalse(lock);
                break;
            default:
                assert.isTrue(lock);
                break;
            }
        },
        executeShortSell: function(marketID, outcomeID, numShares, tradingFees, tradeGroupID, address, orderBooks, getTradeIDs, tradeCommitmentCallback, cb) {
            callCounts.executeShortSell++;
            assert.equal(marketID, '0xa1');
            assert.equal(outcomeID, '2');
            assert.equal(numShares, '50');
            assert.equal(tradingFees, '0.01');
            assert.equal(tradeGroupID, '0x000abc123');
            assert.equal(address, '0x1');
            assert.deepEqual(orderBooks, { '0xa1': { buy: {}, sell: {} }});
            assert.isFunction(getTradeIDs);
            assert.isFunction(tradeCommitmentCallback);
            // return an error in this case
            cb(null, { remainingShares: new BigNumber('10') });
        },
        placeShortAsk: function(market, outcomeID, remainingShares, limitPrice, tradeGroupID) {
            callCounts.placeShortAsk++;
            assert.deepEqual(market, { id: '0xa1' });
            assert.equal(outcomeID, '2');
            assert.equal(remainingShares, '10');
            assert.equal(limitPrice, '0.5');
            assert.equal(tradeGroupID, '0x000abc123');
        },
        assertions: function(done) {
            assert.deepEqual(callCounts, {
                tradeCommitLockCallback: 2,
                executeShortSell: 1,
                placeShortAsk: 1
            });
            done();
        }
    });
});
