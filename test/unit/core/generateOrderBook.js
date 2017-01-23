var assert = require('chai').assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var augur = require('../../../src');
var utils = require('../../../src/utilities.js');
// 8 tests total

describe("generateOrderBook", function() {
// 8 tests total
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
        it(t.description + ' async', function() {
            augur.getMarketInfo = t.getMarketInfo;
            augur.buyCompleteSets = t.buyCompleteSets;
            augur.buy = t.buy,
            augur.sell = t.sell,
            augur.getOrderBook = t.getOrderBook;
            augur.generateOrderBook(t.p, t.cb);
        });
    };
    test({
        descrption: 'Should handle missing marketInfo and call onFailed with an error.',
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
        descrption: 'Should handle marketInfo that has a different number of outcomes then expected, should call onFailed.',
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
        descrption: 'Should handle a binary market where priceDepth is less than or equal to 0, triggering an onFailed called.',
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
        descrption: 'Should handle a binary market where priceDepth is Infinity, triggering an onFailed called.',
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
        getMarketInfo: function(market, account, callback) {
            // return marketInfo with the expected numOutcomes and a type of binary.
            callback({ numOutcomes: 2, type: 'binary' });
        },
        buyCompleteSets: function(market, amount, onSent, onSuccess, onFailed) {},
        buy: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        sell: function(amount, price, market, outcome, scalarMinMax, onSent, onSuccess, onFailed) {},
        getOrderBook: function(market, scalarMinMax, onSuccess) {},
    });
});
