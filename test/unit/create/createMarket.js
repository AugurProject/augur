"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var BigNumber = require('bignumber.js');
var proxyquire = require('proxyquire');
var noop = require("../../../src/utils/noop");
var augur = new (require("../../../src/"))();
// 15 tests total

describe("augur.create.createSingleEventMarket", function () {
  // 2 tests total
  var test = function (t) {
    it(t.testDescription, function () {
      var createSingleEventMarket = proxyquire('../../../src/create/create-single-event-market', {
        '../rpc-interface': {
          getGasPrice: function () {
            // for simplicity's sake, just return 10.
            return '10';
          }
        },
        '../api': function () {
          return {
            CreateMarket: {
              createSingleEventMarket: t.assertions
            }
          };
        }
      });
      createSingleEventMarket(t.params);
    });
  };
  test({
    testDescription: "Should create a single event market",
    params: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      description: "Some question for an Event and Market",
      expDate: 15000000000,
      minValue: 1,
      maxValue: 2,
      numOutcomes: 2,
      resolution: 'https://someResolution.com',
      takerFee: 0.04,
      tags: ['movies', 'tvshows', 'podcasts'],
      makerFee: 0.02,
      extraInfo: 'This is some extra information about this fascinating market.',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    },
    assertions: function (tx) {
      var fees = augur.trading.fees.calculateTradingFees(tx.makerFee, tx.takerFee);
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
        description: "Some question for an Event and Market",
        expDate: 15000000000,
        minValue: abi.fix(1, 'hex'),
        maxValue: abi.fix(2, 'hex'),
        numOutcomes: 2,
        resolution: 'https://someResolution.com',
        takerFee: 0.04,
        tags: ['movies', 'tvshows', 'podcasts'],
        makerFee: 0.02,
        extraInfo: 'This is some extra information about this fascinating market.',
        onSent: noop,
        onSuccess: noop,
        onFailed: noop,
        tradingFee: abi.fix(fees.tradingFee, 'hex'),
        tag1: abi.short_string_to_int256('movies'),
        tag2: abi.short_string_to_int256('tvshows'),
        tag3: abi.short_string_to_int256('podcasts'),
        makerFees: abi.fix(fees.makerProportionOfFee, 'hex'),
        tx: {
          value: abi.prefix_hex((new BigNumber("1200000", 10).times(abi.bignum('10')).plus(new BigNumber("500000", 10).times(abi.bignum('10')))).toString(16))
        }
      }));
    },
  });
  test({
    testDescription: "Should create a single event market, no extra info or resolution passed.",
    params: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      description: "Some question for an Event and Market",
      expDate: 15000000000,
      minValue: 1,
      maxValue: 2,
      numOutcomes: 2,
      resolution: undefined,
      takerFee: 0.04,
      tags: ['movies', 'tvshows', 'podcasts'],
      makerFee: 0.02,
      extraInfo: undefined,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    },
    assertions: function (tx) {
      var fees = augur.trading.fees.calculateTradingFees(tx.makerFee, tx.takerFee);
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
        description: "Some question for an Event and Market",
        expDate: 15000000000,
        minValue: abi.fix(1, 'hex'),
        maxValue: abi.fix(2, 'hex'),
        numOutcomes: 2,
        resolution: '',
        takerFee: 0.04,
        tags: ['movies', 'tvshows', 'podcasts'],
        makerFee: 0.02,
        extraInfo: '',
        onSent: noop,
        onSuccess: noop,
        onFailed: noop,
        tradingFee: abi.fix(fees.tradingFee, 'hex'),
        tag1: abi.short_string_to_int256('movies'),
        tag2: abi.short_string_to_int256('tvshows'),
        tag3: abi.short_string_to_int256('podcasts'),
        makerFees: abi.fix(fees.makerProportionOfFee, 'hex'),
        tx: {
          value: abi.prefix_hex((new BigNumber("1200000", 10).times(abi.bignum('10')).plus(new BigNumber("500000", 10).times(abi.bignum('10')))).toString(16))
        }
      }));
    },
  });
});

