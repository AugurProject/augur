"use strict";

var assert = require('chai').assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var augur = require('../../../src');
var utils = require('../../../src/utilities.js');
// 14 tests total

describe("generateOrderBook", function() {
    // 14 tests total
    /**
     * generateOrderBook: convenience method for generating an initial order book
     * for a newly created market. generateOrderBook calculates the number of
     * orders to create, as well as the spacing between orders.
     *
     * @param {Object} p
     *     market: market ID
     *     liquidity: initial cash to be placed on the order book
     *     initialFairPrices: array of midpoints used for bid/offer prices when the market opens
     *     startingQuantity: number of shares in each order
     *     bestStartingQuantity: number of shares in best bid/offer orders (optional)
     *     priceWidth: spread between best bid/offer
     *     isSimulation: if falsy generate order book; otherwise pass basic info to onSimulate callback
     * @param {Object} cb
     *     onSimulate, onBuyCompleteSets, onSetupOutcome, onSetupOrder, onSuccess, onFailed
     *     (note: callbacks can also be properties of the p object)
     */
    var getMarketInfo = augur.getMarketInfo;
    var buyCompleteSets = augur.buyCompleteSets;
    var buy = augur.buy;
    var sell = augur.sell;
    var getOrderBook = augur.getOrderBook;
    afterEach(function() {
        augur.getMarketInfo = getMarketInfo;
        augur.buyCompleteSets = buyCompleteSets;
        augur.buy = buy;
        augur.sell = sell;
        augur.getOrderBook = getOrderBook;
    });
    var test = function(t) {
        // This function is async by default so lets do async tests only.
        it(t.description + ' async', function(done) {
            augur.getMarketInfo = t.getMarketInfo;
            augur.buyCompleteSets = t.buyCompleteSets;
            augur.buy = t.buy,
            augur.sell = t.sell,
            augur.getOrderBook = t.getOrderBook;
            // bcecause we are using the same object to drive async and sync tests we will use the following code to wrap our final assertion function so that we can call done when the async functions are finished.
            var functionToReplace = t.cb[t.assertionFunction];
            var assertion = function(input) {
                functionToReplace(input);
                done();
            };
            t.cb[t.assertionFunction] = assertion;
            // now that we have wrapped our assertion function we will start the test...
            augur.generateOrderBook(t.p, t.cb);
        });
    };
    test({
        description: 'Should handle missing marketInfo and call onFailed with an error.',
        p: {
    		market: '0xa1',
    		liquidity: 10000,
    		initialFairPrices: ['0.506573092', '0.49422020'],
    		startingQuantity: 501,
    		bestStartingQuantity: 500,
    		priceWidth: '0.0812',
    		isSimulation: false
    	},
    	cb: {
    		onSimulate: function(simulation) {},
    		onBuyCompleteSets: function(res) {},
    		onSetupOutcome: function(outcome) {},
    		onSetupOrder: function(order) {},
    		onSuccess: function(orderBook) {},
    		onFailed: function(err) {
                // this callback should be called, lets assert we get the expected error back.
                assert.deepEqual(err, augur.errors.NO_MARKET_INFO);
            }
    	},
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo that is undefined
            callback(undefined);
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle marketInfo that has a different number of outcomes then expected, should call onFailed.',
        p: {
    		market: '0xa1',
    		liquidity: 10000,
    		initialFairPrices: ['0.506573092', '0.49422020'],
    		startingQuantity: 501,
    		bestStartingQuantity: 500,
    		priceWidth: '0.0812',
    		isSimulation: false
    	},
    	cb: {
    		onSimulate: function(simulation) {},
    		onBuyCompleteSets: function(res) {},
    		onSetupOutcome: function(outcome) {},
    		onSetupOrder: function(order) {},
    		onSuccess: function(orderBook) {},
    		onFailed: function(err) {
                // this callback should be called, lets assert we get the expected error back.
                assert.deepEqual(err, augur.errors.WRONG_NUMBER_OF_OUTCOMES);
            }
    	},
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return a market with numOutcomes != initialFairPrices.length (this array should have an entry for each # of outcomes);
            callback({ numOutcomes: 5 });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market where priceDepth is less than or equal to 0, triggering an onFailed called.',
        p: {
    		market: '0xa1',
    		liquidity: 100,
    		initialFairPrices: ['0.506573092', '0.49422020'],
    		startingQuantity: 501,
    		bestStartingQuantity: 500,
    		priceWidth: '0.0812',
    		isSimulation: false
    	},
    	cb: {
    		onSimulate: function(simulation) {},
    		onBuyCompleteSets: function(res) {},
    		onSetupOutcome: function(outcome) {},
    		onSetupOrder: function(order) {},
    		onSuccess: function(orderBook) {},
    		onFailed: function(err) {
                // this callback should be called, lets assert we get the expected error back.
                assert.deepEqual(err, augur.errors.INSUFFICIENT_LIQUIDITY);
            }
    	},
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market where priceDepth is Infinity, triggering an onFailed called.',
        p: {
    		market: '0xa1',
    		liquidity: 100,
    		initialFairPrices: ['0.506573092', '0.49422020'],
    		startingQuantity: 51,
    		bestStartingQuantity: 50,
    		priceWidth: '0.0812',
    		isSimulation: false
    	},
    	cb: {
    		onSimulate: function(simulation) {},
    		onBuyCompleteSets: function(res) {},
    		onSetupOutcome: function(outcome) {},
    		onSetupOrder: function(order) {},
    		onSuccess: function(orderBook) {},
    		onFailed: function(err) {
                // this callback should be called, lets assert we get the expected error back.
                assert.deepEqual(err, augur.errors.INSUFFICIENT_LIQUIDITY);
            }
    	},
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market where initial price is out of bounds, too low, should trigger onFailed',
        p: {
            market: '0xa1',
            liquidity: 10000,
            initialFairPrices: ['0.006573092', '0.49422020'],
            startingQuantity: 501,
            bestStartingQuantity: 500,
            priceWidth: '0.0812',
            isSimulation: false
        },
        cb: {
            onSimulate: function(simulation) {},
            onBuyCompleteSets: function(res) {},
            onSetupOutcome: function(outcome) {},
            onSetupOrder: function(order) {},
            onSuccess: function(orderBook) {},
            onFailed: function(err) {
                // this callback should be called, lets assert we get the expected error back.
                assert.deepEqual(err, augur.errors.INITIAL_PRICE_OUT_OF_BOUNDS);
            }
        },
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market where initial price is out of bounds, too high, should trigger onFailed',
        p: {
            market: '0xa1',
            liquidity: 10000,
            initialFairPrices: ['0.996573092', '0.49422020'],
            startingQuantity: 501,
            bestStartingQuantity: 500,
            priceWidth: '0.0812',
            isSimulation: false
        },
        cb: {
            onSimulate: function(simulation) {},
            onBuyCompleteSets: function(res) {},
            onSetupOutcome: function(outcome) {},
            onSetupOrder: function(order) {},
            onSuccess: function(orderBook) {},
            onFailed: function(err) {
                // this callback should be called, lets assert we get the expected error back.
                assert.deepEqual(err, augur.errors.INITIAL_PRICE_OUT_OF_BOUNDS);
            }
        },
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market where price width is out of bounds, too high, should trigger onFailed',
        p: {
            market: '0xa1',
            liquidity: 10000,
            initialFairPrices: ['0.6', '0.49422020'],
            startingQuantity: 501,
            bestStartingQuantity: 500,
            priceWidth: '0.8',
            isSimulation: false
        },
        cb: {
            onSimulate: function(simulation) {},
            onBuyCompleteSets: function(res) {},
            onSetupOutcome: function(outcome) {},
            onSetupOrder: function(order) {},
            onSuccess: function(orderBook) {},
            onFailed: function(err) {
                // this callback should be called, lets assert we get the expected error back.
                assert.deepEqual(err, augur.errors.PRICE_WIDTH_OUT_OF_BOUNDS);
            }
        },
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market where price width is out of bounds, too low, should trigger onFailed',
        p: {
            market: '0xa1',
            liquidity: 10000,
            initialFairPrices: ['0.4', '0.49422020'],
            startingQuantity: 501,
            bestStartingQuantity: 500,
            priceWidth: '0.8',
            isSimulation: false
        },
        cb: {
            onSimulate: function(simulation) {},
            onBuyCompleteSets: function(res) {},
            onSetupOutcome: function(outcome) {},
            onSetupOrder: function(order) {},
            onSuccess: function(orderBook) {},
            onFailed: function(err) {
                // this callback should be called, lets assert we get the expected error back.
                assert.deepEqual(err, augur.errors.PRICE_WIDTH_OUT_OF_BOUNDS);
            }
        },
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market and produce a simulation of generating the order book',
        p: {
            market: '0xa1',
            liquidity: 10000,
            initialFairPrices: ['0.39003', '0.39422020'],
            startingQuantity: 501,
            bestStartingQuantity: 500,
            priceWidth: '0.6',
            isSimulation: true
        },
        cb: {
            onSimulate: function(simulation) {
                assert.deepEqual(simulation, { shares: '4007',
                  numBuyOrders: [ 2, 2 ],
                  numSellOrders: [ 7, 7 ],
                  buyPrices:
                   [ [ '0.09003', '0.05106333333333333333' ],
                     [ '0.0942202', '0.05525353333333333333' ] ],
                  sellPrices:
                   [ [ '0.69003',
                       '0.72899666666666666667',
                       '0.76796333333333333334',
                       '0.80693000000000000001',
                       '0.84589666666666666668',
                       '0.88486333333333333335',
                       '0.92383000000000000002' ],
                     [ '0.6942202',
                       '0.73318686666666666667',
                       '0.77215353333333333334',
                       '0.81112020000000000001',
                       '0.85008686666666666668',
                       '0.88905353333333333335',
                       '0.92802020000000000002' ] ],
                  numTransactions: 24,
                  priceDepth: '0.03896666666666666667' });
            },
            onBuyCompleteSets: function(res) {},
            onSetupOutcome: function(outcome) {},
            onSetupOrder: function(order) {},
            onSuccess: function(orderBook) {},
            onFailed: function(err) {}
        },
        assertionFunction: 'onSimulate',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market, non simulation, when buyCompleteSets returns an error to onFailed',
        p: {
            market: '0xa1',
            liquidity: 10000,
            initialFairPrices: ['0.39003', '0.39422020'],
            startingQuantity: 501,
            bestStartingQuantity: 500,
            priceWidth: '0.6',
            isSimulation: false
        },
        cb: {
            onSimulate: undefined,
            onBuyCompleteSets: function(res) {},
            onSetupOutcome: function(outcome) {},
            onSetupOrder: function(order) {},
            onSuccess: function(orderBook) {},
            onFailed: function(err) {
                // confirm that onFailed was called with the error passed from buyCompleteSets
                assert.deepEqual(err, {error: 999, message: 'uh-oh!'});
            }
        },
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {
            // generateOrderBook always passes a single argument object to buyCompleteSets...
            market.onSent();
            // lets fail when buyCompleteSets is called for this test.
            market.onFailed({error: 999, message: 'uh-oh!'});
        },
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
    test({
        description: 'Should handle a binary market, with simulation, when buyCompleteSets completes and all buy and sell orders complete as expected',
        p: {
            market: '0xa1',
            liquidity: 100,
            initialFairPrices: ['0.5', '0.5'],
            startingQuantity: 11,
            bestStartingQuantity: 10,
            priceWidth: '0.5',
            isSimulation: false
        },
        cb: {
            onSimulate: function(simulation) {
                assert.deepEqual(simulation, { shares: '32',
                  numBuyOrders: [ 2, 2 ],
                  numSellOrders: [ 2, 2 ],
                  buyPrices: [ [ '0.25', '0.146875' ], [ '0.25', '0.146875' ] ],
                  sellPrices: [ [ '0.75', '0.853125' ], [ '0.75', '0.853125' ] ],
                  numTransactions: 14,
                  priceDepth: '0.103125'
                });
            },
            onBuyCompleteSets: function(res) {
                assert.deepEqual(res, {callReturn: ['0x20']});
            },
            onSetupOutcome: function(outcome) {
                assert.oneOf(outcome.outcome, [1, 2]);
                assert.equal(outcome.market, '0xa1');
            },
            onSetupOrder: function(order) {
                if (order.buyPrice) {
                    assert.oneOf(order.buyPrice, ['0.25', '0.146875']);
                }
                if (order.sellPrice) {
                    assert.oneOf(order.sellPrice, ['0.75', '0.853125']);
                }
                assert.oneOf(order.amount, ['10', '11']);
                assert.equal(order.market, '0xa1');
                assert.equal(order.tradeId, '0xc1');
                assert.equal(order.hash, '0xf1');
                assert.equal(order.gasUsed, '0.005');
            },
            onSuccess: function(orderBook) {
                assert.deepEqual(orderBook, { market: '0xa1', scalarMinMax: {} });
            },
            onFailed: function(err) {
                // Shouldn't be called in this test.
            }
        },
        assertionFunction: 'onSuccess',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {
            market.onSent();
            market.onSuccess({ callReturn: [market.amount.toString()]});
        },
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {
            amount.onSent();
            amount.onSuccess({ callReturn: '0xc1', gasUsed: '0.005', timestamp: 150000000, hash: '0xf1'});
        },
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {
            amount.onSent();
            amount.onSuccess({ callReturn: '0xc1', gasUsed: '0.005', timestamp: 150000000, hash: '0xf1'});
        },
        getOrderBook: function(market, scalarMinMax, onSuccess) {
            onSuccess({market: market, scalarMinMax: scalarMinMax });
        },
    });
    test({
        description: 'Should handle a binary market, with simulation, when buyCompleteSets completes successfully but a buy order fails.',
        p: {
            market: '0xa1',
            liquidity: 100,
            initialFairPrices: ['0.5', '0.5'],
            startingQuantity: 11,
            bestStartingQuantity: 10,
            priceWidth: '0.5',
            isSimulation: false
        },
        cb: {
            onSimulate: function(simulation) {
                assert.deepEqual(simulation, { shares: '32',
                  numBuyOrders: [ 2, 2 ],
                  numSellOrders: [ 2, 2 ],
                  buyPrices: [ [ '0.25', '0.146875' ], [ '0.25', '0.146875' ] ],
                  sellPrices: [ [ '0.75', '0.853125' ], [ '0.75', '0.853125' ] ],
                  numTransactions: 14,
                  priceDepth: '0.103125'
                });
            },
            onBuyCompleteSets: function(res) {
                assert.deepEqual(res, {callReturn: ['0x20']});
            },
            onSetupOutcome: function(outcome) {
                assert.deepEqual(outcome.outcome, 1);
                assert.equal(outcome.market, '0xa1');
            },
            onSetupOrder: function(order) {
                assert.isNull(true, 'onSetupOrder should not get called in this test');
            },
            onSuccess: function(orderBook) {
                assert.isNull(true, 'onSuccess should not get called in this test');
            },
            onFailed: function(err) {
                assert.deepEqual(err, { error: 999, message: 'Uh-Oh!'});
            }
        },
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {
            market.onSent();
            market.onSuccess({ callReturn: [market.amount.toString()]});
        },
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {
            amount.onSent();
            // on call return an error
            amount.onFailed({ error: 999, message: 'Uh-Oh!'});
        },
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {
            // should never get a chance to get called...
            assert.isNull(true, 'sell should not get called in this test');
        },
        getOrderBook: function(market, scalarMinMax, onSuccess) {
            // Shouldn't get called in this example
            assert.isNull(true, 'getOrderBook should not get called in this test');
        },
    });
    test({
        description: 'Should handle a binary market, with simulation, when buyCompleteSets completes successfully as well as the buy orders but sell order fails.',
        p: {
            market: '0xa1',
            liquidity: 100,
            initialFairPrices: ['0.5', '0.5'],
            startingQuantity: 11,
            bestStartingQuantity: 10,
            priceWidth: '0.5',
            isSimulation: false
        },
        cb: {
            onSimulate: function(simulation) {
                assert.deepEqual(simulation, { shares: '32',
                  numBuyOrders: [ 2, 2 ],
                  numSellOrders: [ 2, 2 ],
                  buyPrices: [ [ '0.25', '0.146875' ], [ '0.25', '0.146875' ] ],
                  sellPrices: [ [ '0.75', '0.853125' ], [ '0.75', '0.853125' ] ],
                  numTransactions: 14,
                  priceDepth: '0.103125'
                });
            },
            onBuyCompleteSets: function(res) {
                assert.deepEqual(res, {callReturn: ['0x20']});
            },
            onSetupOutcome: function(outcome) {
                assert.deepEqual(outcome.outcome, 1);
                assert.equal(outcome.market, '0xa1');
            },
            onSetupOrder: function(order) {
                // in this test only the buy orders should call onSetupOrder
                assert.oneOf(order.buyPrice, ['0.25', '0.146875']);
                assert.oneOf(order.amount, ['10', '11']);
                assert.equal(order.market, '0xa1');
                assert.equal(order.tradeId, '0xc1');
                assert.equal(order.hash, '0xf1');
                assert.equal(order.gasUsed, '0.005');
            },
            onSuccess: function(orderBook) {
                assert.isNull(true, 'onSuccess should not get called in this test');
            },
            onFailed: function(err) {
                assert.deepEqual(err, { error: 999, message: 'Uh-Oh!'});
            }
        },
        assertionFunction: 'onFailed',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {
            market.onSent();
            market.onSuccess({ callReturn: [market.amount.toString()]});
        },
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {
            amount.onSent();
            amount.onSuccess({ callReturn: '0xc1', gasUsed: '0.005', timestamp: 150000000, hash: '0xf1'});
        },
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {
            amount.onSent();
            // return an error...
            amount.onFailed({ error: 999, message: 'Uh-Oh!'});
        },
        getOrderBook: function(market, scalarMinMax, onSuccess) {
            // Shouldn't get called in this example
            assert.isNull(true, 'getOrderBook should not get called in this test');
        },
    });
    test({
        description: 'Should handle a scalar market, with simulation, when buyCompleteSets completes and all buy and sell orders complete as expected',
        p: {
            market: '0xa1',
            liquidity: 100,
            initialFairPrices: ['0.5', '0.5'],
            startingQuantity: 11,
            bestStartingQuantity: 10,
            priceWidth: '0.5',
            isSimulation: false
        },
        cb: {
            onSimulate: function(simulation) {
                assert.deepEqual(simulation, { shares: '87',
                  numBuyOrders: [ 1, 1 ],
                  numSellOrders: [ 7, 7 ],
                  buyPrices: [ [ '0.25' ], [ '0.25' ] ],
                  sellPrices:
                   [ [ '0.75',
                       '17.215625',
                       '33.68125',
                       '50.146875',
                       '66.6125',
                       '83.078125',
                       '99.54375' ],
                     [ '0.75',
                       '17.215625',
                       '33.68125',
                       '50.146875',
                       '66.6125',
                       '83.078125',
                       '99.54375' ] ],
                  numTransactions: 22,
                  priceDepth: '16.465625'
                });
            },
            onBuyCompleteSets: function(res) {
                assert.deepEqual(res, {callReturn: ['0x57']});
            },
            onSetupOutcome: function(outcome) {
                assert.oneOf(outcome.outcome, [1, 2]);
                assert.equal(outcome.market, '0xa1');
            },
            onSetupOrder: function(order) {
                if (order.buyPrice) {
                    assert.deepEqual(order.buyPrice, '0.25');
                }
                if (order.sellPrice) {
                    assert.oneOf(order.sellPrice,  [ '0.75',
                       '17.215625',
                       '33.68125',
                       '50.146875',
                       '66.6125',
                       '83.078125',
                       '99.54375' ]);
                }
                assert.oneOf(order.amount, ['10', '11']);
                assert.equal(order.market, '0xa1');
                assert.equal(order.tradeId, '0xc1');
                assert.equal(order.hash, '0xf1');
                assert.equal(order.gasUsed, '0.005');
            },
            onSuccess: function(orderBook) {
                assert.deepEqual(orderBook, { market: '0xa1', scalarMinMax: { minValue: abi.bignum('0'), maxValue: abi.bignum('120')} });
            },
            onFailed: function(err) {
                console.log('onFailedTotal:', err);
                // Shouldn't be called in this test.
                assert.isNull(true, 'onFailed called unexpectedly.');
            }
        },
        assertionFunction: 'onSuccess',
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'scalar', events: [{minValue: '0', maxValue: '120'}]});
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {
            market.onSent();
            market.onSuccess({ callReturn: [market.amount.toString()]});
        },
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {
            amount.onSent();
            amount.onSuccess({ callReturn: '0xc1', gasUsed: '0.005', timestamp: 150000000, hash: '0xf1'});
        },
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {
            amount.onSent();
            amount.onSuccess({ callReturn: '0xc1', gasUsed: '0.005', timestamp: 150000000, hash: '0xf1'});
        },
        getOrderBook: function(market, scalarMinMax, onSuccess) {
            onSuccess({market: market, scalarMinMax: scalarMinMax });
        },
    });
});
