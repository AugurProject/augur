"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var utils = require("../../../src/utilities");
var abi = require("augur-abi");
// 31 tests total

describe.skip('CompositeGetters.loadNextMarketsBatch', function() {});
describe.skip('CompositeGetters.loadMarketsHelper', function() {});
describe.skip('CompositeGetters.loadMarkets', function() {});
describe.skip('CompositeGetters.loadAssets', function() {});
describe('CompositeGetters.finishLoadBranch', function() {
    // 2 tests total
    var callbackCallCount = 0;
    var test = function(t) {
        it(t.description, function() {
            // we will increment the callback callcount each time it is called to test if the conditional hit the callback or not.
            callbackCallCount = 0;
            t.assertions(augur.finishLoadBranch(t.branch, t.callback));
        });
    };
    test({
        description: 'Should do nothing if the branch passed does not meet the critieria',
        branch: {id: '0x0', periodLength: undefined, description: undefined, baseReporters: undefined },
        callback: function(err, branch) {
            callbackCallCount++;
        },
        assertions: function() {
            // This test shouldn't have called callback at all, so we are confirming the callcount is 0 still after calling finishLoadBranch with an undefined branch argument.
            assert.deepEqual(callbackCallCount, 0);
        }
    });
    test({
        description: 'Should do nothing if the branch passed does not meet the critieria',
        branch: {
            id: '0x0',
            periodLength: '100',
            description: 'This is a branch description',
            baseReporters: ['0x01', '0x02'],
        },
        callback: function(err, branch) {
            callbackCallCount++;
            assert.isNull(err);
            assert.deepEqual(branch, {
                id: '0x0',
                periodLength: '100',
                description: 'This is a branch description',
                baseReporters: ['0x01', '0x02'],
            });
        },
        assertions: function() {
            // This test should have called the callback 1 time, confirm the callcount.
            assert.deepEqual(callbackCallCount, 1);
        }
    });
});
describe('CompositeGetters.loadBranch', function() {
    // 7 tests total
    var test = function(t) {
        it(t.description, function() {
            var getPeriodLength = augur.getPeriodLength;
            var getDescription = augur.getDescription;
            var getBaseReporters = augur.getBaseReporters;
            augur.getPeriodLength = t.getPeriodLength;
            augur.getDescription = t.getDescription;
            augur.getBaseReporters = t.getBaseReporters;

            augur.loadBranch(t.branchID, t.callback);

            augur.getPeriodLength = getPeriodLength;
            augur.getDescription = getDescription;
            augur.getBaseReporters = getBaseReporters;
        });
    };
    test({
        description: 'Should return a branch after getPeriodLength, getDescription, and getBaseReporters return their expected values',
        branchID: '1010101',
        callback: function(err, branch) {
            assert.isNull(err);
            assert.deepEqual(branch, { id: '0xf69b5', periodLength: 100, description: 'this is a description for the branch', baseReporters: 25 });
        },
        getPeriodLength: function(branch, cb) {
            cb(100);
        },
        getDescription: function(branch, cb) {
            cb('this is a description for the branch');
        },
        getBaseReporters: function(branch, cb) {
            cb(25);
        }
    });
    test({
        description: 'Should return an error after getPeriodLength returns undefined.',
        branchID: '1010101',
        callback: function(err, branch) {
            assert.isUndefined(err);
            assert.isUndefined(branch);
        },
        getPeriodLength: function(branch, cb) {
            cb(undefined);
        },
        getDescription: function(branch, cb) {
            // shouldn't be hit
            cb('this is a description for the branch');
        },
        getBaseReporters: function(branch, cb) {
            // shouldn't be hit
            cb(25);
        }
    });
    test({
        description: 'Should return an error Object after getPeriodLength returns an Object with an error key.',
        branchID: '1010101',
        callback: function(err, branch) {
            assert.deepEqual(err, {error: 'Uh-Oh!'});
            assert.isUndefined(branch);
        },
        getPeriodLength: function(branch, cb) {
            cb({error: 'Uh-Oh!'});
        },
        getDescription: function(branch, cb) {
            // shouldn't be hit
            cb('this is a description for the branch');
        },
        getBaseReporters: function(branch, cb) {
            // shouldn't be hit
            cb(25);
        }
    });
    test({
        description: 'Should return an error after getDescription returns undefined.',
        branchID: '1010101',
        callback: function(err, branch) {
            assert.isUndefined(err);
            assert.isUndefined(branch);
        },
        getPeriodLength: function(branch, cb) {
            cb(100);
        },
        getDescription: function(branch, cb) {
            cb(undefined);
        },
        getBaseReporters: function(branch, cb) {
            // shouldn't be hit
            cb(25);
        }
    });
    test({
        description: 'Should return an error Object after getDescription returns an Object with an error key.',
        branchID: '1010101',
        callback: function(err, branch) {
            assert.deepEqual(err, {error: 'Uh-Oh!'});
            assert.isUndefined(branch);
        },
        getPeriodLength: function(branch, cb) {
            cb(100);
        },
        getDescription: function(branch, cb) {
            cb({error: 'Uh-Oh!'});
        },
        getBaseReporters: function(branch, cb) {
            // shouldn't be hit
            cb(25);
        }
    });
    test({
        description: 'Should return an error after getBaseReporters returns undefined.',
        branchID: '1010101',
        callback: function(err, branch) {
            assert.isUndefined(err);
            assert.isUndefined(branch);
        },
        getPeriodLength: function(branch, cb) {
            cb(100);
        },
        getDescription: function(branch, cb) {
            cb('this is a description for the branch');
        },
        getBaseReporters: function(branch, cb) {
            cb(undefined);
        }
    });
    test({
        description: 'Should return an error Object after getBaseReporters returns an Object with an error key.',
        branchID: '1010101',
        callback: function(err, branch) {
            assert.deepEqual(err, {error: 'Uh-Oh!'});
            assert.isUndefined(branch);
        },
        getPeriodLength: function(branch, cb) {
            cb(100);
        },
        getDescription: function(branch, cb) {
            cb('this is a description for the branch');
        },
        getBaseReporters: function(branch, cb) {
            cb({error: 'Uh-Oh!'});
        }
    });
});
describe('CompositeGetters.parsePositionInMarket', function() {
    // 4 tests total
    var test = function(t) {
        it(t.description, function() {
            t.assertions(augur.parsePositionInMarket(t.positionInMarket));
        });
    };
    test({
        description: 'Should should return undefined if positionInMarket is undefined',
        positionInMarket: undefined,
        assertions: function(o) {
            assert.isUndefined(o);
        }
    });
    test({
        description: 'Should should return positionInMarket if positionInMarket is an object with an error key',
        positionInMarket: { error: 'Uh-Oh!' },
        assertions: function(o) {
            assert.deepEqual(o, { error: 'Uh-Oh!' });
        }
    });
    test({
        description: 'Should should return position object broken down by outcomes passed in positionInMarket',
        positionInMarket: ['1000000000000000000000', false, '231023558000000'],
        assertions: function(o) {
            assert.deepEqual(o, {'1': '1000', '2': '0', '3': '0.000231023558'});
        }
    });
    test({
        description: 'Should should return empty position object if positionInMarket is an empty array',
        positionInMarket: [],
        assertions: function(o) {
            assert.deepEqual(o, {});
        }
    });
});
describe('CompositeGetters.getPositionInMarket', function() {
    // 4 tests total
    var test = function(t) {
        it(t.description, function() {
            var getPositionInMarket = augur.CompositeGetters.getPositionInMarket;
            // we are going to pass our test assertions as our getPositionInMarket contract function
            augur.CompositeGetters.getPositionInMarket = t.assertions;

            augur.getPositionInMarket(t.market, t.account, t.callback);

            augur.CompositeGetters.getPositionInMarket = getPositionInMarket;
        });
    };
    test({
        description: 'Should prepare and pass the arguments to the getPositionInMarket Augur Contract CompositeGetters function.',
        market: '0x0a1',
        account: '0x0',
        callback: utils.noop,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            assert.deepEqual(account, '0x0');
            assert.deepEqual(callback, utils.noop);
        }
    });
    test({
        description: 'Should handle account passed as the cb and pass the arguments to the getPositionInMarket Augur Contract CompositeGetters function.',
        market: '0x0a1',
        account: utils.noop,
        callback: undefined,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            // in this case we didn't pass account so we expect it to be augur.from, however this is null by default so that's what we are confirming here.
            assert.isNull(account);
            assert.deepEqual(callback, utils.noop);
        }
    });
    test({
        description: 'Should handle only 1 argument object and pass the arguments to the getPositionInMarket Augur Contract CompositeGetters function.',
        market: { market: '0x0a1', callback: utils.noop, account: '0x0' },
        account: undefined,
        callback: undefined,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            assert.deepEqual(account, '0x0');
            assert.deepEqual(callback, utils.noop);
        }
    });
    test({
        description: 'Should handle only 1 argument object as market but also a callback still passed and pass the arguments to the getPositionInMarket Augur Contract CompositeGetters function.',
        market: { market: '0x0a1', account: '0x0' },
        account: utils.noop,
        callback: undefined,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            assert.deepEqual(account, '0x0');
            assert.deepEqual(callback, utils.noop);
        }
    });
});
describe('CompositeGetters.adjustScalarOrder', function() {
    // 2 tests total
    var test = function(t) {
        it(t.description, function() {
            t.assertions(augur.adjustScalarOrder(t.order, t.minValue));
        });
    };
    test({
        description: 'Should handle adjusting an order passed with just a price',
        order: { price: '25' },
        minValue: '10',
        assertions: function(o) {
            assert.deepEqual(o, { price: '35', fullPrecisionPrice: '45' });
        }
    });
    test({
        description: 'Should handle adjusting an order passed with a price and fullPrecisionPrice',
        order: { price: '15', fullPrecisionPrice: '30' },
        minValue: '-5',
        assertions: function(o) {
            assert.deepEqual(o, { price: '10', fullPrecisionPrice: '25' });
        }
    });
});
describe.skip('CompositeGetters.parseOrderBook', function() {});
describe('CompositeGetters.getOrderBook', function() {
    // 4 tests total
    var test = function(t) {
        it(t.description, function() {
            var fire = augur.fire;
            // use fire as our assertions...
            augur.fire = t.assertions;

            augur.getOrderBook(t.market, t.scalarMinMax, t.callback);

            augur.fire = fire;
        });
    };
    test({
        description: 'Should handle scalarMinMax being passed as a callback',
        market: '0x0a1',
        scalarMinMax: utils.noop,
        callback: undefined,
        assertions: function(tx, callback, parseOrderBook, scalarMinMax) {
            assert.isNull(scalarMinMax);
            assert.deepEqual(tx.params, ['0x0a1', 0, 0]);
            assert.deepEqual(tx.to, augur.tx.CompositeGetters.getOrderBook.to);
        }
    });
    test({
        description: 'Should handle a market Object with only minimal key/values with an undefined scalarMinMax and a callback passed',
        market: { market: '0x0a1' },
        scalarMinMax: undefined,
        callback: utils.noop,
        assertions: function(tx, callback, parseOrderBook, scalarMinMax) {
            assert.isUndefined(scalarMinMax);
            assert.deepEqual(tx.params, ['0x0a1', 0, 0]);
            assert.deepEqual(tx.to, augur.tx.CompositeGetters.getOrderBook.to);
        }
    });
    test({
        description: 'Should handle a market Object as only argument with an undefined scalarMinMax',
        market: { market: '0x0a1', offset: 2, numTradesToLoad: 10, scalarMinMax: undefined, callback: utils.noop },
        scalarMinMax: undefined,
        callback: undefined,
        assertions: function(tx, callback, parseOrderBook, scalarMinMax) {
            assert.isUndefined(scalarMinMax);
            assert.deepEqual(tx.params, ['0x0a1', 2, 10]);
            assert.deepEqual(tx.to, augur.tx.CompositeGetters.getOrderBook.to);
        }
    });
    test({
        description: 'Should handle a market Object as only argument with a scalarMinMax',
        market: { market: '0x0a1', offset: 1, numTradesToLoad: 25, scalarMinMax: { minValue: '-10', maxValue: '110' }, callback: utils.noop },
        scalarMinMax: undefined,
        callback: undefined,
        assertions: function(tx, callback, parseOrderBook, scalarMinMax) {
            assert.deepEqual(scalarMinMax, { minValue: '-10', maxValue: '110' });
            assert.deepEqual(tx.params, ['0x0a1', 1, 25]);
            assert.deepEqual(tx.to, augur.tx.CompositeGetters.getOrderBook.to);
        }
    });
});
describe('CompositeGetters.validateMarketInfo', function() {
    // 3 tests total
    var test = function(t) {
        it(t.description, function() {
            var parseMarketInfo = augur.parseMarketInfo;
            augur.parseMarketInfo = t.parseMarketInfo;

            t.assertions(augur.validateMarketInfo(t.marketInfo));

            augur.parseMarketInfo = parseMarketInfo;
        });
    };
    test({
        description: 'Should return null if marketInfo is undefined',
        marketInfo: undefined,
        assertions: function(o) {
            assert.isNull(o);
        }
    });
    test({
        description: 'Should return null if parseMarketInfo returns parsedMarketInfo that does not contain a numOutcomes key',
        marketInfo: {},
        parseMarketInfo: function(marketInfo) {
            // return an empty object so it fails the next conditional statement.
            return {};
        },
        assertions: function(o) {
            assert.isNull(o);
        }
    });
    test({
        description: 'Should return parsedMarketInfo',
        marketInfo: {},
        parseMarketInfo: function(marketInfo) {
            // return an object that has a numOutcomes key so that it will pass the next conditional and return our parsedMarketInfo.
            return { numOutcomes: 2 };
        },
        assertions: function(o) {
            assert.deepEqual(o, { numOutcomes: 2 });
        }
    });
});
describe('CompositeGetters.getMarketInfo', function() {
    // 5 tests total
    var test = function(t) {
        it(t.description, function() {
            var getMarketInfo = augur.CompositeGetters.getMarketInfo;
            // we are going to pass our test assertions as our getMarketInfo contract function
            augur.CompositeGetters.getMarketInfo = t.assertions;

            augur.getMarketInfo(t.market, t.account, t.callback);

            augur.CompositeGetters.getMarketInfo = getMarketInfo;
        });
    };
    test({
        description: 'Should prepare and pass the arguments to the getMarketInfo Augur Contract CompositeGetters function.',
        market: '0x0a1',
        account: '0x0',
        callback: utils.noop,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            assert.deepEqual(account, '0x0');
            assert.deepEqual(callback, utils.noop);
        }
    });
    test({
        description: 'Should accept only one object argument but account is undefined and prepare and pass the arguments to the getMarketInfo Augur Contract CompositeGetters function.',
        market: { market: '0x0a1', callback: utils.noop },
        account: undefined,
        callback: undefined,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            assert.deepEqual(account, 0);
            assert.deepEqual(callback, utils.noop);
        }
    });
    test({
        description: 'Should accept a market object argument with callback passed seperately and prepare and pass the arguments to the getMarketInfo Augur Contract CompositeGetters function.',
        market: { market: '0x0a1', account: '0x0' },
        account: undefined,
        callback: utils.noop,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            assert.deepEqual(account, '0x0');
            assert.deepEqual(callback, utils.noop);
        }
    });
    test({
        description: 'Should accept a market object argument with callback passed seperately and prepare and pass the arguments to the getMarketInfo Augur Contract CompositeGetters function.',
        market: { market: '0x0a1', account: '0x0' },
        account: undefined,
        callback: utils.noop,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            assert.deepEqual(account, '0x0');
            assert.deepEqual(callback, utils.noop);
        }
    });
    test({
        description: 'Should arguments with callback passed as account and prepare and pass the arguments to the getMarketInfo Augur Contract CompositeGetters function.',
        market: '0x0a1',
        account: utils.noop,
        callback: undefined,
        assertions: function(market, account, callback) {
            assert.deepEqual(market, '0x0a1');
            assert.deepEqual(account, 0);
            assert.deepEqual(callback, utils.noop);
        }
    });
});
describe.skip('CompositeGetters.parseBatchMarketInfo', function() {});
describe.skip('CompositeGetters.batchGetMarketInfo', function() {});
describe.skip('CompositeGetters.parseMarketsInfo', function() {});
describe.skip('CompositeGetters.getMarketsInfo', function() {});
