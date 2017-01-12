"use strict";

var assert = require("chai").assert;
var augur = require("../../../src");
var abi = require("augur-abi");
var utils = require("../../../src/utilities");

describe("Market.getWinningOutcomes", function() {
  var test = function (t) {
    it(t.description, function() {
      var fire = augur.fire;
      var getMarketNumOutcomes = augur.getMarketNumOutcomes;
      augur.fire = t.fire;
      augur.getMarketNumOutcomes = t.getMarketNumOutcomes;

      t.assertions(augur.getWinningOutcomes(t.market, t.callback));

      augur.fire = fire;
      augur.getMarketNumOutcomes = getMarketNumOutcomes;
    });
  };

  test({
    assertions: utils.noop,
    description: 'Should return null to the callback if getWinningOutcomes transaction returns undefined',
    market: 'marketID',
    fire: function(tx, cb) {
      cb(undefined);
    },
    getMarketNumOutcomes: function(market, cb) {
			// shouldn't get hit in this test.
    },
    callback: function(outcomes) {
			// Do our assertions here since there is no value returned.
      assert.isNull(outcomes);
    }
  });
  test({
    assertions: utils.noop,
    description: 'Should return an error object to callback if getWinningOutcomes transaction returns an error object',
    market: 'marketID',
    fire: function(tx, cb) {
      cb({ error: '404', message: 'page not found!' });
    },
    getMarketNumOutcomes: function(market, cb) {
			// shouldn't get hit in this test.
    },
    callback: function(outcomes) {
      assert.deepEqual(outcomes, { error: '404', message: 'page not found!' });
    }
  });
  test({
    assertions: utils.noop,
    description: 'Should return any non array value to callback if getWinningOutcomes transaction does not return an array',
    market: 'marketID',
    fire: function(tx, cb) {
      cb('1');
    },
    getMarketNumOutcomes: function(market, cb) {
      cb('5');
    },
    callback: function(outcomes) {
      assert.deepEqual(outcomes, '1');
    }
  });
  test({
    assertions: utils.noop,
    description: 'Should return the winning outcomes in an array',
    market: 'marketID',
    fire: function(tx, cb) {
      cb(['1','2','3']);
    },
    getMarketNumOutcomes: function(market, cb) {
      cb('5');
    },
    callback: function(outcomes) {
      assert.deepEqual(outcomes, ['1', '2', '3']);
    }
  });
  test({
    assertions: utils.noop,
    description: 'Should return an error object if getMarketNumOutcomes returns an error',
    market: 'marketID',
    fire: function(tx, cb) {
      cb(['1','2','3']);
    },
    getMarketNumOutcomes: function(market, cb) {
      cb({ error: '1', message: 'hello world' });
    },
    callback: function(outcomes) {
      assert.deepEqual(outcomes, { error: '1', message: 'hello world' });
    }
  });
  test({
    assertions: utils.noop,
    description: 'Should return the winning outcomes if getMarketNumOutcomes returns undefined',
    market: 'marketID',
    fire: function(tx, cb) {
      cb(['1','2','3']);
    },
    getMarketNumOutcomes: function(market, cb) {
      cb(undefined);
    },
    callback: function(outcomes) {
      assert.deepEqual(outcomes, ['1', '2', '3']);
    }
  });
  test({
    description: 'Should handle no callback passed with everything else returning valid values',
    market: 'marketID',
    callback: undefined,
    fire: function(tx, cb) {
      return ['1', '2', '3', '4', '5'];
    },
    getMarketNumOutcomes: function(market, cb) {
      return 5;
    },
    assertions: function(out) {
      assert.deepEqual(out, ['1', '2', '3', '4', '5']);
    }
  });
  test({
    description: 'Should handle no callback passed with tx.fire returning undefined',
    market: 'marketID',
    callback: undefined,
    fire: function(tx, cb) {
      return undefined;
    },
    getMarketNumOutcomes: function(market, cb) {
			// should never get hit in this test
    },
    assertions: function(out) {
      assert.isNull(out);
    }
  });
  test({
    description: 'Should handle no callback passed with tx.fire returning an error object',
    market: 'marketID',
    callback: undefined,
    fire: function(tx, cb) {
      return { error: '404', message: 'page not found!' };
    },
    getMarketNumOutcomes: function(market, cb) {
			// should never get hit in this test
    },
    assertions: function(out) {
      assert.deepEqual(out, { error: '404', message: 'page not found!' });
    }
  });
  test({
    description: 'Should handle no callback passed with tx.fire returning a non array object that does not contain an error',
    market: 'marketID',
    callback: undefined,
    fire: function(tx, cb) {
      return '1';
    },
    getMarketNumOutcomes: function(market, cb) {
      return 2;
    },
    assertions: function(out) {
      assert.deepEqual(out, '1');
    }
  });
  test({
    description: 'Should handle no callback passed with getMarketNumOutcomes returning an error object',
    market: 'marketID',
    callback: undefined,
    fire: function(tx, cb) {
      return ['1', '2'];
    },
    getMarketNumOutcomes: function(market, cb) {
      return { error: '1', message: 'hello world' };
    },
    assertions: function(out) {
      assert.deepEqual(out, { error: '1', message: 'hello world' });
    }
  });
});
