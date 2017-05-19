"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var proxyquire = require('proxyquire');
var augur = new (require("../../../src"))();

describe("calculatePriceDepth", function () {
  var calculatePriceDepth = require('../../../src/create/generate-order-book/calculate-price-depth');
  var test = function (t) {
    it(JSON.stringify(t), function () {
      var liquidity = new BigNumber(t.params.liquidity, 10);
      var startingQuantity = new BigNumber(t.params.startingQuantity, 10);
      var bestStartingQuantity = new BigNumber(t.params.bestStartingQuantity, 10);
      var halfPriceWidth = new BigNumber(t.params.halfPriceWidth, 10);
      var minValue = new BigNumber(t.params.minValue, 10);
      var maxValue = new BigNumber(t.params.maxValue, 10);
      t.assertions(calculatePriceDepth(liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue));
    });
  };
  test({
    params: {
      liquidity: 100,
      startingQuantity: 5,
      bestStartingQuantity: 10,
      halfPriceWidth: "0.4",
      minValue: 0,
      maxValue: 1
    },
    assertions: function (priceDepth) {
      assert.strictEqual(priceDepth.constructor, BigNumber);
      assert.strictEqual(priceDepth.toFixed(), "0.0375");
    }
  });
  test({
    params: {
      liquidity: 500,
      startingQuantity: 5,
      bestStartingQuantity: 10,
      halfPriceWidth: "0.4",
      minValue: 0,
      maxValue: 1
    },
    assertions: function (priceDepth) {
      assert.strictEqual(priceDepth.constructor, BigNumber);
      assert.strictEqual(priceDepth.toFixed(), "0.00625");
    }
  });
  test({
    params: {
      liquidity: 50,
      startingQuantity: 5,
      bestStartingQuantity: 10,
      halfPriceWidth: "0.4",
      minValue: 0,
      maxValue: 1
    },
    assertions: function (priceDepth) {
      assert.strictEqual(priceDepth.constructor, BigNumber);
      assert.strictEqual(priceDepth.toFixed(), "0.1");
    }
  });
  test({
    params: {
      liquidity: 20,
      startingQuantity: 5,
      bestStartingQuantity: 10,
      halfPriceWidth: "0.4",
      minValue: 0,
      maxValue: 1
    },
    assertions: function (priceDepth) {
      assert.strictEqual(priceDepth.constructor, BigNumber);
      assert.strictEqual(priceDepth.toFixed(), "Infinity");
    }
  });
});

describe("calculateOrderPrices", function () {
  var calculateOrderPrices = require('../../../src/create/generate-order-book/calculate-order-prices');
  var test = function (t) {
    it(t.description, function () {
      t.assertions(calculateOrderPrices(t.params.liquidity, t.params.startingQuantity, t.params.bestStartingQuantity, t.params.initialFairPrices, t.params.minValue, t.params.maxValue, t.params.halfPriceWidth));
    });
  };
  test({
    description: '3 outcomes',
    params: {
      liquidity: abi.bignum(100),
      startingQuantity: abi.bignum(10),
      bestStartingQuantity: abi.bignum(10),
      initialFairPrices: abi.bignum(['0.3', '0.3', '0.3']),
      minValue: abi.bignum(0),
      maxValue: abi.bignum(1),
      halfPriceWidth: abi.bignum('0.1')
    },
    assertions: function (orders) {
      assert.strictEqual(orders.shares.toFixed(), '70');
      assert.deepEqual(orders.numBuyOrders, [2, 2, 2]);
      assert.deepEqual(orders.numSellOrders, [6, 6, 6]);
      assert.deepEqual(abi.string(orders.buyPrices), [
        ['0.2', '0.0875'],
        ['0.2', '0.0875'],
        ['0.2', '0.0875']]
      );
      assert.deepEqual(abi.string(orders.sellPrices), [
        ['0.4', '0.5125', '0.625', '0.7375', '0.85', '0.9625'],
        ['0.4', '0.5125', '0.625', '0.7375', '0.85', '0.9625'],
        ['0.4', '0.5125', '0.625', '0.7375', '0.85', '0.9625']
      ]);
    }
  });
});