describe("createMarket.create.createEvent", function () {
  // 4 tests total
  var test = function (t) {
    it(t.testDescription, function () {
      var apiCreateEvent = augur.api.CreateMarket.createEvent;

      augur.api.CreateMarket.createEvent = t.assertions;

      augur.create.createEvent(t.params);

      augur.api.CreateMarket.createEvent = apiCreateEvent;
    });
  };
  test({
    testDescription: "Should handle a createEvent call",
    params: {
      branch: '1010101',
      description: 'This is a test event description',
      expDate: 1500000000,
      minValue: '1',
      maxValue: '2',
      numOutcomes: '2',
      resolution: 'https://iknoweverything.com',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    assertions: function (tx) {
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '1010101',
        description: 'This is a test event description',
        expDate: parseInt(1500000000, 10),
        minValue: abi.fix('1', "hex"),
        maxValue: abi.fix('2', "hex"),
        numOutcomes: '2',
        resolution: 'https://iknoweverything.com'
      }));
    }
  });
  test({
    testDescription: "Should handle a createEvent call, no resoultion provided",
    params: {
      branch: '1010101',
      description: 'This is a test event description',
      expDate: 1500000000,
      minValue: '10',
      maxValue: '250',
      numOutcomes: '2',
      resolution: undefined,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    assertions: function (tx) {
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '1010101',
        description: 'This is a test event description',
        expDate: parseInt(1500000000, 10),
        minValue: abi.fix('10', "hex"),
        maxValue: abi.fix('250', "hex"),
        numOutcomes: '2',
        resolution: ''
      }));
    }
  });
  test({
    testDescription: "Should handle a createEvent call with space padded description and resolution",
    params: {
      branch: '1010101',
      description: '        This is a test event description',
      expDate: 1500000000,
      minValue: '1',
      maxValue: '50',
      numOutcomes: '2',
      resolution: '     https://iknoweverything.com',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop,
    },
    assertions: function (tx) {
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '1010101',
        description: 'This is a test event description',
        expDate: parseInt(1500000000, 10),
        minValue: abi.fix('1', "hex"),
        maxValue: abi.fix('50', "hex"),
        numOutcomes: '2',
        resolution: 'https://iknoweverything.com'
      }));
    }
  });
});

