"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var utils = require("../../../src/utilities");
var abi = require("augur-abi");
// 7 tests total

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
describe.skip('CompositeGetters.loadBranch', function() {});
describe.skip('CompositeGetters.parsePositionInMarket', function() {});
describe.skip('CompositeGetters.getPositionInMarket', function() {});
describe.skip('CompositeGetters.adjustScalarOrder', function() {});
describe.skip('CompositeGetters.parseOrderBook', function() {});
describe.skip('CompositeGetters.getOrderBook', function() {});
describe.skip('CompositeGetters.validateMarketInfo', function() {});
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
