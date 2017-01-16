"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var utils = require("../../../src/utilities");
var abi = require("augur-abi");
// 42 tests total

describe.skip('CompositeGetters.loadNextMarketsBatch', function() {});
describe.skip('CompositeGetters.loadMarketsHelper', function() {});
describe('CompositeGetters.loadMarkets', function() {
    // 3 tests total
    var test = function(t) {
        it(t.description, function() {
            var loadMarketsHelper = augur.loadMarketsHelper;
            var getMarketsInfo = augur.augurNode.getMarketsInfo;
            augur.loadMarketsHelper = t.loadMarketsHelper;
            augur.augurNode.getMarketsInfo = t.getMarketsInfo;
            augur.augurNode.nodes = t.nodes;

            augur.loadMarkets(t.branchID, t.chunkSize, t.isDesc, t.chunkCB);

            loadMarketsHelper = augur.loadMarketsHelper;
            getMarketsInfo = augur.augurNode.getMarketsInfo;
        });
    };
    test({
        description: 'Should pass args to loadMarketsHelper if augurNode.nodes is an empty array',
        branchID: '101010',
        chunkSize: '10',
        isDesc: false,
        chunkCB: function(err, o) {
            // this isn't hit during this test - added an assertion that will fail if it gets hit.
            assert.isNull('chunkCB called');
        },
        nodes: [],
        loadMarketsHelper: function(branchID, chunkSize, isDesc, chunkCB) {
            assert.deepEqual(branchID, '101010');
            assert.deepEqual(chunkSize, '10');
            assert.deepEqual(isDesc, false);
            assert.isFunction(chunkCB);
        },
        getMarketsInfo: function(branchID, cb) {
            // this isn't hit during this test - added an assertion that will fail if it gets hit.
            assert.isNull('getMarketsInfo called');
        }
    });
    test({
        description: 'Should pass args to loadMarketsHelper if augurNode.nodes is populated but getMarketsInfo returns an error',
        branchID: '101010',
        chunkSize: '10',
        isDesc: false,
        chunkCB: function(err, o) {
            // this isn't hit during this test - added an assertion that will fail if it gets hit.
            assert.isNull('chunkCB called');
        },
        nodes: [],
        loadMarketsHelper: function(branchID, chunkSize, isDesc, chunkCB) {
            // we want to confirm that the augurNode.nodes was cleared after getting an error from getMarketsInfo
            assert.deepEqual(augur.augurNode.nodes, []);
            assert.deepEqual(branchID, '101010');
            assert.deepEqual(chunkSize, '10');
            assert.deepEqual(isDesc, false);
            assert.isFunction(chunkCB);
        },
        getMarketsInfo: function(branchID, cb) {
            assert.deepEqual(branchID, '101010');
            // pass back an error object
            cb({error: 'Uh-Oh!'});
        }
    });
    test({
        description: 'Should pass the loaded markets to chunkCB from getMarketsInfo',
        branchID: '101010',
        chunkSize: '10',
        isDesc: false,
        chunkCB: function(err, o) {
            assert.isNull(err);
            assert.deepEqual(o, { '0x0a1':
               { id: '0x0a1',
                 numOutcomes: '2',
                 type: 'binary',
                 blockNumber: '101010' } });
            // confirm that augurNode.nodes wasn't wiped out
            assert.deepEqual(augur.augurNode.nodes, ['https://test.augur.net/thisisfake', 'https://test2.augur.net/alsofake']);
        },
        nodes: ['https://test.augur.net/thisisfake', 'https://test2.augur.net/alsofake'],
        loadMarketsHelper: function(branchID, chunkSize, isDesc, chunkCB) {
            // This should not be called.
            assert.isNull('loadMarketsHelper called');
        },
        getMarketsInfo: function(branchID, cb) {
            assert.deepEqual(branchID, '101010');
            // pass back a dummy market json string
            cb(null, '{"0x0a1":{"id":"0x0a1","numOutcomes":"2","type":"binary","blockNumber":"101010"}}');
        }
    });
});
describe('CompositeGetters.loadAssets', function() {
    // 3 tests total
    var test = function(t) {
        it(t.description, function() {
            var getCashBalance = augur.getCashBalance;
            var getRepBalance = augur.getRepBalance;
            var balance = augur.rpc.balance;
            augur.getCashBalance = t.getCashBalance;
            augur.getRepBalance = t.getRepBalance;
            augur.rpc.balance = t.balance;

            augur.loadAssets(t.branchID, t.accountID, t.cbEther, t.cbRep, t.cbRealEther);

            augur.getCashBalance = getCashBalance;
            augur.getRepBalance = getRepBalance;
            augur.rpc.balance = balance;
        });
    };
    test({
        description: 'Should call all 3 callbacks passed with the values they expect when getCashBalance, getRepBalance, and rpc.balance all return non error values',
        branchID: '1010101',
        accountID: '0x0',
        cbEther: function(err, ether) {
            assert.isNull(err);
            assert.deepEqual(ether, '10000');
        },
        cbRep: function(err, rep) {
            assert.isNull(err);
            assert.deepEqual(rep, '47');
        },
        cbRealEther: function(err, wei) {
            assert.isNull(err);
            assert.deepEqual(wei, '2.5');
        },
        getCashBalance: function(branchID, cb) {
            // return 10,000 like the faucet
            cb(10000);
        },
        getRepBalance: function(branchID, accountID, cb) {
            // return 47 like the faucet
            cb(47);
        },
        balance: function(branchID, cb) {
            // return 2.5 like the faucet
            cb(2500000000000000000);
        }
    });
    test({
        description: 'Should call all 3 callbacks with errors when getCashBalance, getRepBalance, rpc.balance return error objects',
        branchID: '1010101',
        accountID: '0x0',
        cbEther: function(err, ether) {
            assert.isUndefined(ether);
            assert.deepEqual(err, { error: 'Uh-Oh!' });
        },
        cbRep: function(err, rep) {
            assert.isUndefined(rep);
            assert.deepEqual(err, { error: 'Uh-Oh!' });
        },
        cbRealEther: function(err, wei) {
            assert.isUndefined(wei);
            assert.deepEqual(err, { error: 'Uh-Oh!' });
        },
        getCashBalance: function(branchID, cb) {
            // return an error object
            cb({ error: 'Uh-Oh!' });
        },
        getRepBalance: function(branchID, accountID, cb) {
            // return an error object
            cb({ error: 'Uh-Oh!' });
        },
        balance: function(branchID, cb) {
            // return an error object
            cb({ error: 'Uh-Oh!' });
        }
    });
    test({
        description: 'Should call all 3 callbacks with undefined when getCashBalance, getRepBalance, rpc.balance return undefined',
        branchID: '1010101',
        accountID: '0x0',
        cbEther: function(err, ether) {
            assert.isUndefined(ether);
            assert.isUndefined(err);
        },
        cbRep: function(err, rep) {
            assert.isUndefined(rep);
            assert.isUndefined(err);
        },
        cbRealEther: function(err, wei) {
            assert.isUndefined(wei);
            assert.isUndefined(err);
        },
        getCashBalance: function(branchID, cb) {
            // return undefined
            cb(undefined);
        },
        getRepBalance: function(branchID, accountID, cb) {
            // return undefined
            cb(undefined);
        },
        balance: function(branchID, cb) {
            // return undefined
            cb(undefined);
        }
    });
});
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
describe('CompositeGetters.parseOrderBook', function() {
    // 5 tests total
    var test = function(t) {
        it(t.description, function() {
            t.assertions(augur.parseOrderBook(t.orderArray, t.scalarMinMax));
        });
    };
    test({
        description: 'should handle an order array with 2 trade orders in it, no scalar markets',
        orderArray: ['0x01', '0x1', '0x0a1', '100000000000000000000', '2530000000000000000', '0x0d1', '101010', '1', '0x02', '0x2', '0x0a2', '54200000000000000000000', '9320000000000000000000', '0x0d2', '101010', '2'],
        scalarMinMax: {},
        assertions: function(o) {
            assert.deepEqual(o, { buy:
               { '0x0000000000000000000000000000000000000000000000000000000000000001':
                  { id: '0x0000000000000000000000000000000000000000000000000000000000000001',
                    type: 'buy',
                    market: '0x0a1',
                    amount: '100',
                    fullPrecisionAmount: '100',
                    price: '2.53',
                    fullPrecisionPrice: '2.53',
                    owner: '0x00000000000000000000000000000000000000d1',
                    block: 1052688,
                    outcome: '1' } },
              sell:
               { '0x0000000000000000000000000000000000000000000000000000000000000002':
                  { id: '0x0000000000000000000000000000000000000000000000000000000000000002',
                    type: 'sell',
                    market: '0x0a2',
                    amount: '54200',
                    fullPrecisionAmount: '54200',
                    price: '9320',
                    fullPrecisionPrice: '9320',
                    owner: '0x00000000000000000000000000000000000000d2',
                    block: 1052688,
                    outcome: '2' }
                }
            });
        }
    });
    test({
        description: 'should handle an order array with 2 trade orders in it, with scalar markets',
        orderArray: ['0x01', '0x1', '0x0a1', '150000000000000000000', '80000000000000000000', '0x0d1', '101010', '1', '0x02', '0x1', '0x0a1', '736200000000000000000000', '12340000000000000000000', '0x0d1', '101010', '2'],
        scalarMinMax: { minValue: '10', maxValue: '140'},
        assertions: function(o) {
            assert.deepEqual(o, {
            	buy: {
            		'0x0000000000000000000000000000000000000000000000000000000000000001': {
            			id: '0x0000000000000000000000000000000000000000000000000000000000000001',
            			type: 'buy',
            			market: '0x0a1',
            			amount: '150',
            			fullPrecisionAmount: '150',
            			price: '90',
            			fullPrecisionPrice: '90',
            			owner: '0x00000000000000000000000000000000000000d1',
            			block: 1052688,
            			outcome: '1'
            		},
            		'0x0000000000000000000000000000000000000000000000000000000000000002': {
            			id: '0x0000000000000000000000000000000000000000000000000000000000000002',
            			type: 'buy',
            			market: '0x0a1',
            			amount: '736200',
            			fullPrecisionAmount: '736200',
            			price: '12350',
            			fullPrecisionPrice: '12350',
            			owner: '0x00000000000000000000000000000000000000d1',
            			block: 1052688,
            			outcome: '2'
            		}
            	},
            	sell: {}
            });
        }
    });
    test({
        description: 'should return a blank orderBook Object if orderArray is empty',
        orderArray: [],
        scalarMinMax: undefined,
        assertions: function(o) {
            assert.deepEqual(o, {buy: {}, sell: {}});
        }
    });
    test({
        description: 'should return orderArray passed in if orderArray is undefined',
        orderArray: undefined,
        scalarMinMax: undefined,
        assertions: function(o) {
            assert.isUndefined(o);
        }
    });
    test({
        description: 'should return orderArray passed in if orderArray is am object with an error key',
        orderArray: { error: 'Uh-Oh!' },
        scalarMinMax: { minValue: '10', maxValue: '140'},
        assertions: function(o) {
            assert.deepEqual(o, { error: 'Uh-Oh!' });
        }
    });
});
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
