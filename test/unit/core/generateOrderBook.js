var assert = require('chai').assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var augur = require('../../../src');
var utils = require('../../../src/utilities.js');
// 20 tests total

describe("generateOrderBook", function() {
// 20 tests total
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
        it(t.description + ' sync', function() {
            augur.getMarketInfo = t.getMarketInfo;
            augur.buyCompleteSets = t.buyCompleteSets;
            augur.buy = t.buy,
            augur.sell = t.sell,
            augur.getOrderBook = t.getOrderBook;
            augur.generateOrderBook(t.p, t.cb);
        });
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
            // lets fail when buyCompleteSets is called for this test.
            market.onFailed({error: 999, message: 'uh-oh!'});
        },
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
});