describe("createMarket.createMarket", function () {
  // 3 tests total
  var test = function (t) {
    it(t.testDescription, function () {
      var createMarket = proxyquire('../../../src/create/create-market', {
        '../rpc-interface': {
          getGasPrice: function () {
            // for simplicity's sake, just return 10.
            return '10';
          }
        },
        '../api': function () {
          return {
            CreateMarket: { createMarket: t.assertions }
          };
        }
      });
      createMarket(t.params);
    });
  };

  test({
    testDescription: "Should handle creation of a market without callbacks",
    params: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      takerFee: 0.02,
      event: 'd262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef',
      tags: ['code', 'computers', 'internet'],
      makerFee: 0.01,
      extraInfo: 'more info',
    },
    assertions: function (tx) {
      var fees = augur.trading.fees.calculateTradingFees(tx.makerFee, tx.takerFee);
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
        takerFee: 0.02,
        event: 'd262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef',
        tags: ['code', 'computers', 'internet'],
        makerFee: 0.01,
        extraInfo: 'more info',
        tradingFee: abi.fix(fees.tradingFee, 'hex'),
        tag1: abi.short_string_to_int256('code'),
        tag2: abi.short_string_to_int256('computers'),
        tag3: abi.short_string_to_int256('internet'),
        makerFees: abi.fix(fees.makerProportionOfFee, 'hex'),
        tx: {
          value: abi.prefix_hex((new BigNumber("1200000", 10).times(abi.bignum('10')).plus(new BigNumber("500000", 10).times(abi.bignum('10')))).toString(16))
        }
      }));
    }
  });
  test({
    testDescription: "Should handle creation of a market without callbacks - no extraInfo provided",
    params: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      takerFee: 0.02,
      event: 'd262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef',
      tags: ['code', 'computers', 'internet'],
      makerFee: 0.01,
      extraInfo: undefined,
    },
    assertions: function (tx) {
      var fees = augur.trading.fees.calculateTradingFees(tx.makerFee, tx.takerFee);
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
        takerFee: 0.02,
        event: 'd262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef',
        tags: ['code', 'computers', 'internet'],
        makerFee: 0.01,
        extraInfo: '',
        tradingFee: abi.fix(fees.tradingFee, 'hex'),
        tag1: abi.short_string_to_int256('code'),
        tag2: abi.short_string_to_int256('computers'),
        tag3: abi.short_string_to_int256('internet'),
        makerFees: abi.fix(fees.makerProportionOfFee, 'hex'),
        tx: {
          value: abi.prefix_hex((new BigNumber("1200000", 10).times(abi.bignum('10')).plus(new BigNumber("500000", 10).times(abi.bignum('10')))).toString(16))
        }
      }));
    },
  });
  test({
    testDescription: "Should handle creation of a market with callbacks",
    params: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      takerFee: 0.04,
      event: 'd262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef',
      tags: ['football', 'soccer', 'baseball'],
      makerFee: 0.02,
      extraInfo: 'even more information',
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    },
    assertions: function (tx) {
      var fees = augur.trading.fees.calculateTradingFees(tx.makerFee, tx.takerFee);
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
        takerFee: 0.04,
        event: 'd262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef',
        tags: ['football', 'soccer', 'baseball'],
        makerFee: 0.02,
        extraInfo: 'even more information',
        onSent: noop,
        onSuccess: noop,
        onFailed: noop,
        tradingFee: abi.fix(fees.tradingFee, 'hex'),
        tag1: abi.short_string_to_int256('football'),
        tag2: abi.short_string_to_int256('soccer'),
        tag3: abi.short_string_to_int256('baseball'),
        makerFees: abi.fix(fees.makerProportionOfFee, 'hex'),
        tx: {
          value: abi.prefix_hex((new BigNumber("1200000", 10).times(abi.bignum('10')).plus(new BigNumber("500000", 10).times(abi.bignum('10')))).toString(16))
        }
      }));
    }
  });
});

describe("createMarket.updateTradingFee", function () {
  // 2 tests total
  var test = function (t) {
    it(t.testDescription, function () {
      var apiUpdateTradingFee = augur.api.CreateMarket.updateTradingFee;

      augur.api.CreateMarket.updateTradingFee = t.assertions;

      augur.trading.fees.updateTradingFee(t.params);

      augur.api.CreateMarket.updateTradingFee = apiUpdateTradingFee;
    });
  };

  test({
    testDescription: 'Should be able to send an updateTradingFee transaction',
    params: {
      branch: '010101',
      market: 'someFakeMarketID',
      takerFee: 0.02,
      makerFee: 0.01,
      onSent: noop,
      onSuccess: noop,
      onFailed: noop
    },
    assertions: function (tx) {
      var fees = augur.trading.fees.calculateTradingFees(tx.makerFee, tx.takerFee);
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '010101',
        market: 'someFakeMarketID',
        takerFee: 0.02,
        makerFee: 0.01,
        tradingFee: abi.fix(fees.tradingFee, "hex"),
        makerFees: abi.fix(fees.makerProportionOfFee, "hex")
      }));
    },
  });

  test({
    testDescription: 'Should be able to send an updateTradingFee transaction without passing callbacks',
    params: {
      branch: '010101',
      market: 'someFakeMarketID',
      takerFee: 0.02,
      makerFee: 0.01,
    },
    assertions: function (tx) {
      var fees = augur.trading.fees.calculateTradingFees(tx.makerFee, tx.takerFee);
      assert.deepEqual(JSON.stringify(tx), JSON.stringify({
        branch: '010101',
        market: 'someFakeMarketID',
        takerFee: 0.02,
        makerFee: 0.01,
        tradingFee: abi.fix(fees.tradingFee, "hex"),
        makerFees: abi.fix(fees.makerProportionOfFee, "hex")
      }));
    }
  });
});
