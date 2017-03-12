"use strict";

var assert = require("chai").assert;
var utils = require("../../../src/utilities.js");
var augur = require('../../../src/');
var clearCallCounts = require('../../tools').clearCallCounts;
// 11 tests total

describe("payout.closeMarket", function() {
	// 2 tests total
  var transact;
  var currentAssertions;
  before(function() {
    transact = augur.transact;
    augur.transact = function(tx, onSent, onSuccess, onFailed) {
			// if onSent is defined then callbacks where passed, check that they are functions.
      if (onSent) {
        assert.isFunction(onSent);
        assert.isFunction(onSuccess);
        assert.isFunction(onFailed);
      }
			// pass transaction object to assertions
      currentAssertions(tx);
    };
  });

  after(function() {
    augur.transact = transact;
  });

  var test = function(t) {
    it(t.testDescription, function() {
      currentAssertions = t.assertions;
      augur.closeMarket(t.branch, t.market, t.sender, t.onSent, t.onSuccess, t.onFailed);
    });
  };


  test({
    testDescription: "Should handle sending a transaction to close a market",
    assertions: function(out) {
      assert.deepEqual(out.to, augur.tx.CloseMarket.closeMarket.to);
      assert.deepEqual(out.label, 'Close Market');
      assert.deepEqual(out.method, 'closeMarket');
      assert.deepEqual(out.params, [
        '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d', '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b', '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e'
      ]);
    },
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    market: '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b',
    sender: '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e',
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: utils.noop
  });
  test({
    testDescription: "Should handle sending a transaction to close a market with a single object as the argument",
    assertions: function(out) {
      assert.deepEqual(out.to, augur.tx.CloseMarket.closeMarket.to);
      assert.deepEqual(out.label, 'Close Market');
      assert.deepEqual(out.method, 'closeMarket');
      assert.deepEqual(out.params, [
        '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d', '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b', '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e'
      ]);
    },
    branch: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      market: '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b',
      sender: '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e',
      onSent: utils.noop,
      onSuccess: utils.noop,
      onFailed: utils.noop
    }
  });
});

