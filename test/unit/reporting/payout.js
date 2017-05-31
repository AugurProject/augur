"use strict";

var assert = require("chai").assert;
var abi = require('augur-abi');
var noop = require("../../../src/utils/noop");
var proxyquire = require('proxyquire');
var augur = new (require('../../../src/'))();
var clearCallCounts = require("../../tools").clearCallCounts;
var eventsAPI = require("augur-contracts").api.events;
// 11 tests total

// describe("payout.closeMarket", function () {
// 	// 2 tests total
//   var transact;
//   var currentAssertions;
//   before(function () {
//     transact = augur.transact;
//     augur.transact = function (tx, onSent, onSuccess, onFailed) {
// 			// if onSent is defined then callbacks where passed, check that they are functions.
//       if (onSent) {
//         assert.isFunction(onSent);
//         assert.isFunction(onSuccess);
//         assert.isFunction(onFailed);
//       }
// 			// pass transaction object to assertions
//       currentAssertions(tx);
//     };
//   });
//
//   after(function () {
//     augur.transact = transact;
//   });
//
//   var test = function (t) {
//     it(t.testDescription, function () {
//       currentAssertions = t.assertions;
//       augur.closeMarket(t.branch, t.market, t.sender, t.onSent, t.onSuccess, t.onFailed);
//     });
//   };
//
//   test({
//     testDescription: "Should handle sending a transaction to close a market",
//     assertions: function (out) {
//       assert.deepEqual(out.to, augur.store.getState().contractsAPI.functions.CloseMarket.closeMarket.to);
//       assert.deepEqual(out.label, 'Close Market');
//       assert.deepEqual(out.method, 'closeMarket');
//       assert.deepEqual(out.params, [
//         '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d', '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b', '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e'
//       ]);
//     },
//     branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
//     market: '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b',
//     sender: '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e',
//     onSent: noop,
//     onSuccess: noop,
//     onFailed: noop
//   });
//   test({
//     testDescription: "Should handle sending a transaction to close a market with a single object as the argument",
//     assertions: function (out) {
//       assert.deepEqual(out.to, augur.store.getState().contractsAPI.functions.CloseMarket.closeMarket.to);
//       assert.deepEqual(out.label, 'Close Market');
//       assert.deepEqual(out.method, 'closeMarket');
//       assert.deepEqual(out.params, [
//         '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d', '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b', '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e'
//       ]);
//     },
//     branch: {
//       branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
//       market: '09f7e3e3fbc7d5b4c7e9e8fb3013efb22a47b326e7461c7655a2e8466ac27f9b',
//       sender: '2c72686849275a98be3d3d06f062d3fbb3821cc30890218721cce9c67c91157e',
//       onSent: noop,
//       onSuccess: noop,
//       onFailed: noop
//     }
//   });
// });