describe("generateOrderBook", function () {
  // 15 tests total
  var buyCompleteSets = augur.api.CompleteSets.buyCompleteSets;
  afterEach(function () {
    augur.api.CompleteSets.buyCompleteSets = buyCompleteSets;
  });
  var test = function (t) {
    // This function is async by default so lets do async tests only.
    it(t.description + ' async', function (done) {
      var generateOrderBook = proxyquire('../../../src/create/generate-order-book/index', {
        './generate-orders': t.generateOrders || {},
        '../../api': function () {
          return { CompleteSets: { buyCompleteSets: t.buyCompleteSets } };
        }
      });
      augur.api.CompleteSets.buyCompleteSets = t.buyCompleteSets;
      // because we are using the same object to drive async and sync tests we will use the following code to wrap our final assertion function so that we can call done when the async functions are finished.
      if (t.callbacks) {
        // there is one case where callbacks won't be defined to completely unit test this function.
        var functionToReplace = t.callbacks[t.assertionFunction];
        var assertion = function (input) {
          functionToReplace(input);
          done();
        };
        t.callbacks[t.assertionFunction] = assertion;
      } else {
        var functionToReplace = t.params[t.assertionFunction];
        var assertion = function (input) {
          functionToReplace(input);
          done();
        };
        t.params[t.assertionFunction] = assertion;
      }
      // now that we have wrapped our assertion function we will start the test...
      generateOrderBook(t.params, t.callbacks);
    });
  };
  test({
    description: 'Should handle missing marketInfo and call onFailed with an error.',
    params: {
  		market: '0xa1',
  		liquidity: 10000,
  		initialFairPrices: ['0.506573092', '0.49422020'],
  		startingQuantity: 501,
  		bestStartingQuantity: 500,
  		priceWidth: '0.0812',
      // marketInfo that is undefined
      marketInfo: undefined,
  		isSimulationOnly: false
  	},
  	callbacks: {
    	onSimulate: function (simulation) {},
    	onBuyCompleteSets: function (res) {},
    	onSetupOutcome: function (outcome) {},
    	onSetupOrder: function (order) {},
    	onSuccess: function (orderBook) {},
    	onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.NO_MARKET_INFO);
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {},
  });
  test({
    description: 'Should handle missing marketInfo and call onFailed with an error when everything is passed in one object.',
    params: {
      market: '0xa1',
      liquidity: 10000,
      initialFairPrices: ['0.506573092', '0.49422020'],
      startingQuantity: 501,
      bestStartingQuantity: 500,
      priceWidth: '0.0812',
      // marketInfo that is undefined
      marketInfo: undefined,
      isSimulationOnly: false,
      onSimulate: function (simulation) {},
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.NO_MARKET_INFO);
      }
    },
    callbacks: undefined,
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {},
  });
  test({
    description: 'Should handle marketInfo that has a different number of outcomes then expected, should call onFailed.',
    params: {
  		market: '0xa1',
  		liquidity: 10000,
  		initialFairPrices: ['0.506573092', '0.49422020'],
  		startingQuantity: 501,
  		bestStartingQuantity: 500,
  		priceWidth: '0.0812',
      // market with numOutcomes != initialFairPrices.length (this array should have an entry for each # of outcomes);
      marketInfo: { numOutcomes: 5 },
  		isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {},
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.WRONG_NUMBER_OF_OUTCOMES);
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {},
  });
  test({
    description: 'Should handle a binary market where priceDepth is less than or equal to 0, triggering an onFailed called.',
    params: {
      market: '0xa1',
      liquidity: 100,
      initialFairPrices: ['0.506573092', '0.49422020'],
      startingQuantity: 501,
      bestStartingQuantity: 500,
      priceWidth: '0.0812',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {},
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.INSUFFICIENT_LIQUIDITY);
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {},
  });
  test({
    description: 'Should handle a binary market where priceDepth is Infinity, triggering an onFailed called.',
    params: {
      market: '0xa1',
      liquidity: 100,
      initialFairPrices: ['0.506573092', '0.49422020'],
      startingQuantity: 51,
      bestStartingQuantity: 50,
      priceWidth: '0.0812',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {},
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.INSUFFICIENT_LIQUIDITY);
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {},
  });
  test({
    description: 'Should handle a binary market where initial price is out of bounds, too low, should trigger onFailed',
    params: {
      market: '0xa1',
      liquidity: 10000,
      initialFairPrices: ['0.006573092', '0.49422020'],
      startingQuantity: 501,
      bestStartingQuantity: 500,
      priceWidth: '0.0812',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {},
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.INITIAL_PRICE_OUT_OF_BOUNDS);
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {},
  });
  test({
    description: 'Should handle a binary market where initial price is out of bounds, too high, should trigger onFailed',
    params: {
      market: '0xa1',
      liquidity: 10000,
      initialFairPrices: ['0.996573092', '0.49422020'],
      startingQuantity: 501,
      bestStartingQuantity: 500,
      priceWidth: '0.0812',
      // return marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {},
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.INITIAL_PRICE_OUT_OF_BOUNDS);
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {},
  });
  test({
    description: 'Should handle a binary market where price width is out of bounds, too high, should trigger onFailed',
    params: {
      market: '0xa1',
      liquidity: 10000,
      initialFairPrices: ['0.6', '0.49422020'],
      startingQuantity: 501,
      bestStartingQuantity: 500,
      priceWidth: '0.8',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {},
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.PRICE_WIDTH_OUT_OF_BOUNDS);
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {}
  });
  test({
    description: 'Should handle a binary market where price width is out of bounds, too low, should trigger onFailed',
    params: {
      market: '0xa1',
      liquidity: 10000,
      initialFairPrices: ['0.4', '0.49422020'],
      startingQuantity: 501,
      bestStartingQuantity: 500,
      priceWidth: '0.8',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {},
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // this callback should be called, lets assert we get the expected error back.
        assert.deepEqual(err, augur.rpc.errors.PRICE_WIDTH_OUT_OF_BOUNDS);
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {}
  });
  test({
    description: 'Should handle a binary market and produce a simulation of generating the order book',
    params: {
      market: '0xa1',
      liquidity: 10000,
      initialFairPrices: ['0.39003', '0.39422020'],
      startingQuantity: 501,
      priceWidth: '0.6',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: true
    },
    callbacks: {
      onSimulate: function (simulation) {
        assert.deepEqual(simulation, {
          shares: '4509',
          numBuyOrders: [ 3, 3 ],
          numSellOrders: [ 8, 8 ],
          buyPrices:
            [ [ '0.09003', '0.05105467214936652589', '0.01207934429873305178' ],
            [ '0.0942202', '0.05524487214936652589', '0.01626954429873305178' ] ],
          sellPrices:
            [ [ '0.69003',
            '0.72900532785063347411',
            '0.76798065570126694822',
            '0.80695598355190042233',
            '0.84593131140253389644',
            '0.88490663925316737055',
            '0.92388196710380084466',
            '0.96285729495443431877' ],
            [ '0.6942202',
            '0.73319552785063347411',
            '0.77217085570126694822',
            '0.81114618355190042233',
            '0.85012151140253389644',
            '0.88909683925316737055',
            '0.92807216710380084466',
            '0.96704749495443431877' ] ],
          numTransactions: 28
        });
      },
      onBuyCompleteSets: undefined,
      onSetupOutcome: undefined,
      onSetupOrder: undefined,
      onSuccess: undefined,
      onFailed: undefined
    },
    assertionFunction: 'onSimulate',
    buyCompleteSets: function (params, onFailed) {},
  });
  test({
    description: 'Should handle a binary market, non simulation, when buyCompleteSets returns an error to onFailed',
    params: {
      market: '0xa1',
      liquidity: 10000,
      initialFairPrices: ['0.39003', '0.39422020'],
      startingQuantity: 501,
      bestStartingQuantity: 500,
      priceWidth: '0.6',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: undefined,
      onBuyCompleteSets: function (res) {},
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        // confirm that onFailed was called with the error passed from buyCompleteSets
        assert.deepEqual(err, {error: 999, message: 'uh-oh!'});
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {
      // generateOrderBook always passes a single argument object to buyCompleteSets...
      params.onSent();
      // lets fail when buyCompleteSets is called for this test.
      params.onFailed({error: 999, message: 'uh-oh!'});
    },
  });
  test({
    description: 'Should handle a binary market, with simulation, when buyCompleteSets completes and all buy and sell orders complete as expected',
    params: {
      market: '0xa1',
      liquidity: 100,
      initialFairPrices: ['0.5', '0.5'],
      startingQuantity: 11,
      bestStartingQuantity: 10,
      priceWidth: '0.5',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {
        assert.deepEqual(simulation, {
          shares: '43',
          numBuyOrders: [ 3, 3 ],
          numSellOrders: [ 3, 3 ],
          buyPrices: [ [ '0.25', '0.146875', '0.04375' ], [ '0.25', '0.146875', '0.04375' ] ],
          sellPrices: [ [ '0.75', '0.853125', '0.95625' ], [ '0.75', '0.853125', '0.95625' ] ],
          numTransactions: 18
        });
      },
      onBuyCompleteSets: function (res) {
        assert.deepEqual(res, {callReturn: ['43']});
      },
      onSetupOutcome: function (outcome) {},
      onSetupOrder: function (order) {},
      onSuccess: function (result) {
        assert.deepEqual(JSON.stringify(result), JSON.stringify({
          market: '0xa1',
          outcomeIDs: [1, 2],
          orders: {
          	buyPrices: [
          		['0.25', '0.146875', '0.04375'],
          		['0.25', '0.146875', '0.04375']
          	],
          	sellPrices: [
          		['0.75', '0.853125', '0.95625'],
          		['0.75', '0.853125', '0.95625']
          	],
          	numSellOrders: [3, 3],
          	numBuyOrders: [3, 3],
          	shares: '43'
          },
          bestStartingQuantity: '10',
          startingQuantity: '11',
          scalarMinMax: {}
        }));
      },
      onFailed: function (err) {}
    },
    assertionFunction: 'onSuccess',
    buyCompleteSets: function (params, onFailed) {
      params.onSent();
      params.onSuccess({ callReturn: [params.amount.toString()]});
    },
    generateOrders: function(market, outcomeIDs, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, onSuccess, onFailed) {
      var result = {
        market: market,
        outcomeIDs: outcomeIDs,
        orders: orders,
        bestStartingQuantity: bestStartingQuantity,
        startingQuantity: startingQuantity,
        scalarMinMax: scalarMinMax
      };
      onSuccess(result);
    }
  });
  test({
    description: 'Should handle a binary market, with simulation, when buyCompleteSets completes successfully but a buy order fails.',
    params: {
      market: '0xa1',
      liquidity: 100,
      initialFairPrices: ['0.5', '0.5'],
      startingQuantity: 11,
      bestStartingQuantity: 10,
      priceWidth: '0.5',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {
        assert.deepEqual(simulation, {
          shares: '43',
          numBuyOrders: [ 3, 3 ],
          numSellOrders: [ 3, 3 ],
          buyPrices: [ [ '0.25', '0.146875', '0.04375' ], [ '0.25', '0.146875', '0.04375' ] ],
          sellPrices: [ [ '0.75', '0.853125', '0.95625' ], [ '0.75', '0.853125', '0.95625' ] ],
          numTransactions: 18
        });
      },
      onBuyCompleteSets: function (res) {
        assert.deepEqual(res, {callReturn: ['43']});
      },
      onSetupOutcome: function (outcome) {
        assert.deepEqual(outcome.outcome, 1);
        assert.equal(outcome.market, '0xa1');
      },
      onSetupOrder: function (order) {},
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!'});
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {
      params.onSent();
      params.onSuccess({ callReturn: [params.amount.toString()]});
    },
    generateOrders: function(market, outcomeIDs, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, onSuccess, onFailed) {
      onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
  test({
    description: 'Should handle a binary market, with simulation, when buyCompleteSets completes successfully as well as the buy orders but sell order fails.',
    params: {
      market: '0xa1',
      liquidity: 100,
      initialFairPrices: ['0.5', '0.5'],
      startingQuantity: 11,
      bestStartingQuantity: 10,
      priceWidth: '0.5',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'binary' },
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {
        assert.deepEqual(simulation, {
          shares: '43',
          numBuyOrders: [ 3, 3 ],
          numSellOrders: [ 3, 3 ],
          buyPrices: [ [ '0.25', '0.146875', '0.04375' ], [ '0.25', '0.146875', '0.04375' ] ],
          sellPrices: [ [ '0.75', '0.853125', '0.95625' ], [ '0.75', '0.853125', '0.95625' ] ],
          numTransactions: 18
        });
      },
      onBuyCompleteSets: function (res) {
        assert.deepEqual(res, {callReturn: ['43']});
      },
      onSetupOutcome: function (outcome) {
        assert.deepEqual(outcome.outcome, 1);
        assert.equal(outcome.market, '0xa1');
      },
      onSetupOrder: function (order) {
        // in this test only the buy orders should call onSetupOrder
        assert.strictEqual(order.type, 'buy');
        assert.oneOf(order.price, ['0.25', '0.146875', '0.04375']);
        assert.oneOf(order.amount, ['10', '11']);
        assert.equal(order.market, '0xa1');
        assert.equal(order.id, '0xc1');
        assert.equal(order.hash, '0xf1');
        assert.equal(order.gasUsed, '0.005');
      },
      onSuccess: function (orderBook) {},
      onFailed: function (err) {
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!'});
      }
    },
    assertionFunction: 'onFailed',
    buyCompleteSets: function (params, onFailed) {
      params.onSent();
      params.onSuccess({ callReturn: [params.amount.toString()]});
    },
    generateOrders: function(market, outcomeIDs, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, onSuccess, onFailed) {
      onFailed({ error: 999, message: 'Uh-Oh!' });
    }
  });
  test({
    description: 'Should handle a scalar market, with simulation, when buyCompleteSets completes and all buy and sell orders complete as expected',
    params: {
      market: '0xa1',
      liquidity: 100,
      initialFairPrices: ['0.5', '0.5'],
      startingQuantity: 11,
      bestStartingQuantity: 10,
      priceWidth: '0.5',
      // marketInfo with the expected numOutcomes and a type of binary.
      marketInfo: { numOutcomes: 2, type: 'scalar', minValue: '0', maxValue: '120'},
      isSimulationOnly: false
    },
    callbacks: {
      onSimulate: function (simulation) {
        assert.deepEqual(simulation, {
          shares: '98',
          numBuyOrders: [ 1, 1 ],
          numSellOrders: [ 8, 8 ],
          buyPrices: [ [ '0.25' ], [ '0.25' ] ],
          sellPrices:
            [ [ '0.75',
            '17.215625',
            '33.68125',
            '50.146875',
            '66.6125',
            '83.078125',
            '99.54375',
            '116.009375' ],
            [ '0.75',
            '17.215625',
            '33.68125',
            '50.146875',
            '66.6125',
            '83.078125',
            '99.54375',
            '116.009375' ] ],
          numTransactions: 24
        });
      },
      onBuyCompleteSets: function (res) {
        assert.deepEqual(res, {callReturn: ['98']});
      },
      onSetupOutcome: function (outcome) {
        assert.oneOf(outcome.outcome, [1, 2]);
        assert.equal(outcome.market, '0xa1');
      },
      onSetupOrder: function (order) {
        if (order.type === 'buy') {
          assert.deepEqual(order.price, '0.25');
        }
        if (order.type === 'sell') {
          assert.oneOf(order.price, [
            '0.75',
            '17.215625',
            '33.68125',
            '50.146875',
            '66.6125',
            '83.078125',
            '99.54375',
            '116.009375'
          ]);
        }
        assert.oneOf(order.amount, ['10', '11']);
        assert.equal(order.market, '0xa1');
        assert.equal(order.id, '0xc1');
        assert.equal(order.hash, '0xf1');
        assert.equal(order.gasUsed, '0.005');
      },
      onSuccess: function (result) {
        assert.strictEqual(JSON.stringify(result), JSON.stringify({
          market: '0xa1',
          outcomeIDs: [1, 2],
          orders: {
            buyPrices: [['0.25'], ['0.25']],
            sellPrices: [['0.75', '17.215625', '33.68125', '50.146875', '66.6125', '83.078125', '99.54375', '116.009375'], ['0.75', '17.215625', '33.68125', '50.146875', '66.6125', '83.078125', '99.54375', '116.009375']],
            numSellOrders: [8, 8],
            numBuyOrders: [1, 1],
            shares: '98'
          },
          bestStartingQuantity: '10',
          startingQuantity: '11',
          scalarMinMax: {
            minValue: '0',
            maxValue: '120'
          }
        }));
      },
      onFailed: function (err) {}
    },
    assertionFunction: 'onSuccess',
    buyCompleteSets: function (params, onFailed) {
      params.onSent();
      params.onSuccess({ callReturn: [params.amount.toString()]});
    },
    generateOrders: function(market, outcomeIDs, orders, bestStartingQuantity, startingQuantity, scalarMinMax, onSetupOutcome, onSetupOrder, onSuccess, onFailed) {
      var result = {
        market: market,
        outcomeIDs: outcomeIDs,
        orders: orders,
        bestStartingQuantity: bestStartingQuantity,
        startingQuantity: startingQuantity,
        scalarMinMax: scalarMinMax
      };
      onSuccess(result);
    }
  });
});