describe("payout.claimProceeds", function() {
	// 7 tests total
  var transact;
  var receipt;
  var callReturn;
  var Cash;
  var Shares;
  before(function() {
    transact = augur.transact;
    receipt = augur.rpc.receipt;
    augur.transact = function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx.params, ['0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d', '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd']);
      onSuccess({ callReturn: callReturn, hash: '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055' });
    };
    augur.rpc.receipt = function(hash, cb) {
      var logs = [];
      for (var i = 0, numLogs = Cash.length; i < numLogs; i++) {
        logs.push({
          topics: [augur.api.events.payout.signature],
          blockNumber: '1000000000',
          transactionHash: 'd898cbf2afbc9e10fa5936ec1f5666d3ea288ea79570e92dbf16ce57e3104f93',
          removed: false,
          data: [
            Cash[i],
            augur.abi.fix('20000000'),
            Shares[i],
            '15000000000',
          ]
        });
      }
      cb({ logs: logs });
    };
  });
  after(function() {
    augur.transact = transact;
    augur.rpc.receipt = receipt;
  });
  var test = function(t) {
    it(t.testDescription, function() {
      callReturn = t.callReturn || "1";
      Cash = t.receiptCash || [];
      Shares = t.receiptShares || [];
      augur.claimProceeds(t.branch, t.market, t.description, t.onSent, t.onSuccess, t.onFailed);
    });
  };

  test({
    testDescription: 'should claim Proceeds for a given market if user has shares on the winning outcome',
    receiptCash: [augur.abi.fix('3000')],
    receiptShares: [augur.abi.fix('100')],
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
    description: 'This market is extremely interesting and thought provoking.',
    onSent: utils.noop,
    onSuccess: function(res) {
			// onSuccess will act as the assertions function because it is expected to be called.
      assert.equal(res.hash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
      assert.equal(res.callReturn.cashPayout, '3000');
      assert.equal(res.callReturn.cashBalance, '20000000');
      assert.equal(res.callReturn.transactionHash, 'd898cbf2afbc9e10fa5936ec1f5666d3ea288ea79570e92dbf16ce57e3104f93')
      assert.equal(res.callReturn.shares, '100');
    },
    onFailed: utils.noop
  });

  test({
    testDescription: 'should claim Proceeds on a market with multiple logs for the transaction and should choose the last log with the correct signature',
    receiptCash: [augur.abi.fix('3000'), augur.abi.fix('1200'), augur.abi.fix('800')],
    receiptShares: [augur.abi.fix('100'), augur.abi.fix('25'), augur.abi.fix('15')],
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
    description: 'This market is extremely interesting and thought provoking.',
    onSent: utils.noop,
    onSuccess: function(res) {
			// onSuccess will act as the assertions function because it is expected to be called.
      assert.equal(res.hash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
      assert.equal(res.callReturn.cashPayout, '3000');
      assert.equal(res.callReturn.cashBalance, '20000000');
      assert.equal(res.callReturn.transactionHash, 'd898cbf2afbc9e10fa5936ec1f5666d3ea288ea79570e92dbf16ce57e3104f93')
      assert.equal(res.callReturn.shares, '100');
    },
    onFailed: utils.noop
  });

  test({
    testDescription: 'should get 0 proceeds if the user holds no winning positions',
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
    description: 'This market is extremely interesting and thought provoking.',
    onSent: utils.noop,
    onSuccess: function(res) {
			// onSuccess will act as the assertions function because it is expected to be called.
      assert.equal(res.hash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
      assert.equal(res.callReturn, '1');
    },
    onFailed: utils.noop
  });

  test({
    testDescription: 'should claim Proceeds on a market with multiple logs for the transaction and should choose the last log with the correct signature But with a single arg passed to claimProceeds',
    receiptCash: [augur.abi.fix('3000'), augur.abi.fix('1200')],
    receiptShares: [augur.abi.fix('100'), augur.abi.fix('25')],
    branch: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
      description: 'This market is extremely interesting and thought provoking.',
      onSent: utils.noop,
      onSuccess: function(res) {
				// onSuccess will act as the assertions function because it is expected to be called.
        assert.equal(res.hash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
        assert.equal(res.callReturn.cashPayout, '3000');
        assert.equal(res.callReturn.cashBalance, '20000000');
        assert.equal(res.callReturn.transactionHash, 'd898cbf2afbc9e10fa5936ec1f5666d3ea288ea79570e92dbf16ce57e3104f93')
        assert.equal(res.callReturn.shares, '100');
      },
      onFailed: utils.noop
    }
  });

  test({
    testDescription: 'should fail to claim any proceeds if transact responds that trader does not exist',
    callReturn: "-1",
    branch: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
      description: 'This market is extremely interesting and thought provoking.',
      onSent: utils.noop,
      onSuccess: utils.noop,
      onFailed: function(res) {
        assert.deepEqual(res, '-1');
      }
    }
  });

  test({
    testDescription: 'should fail to claim any proceeds if transact responds that the branch is invalid',
    callReturn: "-8",
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
    description: 'This market is extremely interesting and thought provoking.',
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: function(res) {
      assert.deepEqual(res, '-8');
    }
  });

  test({
    testDescription: 'should fail to claim any proceeds if transact responds that the market is not resolved',
    callReturn: "0",
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
    description: 'This market is extremely interesting and thought provoking.',
    onSent: utils.noop,
    onSuccess: utils.noop,
    onFailed: function(res) {
      assert.deepEqual(res, '0');
    }
  });
});