describe("augur.trading.payout.claimProceeds", function () {
	// 6 tests total
	var Cash;
	var Shares;
	var CallReturn;
	var getTransactionReceipt = function (hash, cb) {
		assert.deepEqual(hash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
		assert.isFunction(cb);
		var logs = [];
		for (var i = 0, numLogs = Cash.length; i < numLogs; i++) {
			logs.push({
				topics: [eventsAPI.payout.signature, '0xdeadbeef', '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd'],
				blockNumber: '1000000000',
				transactionHash: hash,
				removed: false,
				data: [
					Cash[i],
					abi.fix('20000000'),
					Shares[i],
					'15000000000',
				]
			});
		}
		cb({ logs: logs });
	};
	var mockClaimProceeds = function(p) {
		assert.isFunction(p.onSuccess);
		p.onSuccess({
			callReturn: CallReturn,
			hash: '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055',
			transactionHash: '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055'
		});
	};
  var test = function (t) {
    it(t.testDescription, function () {
			var claimProceeds = proxyquire('../../../src/trading/payout/claim-proceeds', {
				'../../rpc-interface': {
					getTransactionReceipt: getTransactionReceipt
				},
				'../../api': function () {
					return { CloseMarket: { claimProceeds: mockClaimProceeds } };
				}
			});
			Cash = t.receiptCash || [];
			Shares = t.receiptShares || [];
			CallReturn = t.callReturn || "1";

      claimProceeds(t.params);
    });
  };

  test({
    testDescription: 'should claim Proceeds for a given market if user has shares on the winning outcome',
		receiptCash: [abi.fix(3000)],
		receiptShares: [abi.fix(100)],
		params: {
			branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
	    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
			onSent: noop,
	    onSuccess: function (res) {
				// onSuccess will act as the assertions function because it is expected to be called.
				assert.deepEqual(res.hash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
				assert.equal(res.transactionHash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
				assert.deepEqual(res.callReturn.sender, '0x00000000000000000000000000000000deadbeef');
				assert.deepEqual(res.callReturn.market, '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd');
	      assert.deepEqual(res.callReturn.cashPayout, '3000');
	      assert.deepEqual(res.callReturn.cashBalance, '20000000');
	      assert.deepEqual(res.callReturn.transactionHash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055')
	      assert.deepEqual(res.callReturn.shares, '100');
	    },
	    onFailed: noop
		}
  });

  test({
    testDescription: 'should claim Proceeds on a market with multiple logs for the transaction and should choose the last log with the correct signature',
    receiptCash: [augur.abi.fix('3000'), augur.abi.fix('1200'), augur.abi.fix('800')],
    receiptShares: [augur.abi.fix('100'), augur.abi.fix('25'), augur.abi.fix('15')],
		params: {
			branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
	    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
	    onSent: noop,
	    onSuccess: function (res) {
				// onSuccess will act as the assertions function because it is expected to be called.
				assert.equal(res.hash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
				assert.equal(res.transactionHash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
				assert.deepEqual(res.callReturn.sender, '0x00000000000000000000000000000000deadbeef');
				assert.deepEqual(res.callReturn.market, '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd');
	      assert.equal(res.callReturn.cashPayout, '3000');
	      assert.equal(res.callReturn.cashBalance, '20000000');
	      assert.equal(res.callReturn.transactionHash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055')
	      assert.equal(res.callReturn.shares, '100');
	    },
	    onFailed: noop
		}
  });

  test({
    testDescription: 'should get 0 proceeds if the user holds no winning positions',
		params: {
			branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
	    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
	    onSent: noop,
	    onSuccess: function (res) {
				// onSuccess will act as the assertions function because it is expected to be called.
	      assert.equal(res.hash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
				assert.equal(res.transactionHash, '614eba37f9829f16d755243d5da9dd545c1a964b0ade8a0f215488fda0889055');
	      assert.equal(res.callReturn, '1');
	    },
	    onFailed: noop
		}
  });

  test({
    testDescription: 'should fail to claim any proceeds if transact responds that trader does not exist',
    callReturn: "-1",
    params: {
      branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
      market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
      onSent: noop,
      onSuccess: noop,
      onFailed: function (res) {
        assert.deepEqual(res, '-1');
      }
    }
  });

  test({
    testDescription: 'should fail to claim any proceeds if transact responds that the branch is invalid',
    callReturn: "-8",
		params: {
			branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
	    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: function (res) {
	      assert.deepEqual(res, '-8');
	    }
		}
  });

  test({
    testDescription: 'should fail to claim any proceeds if transact responds that the market is not resolved',
    callReturn: "0",
		params: {
			branch: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
	    market: '9f595f4dd870f4fac5a0c2ce46a947e1664649083bd16ae57c78aa0e502c4dbd',
	    onSent: noop,
	    onSuccess: noop,
	    onFailed: function (res) {
	      assert.deepEqual(res, '0');
	    }
		}
  });
});

describe("payout.claimMarketsProceeds", function () {
	// 2 tests total
  var finished;
  var callCounts = {
    getWinningOutcomes: 0,
    claimProceeds: 0
  };
  afterEach(function () {
    clearCallCounts(callCounts);
  });
  var test = function (t) {
    it(t.testDescription, function (done) {
      finished = done;
			var claimMarketsProceeds = proxyquire('../../../src/trading/payout/claim-markets-proceeds', {
				'../../api': function () {
					return {
						CloseMarket: { claimProceeds: t.claimProceeds },
						Markets: { getWinningOutcomes: t.getWinningOutcomes }
					};
				}
			});
      claimMarketsProceeds({}, t.branch, t.markets, t.callback);
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
    getWinningOutcomes: function (marketID, cb) {
      callCounts.getWinningOutcomes++;
      cb(['1']);
    },
    claimProceeds: function (arg) {
      // branch, market, onSent, onSuccess, onFailed, all in arg obj in this case
      callCounts.claimProceeds++;
      arg.onSent();
      // normally this returns a event message object
      arg.onSuccess('1');
    },
    callback: function (err, markets) {
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
    getWinningOutcomes: function (marketID, cb) {
      callCounts.getWinningOutcomes++;
      cb(['1']);
    },
    claimProceeds: function (arg) {
      // branch, market, onSent, onSuccess, onFailed, all in arg obj in this case
      callCounts.claimProceeds++;
      arg.onSent();
      // in this case return an error to onfailed.
      arg.onFailed({error: 999, message: 'Uh-Oh!'});
    },
    callback: function (err, markets) {
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
    getWinningOutcomes: function (marketID, cb) {
      callCounts.getWinningOutcomes++;
      // if it's an odd call, return 1, else return 0 winning outcomes, this should skip the 2nd market as intended.
      if (callCounts.getWinningOutcomes%2) {
        cb(['1']);
      } else {
        cb();
      }
    },
    claimProceeds: function (arg) {
      // branch, market, onSent, onSuccess, onFailed, all in arg obj in this case
      callCounts.claimProceeds++;
      arg.onSent();
      // normally this returns a event message object
      arg.onSuccess('1');
    },
    callback: function (err, markets) {
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