describe("payout.claimMarketsProceeds", function() {
	// 2 tests total
  var claimProceeds = augur.claimProceeds;
  var getWinningOutcomes = augur.getWinningOutcomes;
  var finished;
  var callCounts = {
    getWinningOutcomes: 0,
    claimProceeds: 0
  };
  afterEach(function() {
    clearCallCounts(callCounts);
    augur.claimProceeds = claimProceeds;
    augur.getWinningOutcomes = getWinningOutcomes;
  });
  var test = function(t) {
    it(t.testDescription, function(done) {
      finished = done;
      augur.claimProceeds = t.claimProceeds;
      augur.getWinningOutcomes = t.getWinningOutcomes;
      augur.claimMarketsProceeds(t.branch, t.markets, t.callback);
    });
  };
  test({
    testDescription: 'Should claim Proceeds for given markets if user has shares on the winning outcome',
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    markets: [{
      id: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
      description: 'Will John Doe actually stick with his New Years Resolution?'
    }, {
      id: 'c2a4cee415eb5962401fff2a89fd587e677b1fbcd4652f4edb2ea1f6148c639b',
      description: 'Who framed Roger Rabbit?'
    }, {
      id: '4e747621d2a25a5337c8e22971f3f488b808c5a54ca88b557a18ae438b2e37a0',
      description: 'Will Augur predict everything in the world by 2093 AD?'
    }],
    getWinningOutcomes: function(marketID, cb) {
      callCounts.getWinningOutcomes++;
      cb(['1']);
    },
    claimProceeds: function(arg) {
      // branch, market, onSent, onSuccess, onFailed, all in arg obj in this case
      callCounts.claimProceeds++;
      arg.onSent();
      // normally this returns a event message object
      arg.onSuccess('1');
    },
    callback: function(err, markets) {
      assert.deepEqual(markets, ['9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
		  'c2a4cee415eb5962401fff2a89fd587e677b1fbcd4652f4edb2ea1f6148c639b',
		  '4e747621d2a25a5337c8e22971f3f488b808c5a54ca88b557a18ae438b2e37a0']);
      assert.isNull(err);
      assert.deepEqual(callCounts, {
        getWinningOutcomes: 3,
        claimProceeds: 3
      });
      finished();
    }
  });
  test({
    testDescription: 'Should handle an error from claimProceeds',
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    markets: [{
      id: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
      description: 'Will John Doe actually stick with his New Years Resolution?'
    }, {
      id: 'c2a4cee415eb5962401fff2a89fd587e677b1fbcd4652f4edb2ea1f6148c639b',
      description: 'Who framed Roger Rabbit?'
    }, {
      id: '4e747621d2a25a5337c8e22971f3f488b808c5a54ca88b557a18ae438b2e37a0',
      description: 'Will Augur predict everything in the world by 2093 AD?'
    }],
    getWinningOutcomes: function(marketID, cb) {
      callCounts.getWinningOutcomes++;
      cb(['1']);
    },
    claimProceeds: function(arg) {
      // branch, market, onSent, onSuccess, onFailed, all in arg obj in this case
      callCounts.claimProceeds++;
      arg.onSent();
      // in this case return an error to onfailed.
      arg.onFailed({error: 999, message: 'Uh-Oh!'});
    },
    callback: function(err, markets) {
      assert.deepEqual(err, {error: 999, message: 'Uh-Oh!'});
      assert.isUndefined(markets);
      assert.deepEqual(callCounts, {
        getWinningOutcomes: 1,
        claimProceeds: 1
      });
      finished();
    }
  });
  test({
    testDescription: 'should claim Proceeds for given markets even if a market returns with no winning outcomes, in this case the 2nd market in the series',
    branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
    markets: [{
      id: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
      description: 'Will John Doe actually stick with his New Years Resolution?'
    }, {
      id: 'c2a4cee415eb5962401fff2a89fd587e677b1fbcd4652f4edb2ea1f6148c639b',
      description: 'Who framed Roger Rabbit?'
    }, {
      id: '4e747621d2a25a5337c8e22971f3f488b808c5a54ca88b557a18ae438b2e37a0',
      description: 'Will Augur predict everything in the world by 2093 AD?'
    }],
    getWinningOutcomes: function(marketID, cb) {
      callCounts.getWinningOutcomes++;
      // if it's an odd call, return 1, else return 0 winning outcomes, this should skip the 2nd market as intended.
      if (callCounts.getWinningOutcomes%2) {
        cb(['1']);
      } else {
        cb();
      }
    },
    claimProceeds: function(arg) {
      // branch, market, onSent, onSuccess, onFailed, all in arg obj in this case
      callCounts.claimProceeds++;
      arg.onSent();
      // normally this returns a event message object
      arg.onSuccess('1');
    },
    callback: function(err, markets) {
      assert.deepEqual(markets, ['9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
		  '4e747621d2a25a5337c8e22971f3f488b808c5a54ca88b557a18ae438b2e37a0']);
      assert.isNull(err);
      assert.deepEqual(callCounts, {
        getWinningOutcomes: 3,
        claimProceeds: 2
      });
      finished();
    }
  });
});
