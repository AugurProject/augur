"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var utils = require("../../../src/utilities");
var abi = require("augur-abi");
var constants = require("../../../src/constants");
// 68 tests total

describe('CompositeGetters.loadNextMarketsBatch', function() {
  // 5 tests total
  var assertionsCC = 0;
  var getMarketsInfo = augur.getMarketsInfo;
  afterEach(function() {
    augur.getMarketsInfo = getMarketsInfo;
  });
  var test = function(t) {
    assertionsCC = 0;
    it(t.description + " async", function(done) {
      augur.getMarketsInfo = t.getMarketsInfo;
      var pause = constants.PAUSE_BETWEEN_MARKET_BATCHES;
      constants.PAUSE_BETWEEN_MARKET_BATCHES = 1;
      // if we pass in t.nextPass as true then use a mock, else set nextPass to undefined.
      var nextPass = t.nextPass ?
        function() { done(); } :
        undefined;
      augur.loadNextMarketsBatch(t.branchID, t.startIndex, t.chunkSize, t.numMarkets, t.isDesc, t.volumeMin, t.volumeMax, function(err, marketsData) {
        // chunkCB
        var finished = t.assertions(err, marketsData);
        if (finished) { done(); }
      }, nextPass);
    });
  };
  test({
    description: 'Should get marketsData ascending, only non-zero volume markets, no NextPass',
    branchID: '101010',
    startIndex: 0,
    chunkSize: 5,
    numMarkets: 10,
    isDesc: false,
    volumeMin: 0,
    volumeMax: -1,
    nextPass: false,
    getMarketsInfo: function(branch, cb) {
      var offset = branch.offset;
      var numMarketsToLoad = branch.numMarketsToLoad;
      var allMarkets = [{ id: '0x01', volume: '1000'}, { id: '0x02', volume: '1000'}, { id: '0x03', volume: '1000'}, { id: '0x04', volume: '1000'}, { id: '0x05', volume: '1000'}, { id: '0x06', volume: '1000'}, { id: '0x07', volume: '1000'}, { id: '0x08', volume: '1000'}, { id: '0x09', volume: '1000'}, { id: '0x0a', volume: '1000'}];
      cb(allMarkets.slice(offset, offset + numMarketsToLoad));
    },
    assertions: function(err, marketsData) {
      assert.isNull(err);
      // depending on marketsData we will assert what we expect then return true/false to indicate that done() should be called.
      if (marketsData[4].id === '0x0a') {
        assert.deepEqual(marketsData, [{ id: '0x06', volume: '1000'}, { id: '0x07', volume: '1000'}, { id: '0x08', volume: '1000'}, { id: '0x09', volume: '1000'}, { id: '0x0a', volume: '1000'}]);
        return true;
      } else {
        assert.deepEqual(marketsData, [{ id: '0x01', volume: '1000'}, { id: '0x02', volume: '1000'}, { id: '0x03', volume: '1000'}, { id: '0x04', volume: '1000'}, { id: '0x05', volume: '1000'}]);
        return false;
      }
    }
  });
  test({
    description: 'Should get marketsData ascending, only non-zero volume markets, then call nextPass',
    branchID: '101010',
    startIndex: 0,
    chunkSize: 5,
    numMarkets: 10,
    isDesc: false,
    volumeMin: 0,
    volumeMax: -1,
    nextPass: true,
    getMarketsInfo: function(branch, cb) {
      var offset = branch.offset;
      var numMarketsToLoad = branch.numMarketsToLoad;
      var allMarkets = [{ id: '0x01', volume: '1000'}, { id: '0x02', volume: '1000'}, { id: '0x03', volume: '1000'}, { id: '0x04', volume: '1000'}, { id: '0x05', volume: '1000'}, { id: '0x06', volume: '1000'}, { id: '0x07', volume: '1000'}, { id: '0x08', volume: '1000'}, { id: '0x09', volume: '1000'}, { id: '0x0a', volume: '1000'}];
      cb(allMarkets.slice(offset, offset + numMarketsToLoad));
    },
    assertions: function(err, marketsData) {
      assert.isNull(err);
      // depending on marketsData we will assert what we expect then return false since nextPass should call Done() once complete.
      if (marketsData[4].id === '0x0a') {
        assert.deepEqual(marketsData, [{ id: '0x06', volume: '1000'}, { id: '0x07', volume: '1000'}, { id: '0x08', volume: '1000'}, { id: '0x09', volume: '1000'}, { id: '0x0a', volume: '1000'}]);
        return false;
      } else {
        assert.deepEqual(marketsData, [{ id: '0x01', volume: '1000'}, { id: '0x02', volume: '1000'}, { id: '0x03', volume: '1000'}, { id: '0x04', volume: '1000'}, { id: '0x05', volume: '1000'}]);
        return false;
      }
    }
  });
  test({
    description: 'Should handle error objects from getMarketsInfo',
    branchID: '101010',
    startIndex: 0,
    chunkSize: 5,
    numMarkets: 10,
    isDesc: false,
    volumeMin: 0,
    volumeMax: -1,
    nextPass: false,
    getMarketsInfo: function(branch, cb) {
      cb({ error: 'Uh-Oh!' });
    },
    assertions: function(err, marketsData) {
      assertionsCC++;
      assert.deepEqual(err, { error: 'Uh-Oh!' });
      assert.isUndefined(marketsData);
      if (assertionsCC === 2) { return true; }
      return false;
    }
  });
  test({
    description: 'Should get marketsData descending, only non-zero volume markets, no NextPass',
    branchID: '101010',
    startIndex: 10,
    chunkSize: 5,
    numMarkets: 10,
    isDesc: true,
    volumeMin: 0,
    volumeMax: -1,
    nextPass: false,
    getMarketsInfo: function(branch, cb) {
      var offset = branch.offset;
      var numMarketsToLoad = branch.numMarketsToLoad;
      var allMarkets = [{ id: '0x01', volume: '1000'}, { id: '0x02', volume: '1000'}, { id: '0x03', volume: '1000'}, { id: '0x04', volume: '1000'}, { id: '0x05', volume: '1000'}, { id: '0x06', volume: '1000'}, { id: '0x07', volume: '1000'}, { id: '0x08', volume: '1000'}, { id: '0x09', volume: '1000'}, { id: '0x0a', volume: '1000'}];
      var output = [];
      for (var i = 0; i < numMarketsToLoad; i++) {
        output.push(allMarkets[(offset - 1) - i]);
      }
      cb(output);
    },
    assertions: function(err, marketsData) {
      assert.isNull(err);
      // depending on marketsData we will assert what we expect then return true/false to indicate that done() should be called.
      if (marketsData.constructor === Array && !marketsData.length) {
        // empty array back, we have completed getting records, return true to end the test.
        return true;
      } else if (marketsData[0].id === '0x0a') {
        assert.deepEqual(marketsData, [{ id: '0x0a', volume: '1000'}, { id: '0x09', volume: '1000'}, { id: '0x08', volume: '1000'}, { id: '0x07', volume: '1000'}, { id: '0x06', volume: '1000'} ]);
        return false;
      } else {
        assert.deepEqual(marketsData, [{ id: '0x05', volume: '1000'}, { id: '0x04', volume: '1000'}, { id: '0x03', volume: '1000'}, { id: '0x02', volume: '1000'}, { id: '0x01', volume: '1000'}]);
        return false;
      }
    }
  });
  test({
    description: 'Should get marketsData descending, only zero volume markets, then call NextPass',
    branchID: '101010',
    startIndex: 10,
    chunkSize: 5,
    numMarkets: 10,
    isDesc: true,
    volumeMin: -1,
    volumeMax: 0,
    nextPass: true,
    getMarketsInfo: function(branch, cb) {
      var offset = branch.offset;
      var numMarketsToLoad = branch.numMarketsToLoad;
      var allMarkets = [{ id: '0x01', volume: '0'}, { id: '0x02', volume: '0'}, { id: '0x03', volume: '0'}, { id: '0x04', volume: '0'}, { id: '0x05', volume: '0'}, { id: '0x06', volume: '0'}, { id: '0x07', volume: '0'}, { id: '0x08', volume: '0'}, { id: '0x09', volume: '0'}, { id: '0x0a', volume: '0'}];
      var output = [];
      for (var i = 0; i < numMarketsToLoad; i++) {
        output.push(allMarkets[(offset - 1) - i]);
      }
      cb(output);
    },
    assertions: function(err, marketsData) {
      assert.isNull(err);
      // depending on marketsData we will assert what we expect then return true/false to indicate that done() should be called.
      if (marketsData.constructor === Array && !marketsData.length) {
        // empty array back, we have completed getting records, return false to have the function call nextPass.
        return false;
      } else if (marketsData[0].id === '0x0a') {
        assert.deepEqual(marketsData, [{ id: '0x0a', volume: '0'}, { id: '0x09', volume: '0'}, { id: '0x08', volume: '0'}, { id: '0x07', volume: '0'}, { id: '0x06', volume: '0'} ]);
        return false;
      } else {
        assert.deepEqual(marketsData, [{ id: '0x05', volume: '0'}, { id: '0x04', volume: '0'}, { id: '0x03', volume: '0'}, { id: '0x02', volume: '0'}, { id: '0x01', volume: '0'}]);
        return false;
      }
    }
  });
});
describe('CompositeGetters.loadMarketsHelper', function() {
  // 3 tests total
  var getNumMarketsBranch = augur.getNumMarketsBranch;
  var loadNextMarketsBatch = augur.loadNextMarketsBatch;
  var options = augur.options;
  afterEach(function() {
    augur.getNumMarketsBranch = getNumMarketsBranch;
    augur.loadNextMarketsBatch = loadNextMarketsBatch;
    augur.options = options;
  });
  var test = function(t) {
    it(t.description + " async", function(done) {
      var chunkCBcc = 0;
      augur.getNumMarketsBranch = t.getNumMarketsBranch;
      augur.loadNextMarketsBatch = t.loadNextMarketsBatch;
      augur.options = t.options;
      augur.loadMarketsHelper(t.branchID, t.chunkSize, t.isDesc, function(err, marketsData) {
        chunkCBcc++;
        t.assertions(err, marketsData, chunkCBcc);
        if (chunkCBcc === (t.numMarkets/t.chunkSize)) { done(); }
      });
    });
  };
  test({
    description: 'Should return a batch of markets in ascending order, including zero volume markets',
    branchID: '101010',
    chunkSize: 5,
    isDesc: false,
    options: { loadZeroVolumeMarkets: true },
    numMarkets: 10,
    getNumMarketsBranch: function(branch, cb) {
      cb(10);
    },
    loadNextMarketsBatch: function(branchID, startIndex, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass) {
      assert.deepEqual(startIndex, 0, 'startIndex was not the expected value when passed to loadNextMarketsBatch in CompositeGetters.loadMarketsHelper, 1st test');
      if (volumeMax < 0) {
        // send back 5 markets with volume
        chunkCB(null, {
          '0x0a1': {id: '0x0a1', branchId: '101010', volume: '3000'},
          '0x0a2': {id: '0x0a2', branchId: '101010', volume: '4000'},
          '0x0a3': {id: '0x0a3', branchId: '101010', volume: '5000'},
          '0x0a4': {id: '0x0a4', branchId: '101010', volume: '1500'},
          '0x0a5': {id: '0x0a5', branchId: '101010', volume: '2000'},
        });
        setTimeout(function () {
          nextPass();
        }, 5);
      } else {
        // send back 5 markets with no volume
        chunkCB(null, {
          '0x0a6': {id: '0x0a6', branchId: '101010', volume: '0'},
          '0x0a7': {id: '0x0a7', branchId: '101010', volume: '0'},
          '0x0a8': {id: '0x0a8', branchId: '101010', volume: '0'},
          '0x0a9': {id: '0x0a9', branchId: '101010', volume: '0'},
          '0x0aa': {id: '0x0aa', branchId: '101010', volume: '0'},
        });
      }
    },
    assertions: function(err, marketsData, callCount) {
      assert.isNull(err);
      switch(callCount) {
      case 1:
        assert.deepEqual(marketsData, {
          '0x0a1': {id: '0x0a1', branchId: '101010', volume: '3000'},
          '0x0a2': {id: '0x0a2', branchId: '101010', volume: '4000'},
          '0x0a3': {id: '0x0a3', branchId: '101010', volume: '5000'},
          '0x0a4': {id: '0x0a4', branchId: '101010', volume: '1500'},
          '0x0a5': {id: '0x0a5', branchId: '101010', volume: '2000'},
        });
        break;
      default:
        assert.deepEqual(marketsData, {
          '0x0a6': {id: '0x0a6', branchId: '101010', volume: '0'},
          '0x0a7': {id: '0x0a7', branchId: '101010', volume: '0'},
          '0x0a8': {id: '0x0a8', branchId: '101010', volume: '0'},
          '0x0a9': {id: '0x0a9', branchId: '101010', volume: '0'},
          '0x0aa': {id: '0x0aa', branchId: '101010', volume: '0'},
        });
        break;
      }
    }
  });
  test({
    description: 'Should return a batch of markets in descending order, including zero volume markets',
    branchID: '101010',
    chunkSize: 5,
    isDesc: true,
    options: { loadZeroVolumeMarkets: true },
    numMarkets: 10,
    getNumMarketsBranch: function(branch, cb) {
      cb(10);
    },
    loadNextMarketsBatch: function(branchID, startIndex, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass) {
      assert.deepEqual(startIndex, 6, 'startIndex was not the expected value when passed to loadNextMarketsBatch in CompositeGetters.loadMarketsHelper, 2nd test');
      if (volumeMax < 0) {
        // send back 5 markets with volume
        chunkCB(null, {
          '0x0a5': {id: '0x0a5', branchId: '101010', volume: '2000'},
          '0x0a4': {id: '0x0a4', branchId: '101010', volume: '1500'},
          '0x0a3': {id: '0x0a3', branchId: '101010', volume: '5000'},
          '0x0a2': {id: '0x0a2', branchId: '101010', volume: '4000'},
          '0x0a1': {id: '0x0a1', branchId: '101010', volume: '3000'},
        });
        setTimeout(function () {
          nextPass();
        }, 5);
      } else {
        // send back 5 markets with no volume
        chunkCB(null, {
          '0x0aa': {id: '0x0aa', branchId: '101010', volume: '0'},
          '0x0a9': {id: '0x0a9', branchId: '101010', volume: '0'},
          '0x0a8': {id: '0x0a8', branchId: '101010', volume: '0'},
          '0x0a7': {id: '0x0a7', branchId: '101010', volume: '0'},
          '0x0a6': {id: '0x0a6', branchId: '101010', volume: '0'},
        });
      }
    },
    assertions: function(err, marketsData, callCount) {
      assert.isNull(err);
      switch(callCount) {
      case 1:
        assert.deepEqual(marketsData, {
          '0x0a5': {id: '0x0a5', branchId: '101010', volume: '2000'},
          '0x0a4': {id: '0x0a4', branchId: '101010', volume: '1500'},
          '0x0a3': {id: '0x0a3', branchId: '101010', volume: '5000'},
          '0x0a2': {id: '0x0a2', branchId: '101010', volume: '4000'},
          '0x0a1': {id: '0x0a1', branchId: '101010', volume: '3000'},
        });
        break;
      default:
        assert.deepEqual(marketsData, {
          '0x0aa': {id: '0x0aa', branchId: '101010', volume: '0'},
          '0x0a9': {id: '0x0a9', branchId: '101010', volume: '0'},
          '0x0a8': {id: '0x0a8', branchId: '101010', volume: '0'},
          '0x0a7': {id: '0x0a7', branchId: '101010', volume: '0'},
          '0x0a6': {id: '0x0a6', branchId: '101010', volume: '0'},
        });
        break;
      }
    }
  });
  test({
    description: 'Should return a batch of markets in ascending order, Do not include zero volume markets',
    branchID: '101010',
    chunkSize: 5,
    isDesc: false,
    options: { loadZeroVolumeMarkets: false },
    numMarkets: 10,
    getNumMarketsBranch: function(branch, cb) {
      cb(10);
    },
    loadNextMarketsBatch: function(branchID, startIndex, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass) {
      if (startIndex === 0) {
        assert.deepEqual(startIndex, 0, 'startIndex was not the expected value when passed to loadNextMarketsBatch in CompositeGetters.loadMarketsHelper, 3rd test, 1st pass.');
        // send back 5 markets with volume
        chunkCB(null, {
          '0x0a1': {id: '0x0a1', branchId: '101010', volume: '3000'},
          '0x0a2': {id: '0x0a2', branchId: '101010', volume: '4000'},
          '0x0a3': {id: '0x0a3', branchId: '101010', volume: '5000'},
          '0x0a4': {id: '0x0a4', branchId: '101010', volume: '1500'},
          '0x0a5': {id: '0x0a5', branchId: '101010', volume: '2000'},
        });
        // numMarkets is 10, we have produced 5, call loadNextMarketsBatch again for the next chunk(5)
        setTimeout(function () {
          augur.loadNextMarketsBatch(branchID, startIndex + chunkSize, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass);
        }, 5);
      } else {
        assert.deepEqual(5, startIndex, 'startIndex was not the expected value when passed to loadNextMarketsBatch in CompositeGetters.loadMarketsHelper, 3rd test, 2nd pass');
        // send back 5 more markets with volume
        chunkCB(null, {
          '0x0a6': {id: '0x0a6', branchId: '101010', volume: '50'},
          '0x0a7': {id: '0x0a7', branchId: '101010', volume: '990'},
          '0x0a8': {id: '0x0a8', branchId: '101010', volume: '8800'},
          '0x0a9': {id: '0x0a9', branchId: '101010', volume: '1337'},
          '0x0aa': {id: '0x0aa', branchId: '101010', volume: '10000'},
        });
      }
    },
    assertions: function(err, marketsData, callCount) {
      assert.isNull(err);
      switch(callCount) {
      case 1:
        assert.deepEqual(marketsData, {
          '0x0a1': {id: '0x0a1', branchId: '101010', volume: '3000'},
          '0x0a2': {id: '0x0a2', branchId: '101010', volume: '4000'},
          '0x0a3': {id: '0x0a3', branchId: '101010', volume: '5000'},
          '0x0a4': {id: '0x0a4', branchId: '101010', volume: '1500'},
          '0x0a5': {id: '0x0a5', branchId: '101010', volume: '2000'},
        });
        break;
      default:
        assert.deepEqual(marketsData, {
          '0x0a6': {id: '0x0a6', branchId: '101010', volume: '50'},
          '0x0a7': {id: '0x0a7', branchId: '101010', volume: '990'},
          '0x0a8': {id: '0x0a8', branchId: '101010', volume: '8800'},
          '0x0a9': {id: '0x0a9', branchId: '101010', volume: '1337'},
          '0x0aa': {id: '0x0aa', branchId: '101010', volume: '10000'},
        });
        break;
      }
    }
  });
});
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
describe('CompositeGetters.parseBatchMarketInfo', function() {
  // 4 tests total
  var test = function(t) {
    it(t.description, function() {
      var parseMarketInfo = augur.parseMarketInfo;
      augur.parseMarketInfo = t.parseMarketInfo;

      t.assertions(augur.parseBatchMarketInfo(t.marketsArray, t.numMarkets));

      augur.parseMarketInfo = parseMarketInfo;
    });
  };
  test({
    description: 'Should return the marketsArray if it is undefined',
    marketsArray: undefined,
    numMarkets: 3,
    parseMarketInfo: function(info) {
      // shouldn't be reached
      assert.isNull('parseMarketInfo hit');
    },
    assertions: function(o) {
      assert.isUndefined(o);
    }
  });
  test({
    description: 'Should return the marketsArray if it is not an array',
    marketsArray: {},
    numMarkets: 3,
    parseMarketInfo: function(info) {
      // shouldn't be reached
      assert.isNull('parseMarketInfo hit');
    },
    assertions: function(o) {
      assert.deepEqual(o, {});
    }
  });
  test({
    description: 'Should return the marketsArray if it is an empty array',
    marketsArray: [],
    numMarkets: 3,
    parseMarketInfo: function(info) {
      // shouldn't be reached
      assert.isNull('parseMarketInfo hit');
    },
    assertions: function(o) {
      assert.deepEqual(o, []);
    }
  });
  test({
    description: 'Should return marketInfo after parsing the marketsArray',
    marketsArray: ['4', '0x0a1', '2', 'binary', '4', '0x0a2', '2', 'binary'],
    numMarkets: 2,
    parseMarketInfo: function(info) {
      return {marketID: info[0], numOutcomes: info[1], type: info[2]};
    },
    assertions: function(o) {
      assert.deepEqual(o, {
        '0x00000000000000000000000000000000000000000000000000000000000000a1': { marketID: '0x0a1', numOutcomes: '2', type: 'binary', sortOrder: 0 },
        '0x00000000000000000000000000000000000000000000000000000000000000a2': { marketID: '0x0a2', numOutcomes: '2', type: 'binary', sortOrder: 1 },
      });
    }
  });
  test({
    description: 'Should return empty marketInfo after parsing the marketsArray but parseMarket keeps returning empty objects',
    marketsArray: ['4', '0x0a1', '2', 'binary', '4', '0x0a2', '2', 'binary'],
    numMarkets: 2,
    parseMarketInfo: function(info) {
      return {};
    },
    assertions: function(o) {
      assert.deepEqual(o, {});
    }
  });
});
describe('CompositeGetters.batchGetMarketInfo', function() {
  // 2 tests total
  var test = function(t) {
    it(t.description, function() {
      var fire = augur.fire;
      augur.fire = t.assertions;

      augur.batchGetMarketInfo(t.marketIDs, t.account, t.callback);

      augur.fire = fire;
    });
  };
  test({
    description: 'Should prepare a batchGetMarketInfo transaction',
    marketIDs: ['0x0a1', '0x0a2', '0x0a3'],
    account: '0x0',
    callback: utils.noop,
    assertions: function(tx, callback, parseBatchMarketInfo, numMarketIDs) {
      assert.deepEqual(tx.to, augur.tx.CompositeGetters.batchGetMarketInfo.to);
      assert.deepEqual(tx.params, [['0x0a1', '0x0a2', '0x0a3'],'0x0']);
      assert.deepEqual(numMarketIDs, 3);
    }
  });
  test({
    description: 'Should prepare a batchGetMarketInfo transaction with the callback passed as account',
    marketIDs: ['0x0a1', '0x0a2', '0x0a3'],
    account: utils.noop,
    callback: undefined,
    assertions: function(tx, callback, parseBatchMarketInfo, numMarketIDs) {
      assert.deepEqual(tx.to, augur.tx.CompositeGetters.batchGetMarketInfo.to);
      assert.deepEqual(tx.params, [['0x0a1', '0x0a2', '0x0a3'], 0]);
      assert.deepEqual(numMarketIDs, 3);
    }
  });
});
describe('CompositeGetters.parseMarketsInfo', function() {
  // 4 tests total
  var test = function(t) {
    it(t.description, function() {
      t.assertions(augur.parseMarketsInfo(t.marketsArray, t.branch));
    });
  };
  // [numMarketsTotal, MarketLength, marketID, tradingPeriod, tradingFee, creationTime, volume, tag1, tag2, tag3, endDate, makerProportionOfFee, eventID, minVale, maxValue, numOutcomes, reportedOutcome, description]
  test({
    description: 'Should handle a marketsArray with all three market types and process everything correctly.',
    marketsArray: ['3', '17', '0x0a1', '500', '400000000000000000', 140000000, '1000000000000000000000', abi.short_string_to_int256('sports'), abi.short_string_to_int256('football'), abi.short_string_to_int256('nfl'), 15000000, '20000000000000000', '0x0e1', '1000000000000000000', '2000000000000000000', '2', '1000000000000000000',
    '57696c6c2074686520436c6576656c616e642042726f776e732077696e205375706572626f776c204c493f',
    '17', '0x0a2', '500', '600000000000000000', 140000000, '2500000000000000000000', abi.short_string_to_int256('sports'), abi.short_string_to_int256('basketball'), abi.short_string_to_int256('nba'), 15000000, '30000000000000000', '0x0e2', '1000000000000000000', '250000000000000000000', '2', '',
    '486f77206d616e7920706f696e74732077696c6c2062652073636f72656420696e2067616d652031206f66207468652032303137204e42412066696e616c733f',
    '17', '0x0a3', '500', '200000000000000000', 140000000, '125000000000000000000', abi.short_string_to_int256('sports'), abi.short_string_to_int256('baseball'), abi.short_string_to_int256('mlb'), 15000000, '10000000000000000', '0x0e3', '1000000000000000000', '50000000000000000000', '5', '',
    '5768696368207465616d2077696c6c2077696e2074686520414c204561737420696e20746865203230313720736561736f6e206f66204d4c423f'],
    branch: augur.constants.DEFAULT_BRANCH_ID,
    assertions: function(parsedMarketsInfo) {
      assert.deepEqual(parsedMarketsInfo, {
        '0x00000000000000000000000000000000000000000000000000000000000000a1': {
          sortOrder: 0,
          id: '0x00000000000000000000000000000000000000000000000000000000000000a1',
          branchId: '0xf69b5',
          tradingPeriod: 1280,
          tradingFee: '0.4',
          makerFee: '0.008',
          takerFee: '0.592',
          creationTime: 5368709120,
          volume: '1000',
          tags: ['sports', 'football', 'nfl'],
          endDate: 352321536,
          eventID: '0x00000000000000000000000000000000000000000000000000000000000000e1',
          minValue: '1',
          maxValue: '2',
          numOutcomes: 2,
          type: 'binary',
          reportedOutcome: '1',
          isIndeterminate: false,
          description: 'Will the Cleveland Browns win Superbowl LI?'
        },
        '0x00000000000000000000000000000000000000000000000000000000000000a2': {
          sortOrder: 1,
          id: '0x00000000000000000000000000000000000000000000000000000000000000a2',
          branchId: '0xf69b5',
          tradingPeriod: 1280,
          tradingFee: '0.6',
          makerFee: '0.018',
          takerFee: '0.882',
          creationTime: 5368709120,
          volume: '2500',
          tags: ['sports', 'basketball', 'nba'],
          endDate: 352321536,
          eventID: '0x00000000000000000000000000000000000000000000000000000000000000e2',
          minValue: '1',
          maxValue: '250',
          numOutcomes: 2,
          type: 'scalar',
          reportedOutcome: undefined,
          isIndeterminate: undefined,
          description: 'How many points will be scored in game 1 of the 2017 NBA finals?'
        },
        '0x00000000000000000000000000000000000000000000000000000000000000a3': {
          sortOrder: 2,
          id: '0x00000000000000000000000000000000000000000000000000000000000000a3',
          branchId: '0xf69b5',
          tradingPeriod: 1280,
          tradingFee: '0.2',
          makerFee: '0.002',
          takerFee: '0.298',
          creationTime: 5368709120,
          volume: '125',
          tags: ['sports', 'baseball', 'mlb'],
          endDate: 352321536,
          eventID: '0x00000000000000000000000000000000000000000000000000000000000000e3',
          minValue: '1',
          maxValue: '50',
          numOutcomes: 5,
          type: 'categorical',
          reportedOutcome: undefined,
          isIndeterminate: undefined,
          description: 'Which team will win the AL East in the 2017 season of MLB?'
        }
      });
    }
  });
  test({
    description: 'Should handle an empty markets array and return null',
    marketsArray: [],
    branch: augur.constants.DEFAULT_BRANCH_ID,
    assertions: function(parsedMarketsInfo) {
      assert.isNull(parsedMarketsInfo);
    }
  });
  test({
    description: 'Should handle a non array passed as marketsArray and return null',
    marketsArray: {},
    branch: augur.constants.DEFAULT_BRANCH_ID,
    assertions: function(parsedMarketsInfo) {
      assert.isNull(parsedMarketsInfo);
    }
  });
  test({
    description: 'Should handle undefined passed as marketsArray and return null',
    marketsArray: undefined,
    branch: augur.constants.DEFAULT_BRANCH_ID,
    assertions: function(parsedMarketsInfo) {
      assert.isNull(parsedMarketsInfo);
    }
  });
});
describe('CompositeGetters.getMarketsInfo', function() {
  // 7 tests total
  var fire = augur.fire;
  var augurNodeGetMarketsInfo = augur.augurNode.getMarketsInfo;
  var augurNodes = augur.augurNode.nodes;
  var augurNodeGetMarketsInfoCC = 0;
  afterEach(function() {
    augur.fire = fire;
    augur.augurNode.getMarketsInfo = augurNodeGetMarketsInfo;
    augur.augurNode.nodes = augurNodes;
    augurNodeGetMarketsInfoCC = 0;
  });
  var test = function(t) {
    it(t.description + ' sync', function() {
      augur.augurNode.nodes = t.nodes;
      augur.fire = t.fire;
      augur.augurNode.getMarketsInfo = t.augurNodeGetMarketsInfo;

      augur.getMarketsInfo(t.branch, t.offset, t.numMarketsToLoad, t.volumeMin, t.volumeMax, t.callback);
    });
  };
  test({
    description: 'Should return a markets object array, augurNodes available, all args passed in expected positions',
    branch: '101010',
    offset: 1,
    numMarketsToLoad: 1,
    volumeMin: 0,
    volumeMax: -1,
    callback: function(data) {
      assert.deepEqual(data, [{id:'0x0a1', volumne: '10000', branch: '101010', type: 'binary'}]);
    },
    nodes: ["https://augurnode1.net", "https://augurnode2.net"],
    fire: function(tx, callback, parseMarketsInfo, branch) {
      // in this case, this function shouldn't be hit.
    },
    augurNodeGetMarketsInfo: function(branch, cb) {
      cb(null, JSON.stringify([{id:'0x0a1', volumne: '10000', branch: '101010', type: 'binary'}]));
    }
  });
  test({
    description: 'Should return a markets object array, augurNodes available, all args passed in expected positions. augurNode.getMarketsInfo will return an error object the first 3 calls, then call itself again each time until we get market info back.',
    branch: '101010',
    offset: 1,
    numMarketsToLoad: 1,
    volumeMin: 0,
    volumeMax: -1,
    callback: function(data) {
      assert.deepEqual(data, [{id:'0x0a1', volumne: '10000', branch: '101010', type: 'binary'}]);
      // confirm we errored 3 times before returning markets and we continue to self call and retry.
      assert.deepEqual(augurNodeGetMarketsInfoCC, 4);
    },
    nodes: ["https://augurnode1.net", "https://augurnode2.net"],
    fire: function(tx, callback, parseMarketsInfo, branch) {
      // in this case, this function shouldn't be hit.
    },
    augurNodeGetMarketsInfo: function(branch, cb) {
      switch(augurNodeGetMarketsInfoCC) {
      case 4:
        cb(null, JSON.stringify([{id:'0x0a1', volumne: '10000', branch: '101010', type: 'binary'}]));
        break;
      default:
        augurNodeGetMarketsInfoCC++;
        cb({ error: 'Uh-Oh!'});
        break;
      }
    }
  });
  test({
    description: 'Should return a markets object array, augurNodes available, Single arg pass in',
    branch: {
      branch: '101010',
      offset: 1,
      numMarketsToLoad: 1,
      volumeMin: 0,
      volumeMax: -1,
      callback: function(data) { assert.deepEqual(data, [{id:'0x0a1', volumne: '10000', branch: '101010', type: 'binary'}]); }
    },
    offset: undefined,
    numMarketsToLoad: undefined,
    volumeMin: undefined,
    volumeMax: undefined,
    callback: undefined,
    nodes: ["https://augurnode1.net", "https://augurnode2.net"],
    fire: function(tx, callback, parseMarketsInfo, branch) {
      // in this case, this function shouldn't be hit.
    },
    augurNodeGetMarketsInfo: function(branch, cb) {
      cb(null, JSON.stringify([{id:'0x0a1', volumne: '10000', branch: '101010', type: 'binary'}]));
    }
  });
  test({
    description: 'Should return a markets object array, augurNodes available, Single arg + offset as callback',
    branch: {
      branch: '101010',
      offset: 1,
      numMarketsToLoad: 1,
      volumeMin: 0,
      volumeMax: -1,
      callback: undefined
    },
    offset: function(data) { assert.deepEqual(data, [{id:'0x0a1', volumne: '10000', branch: '101010', type: 'binary'}]); },
    numMarketsToLoad: undefined,
    volumeMin: undefined,
    volumeMax: undefined,
    callback: undefined,
    nodes: ["https://augurnode1.net", "https://augurnode2.net"],
    fire: function(tx, callback, parseMarketsInfo, branch) {
      // in this case, this function shouldn't be hit.
    },
    augurNodeGetMarketsInfo: function(branch, cb) {
      cb(null, JSON.stringify([{id:'0x0a1', volumne: '10000', branch: '101010', type: 'binary'}]));
    }
  });
  test({
    description: 'Should return a markets object array, augurNodes available, only callback passed',
    branch: undefined,
    offset: undefined,
    numMarketsToLoad: undefined,
    volumeMin: undefined,
    volumeMax: undefined,
    callback: function(data) { assert.deepEqual(data, [{id:'0x0a1', volumne: '10000', branch: augur.constants.DEFAULT_BRANCH_ID, type: 'binary'}]); },
    nodes: ["https://augurnode1.net", "https://augurnode2.net"],
    fire: function(tx, callback, parseMarketsInfo, branch) {
      // in this case, this function shouldn't be hit.
    },
    augurNodeGetMarketsInfo: function(branch, cb) {
      cb(null, JSON.stringify([{id:'0x0a1', volumne: '10000', branch: augur.constants.DEFAULT_BRANCH_ID, type: 'binary'}]));
    }
  });
  test({
    description: 'Should send default params to fire, augurNodes unavailable, only callback passed',
    branch: undefined,
    offset: undefined,
    numMarketsToLoad: undefined,
    volumeMin: undefined,
    volumeMax: undefined,
    callback: function(data) {
      assert.deepEqual(data.params, [augur.constants.DEFAULT_BRANCH_ID, 0, 0, 0, 0]);
      assert.deepEqual(data.to, augur.tx.CompositeGetters.getMarketsInfo.to);
    },
    nodes: [],
    fire: function(tx, callback, parseMarketsInfo, branch) {
      callback(tx);
    },
    augurNodeGetMarketsInfo: function(branch, cb) {
      // in this case, this function shouldn't be hit.
    }
  });
  test({
    description: 'Should send params passed to fire, augurNodes unavailable, all args passed as expected',
    branch: '101010',
    offset: 5,
    numMarketsToLoad: 10,
    volumeMin: -1,
    volumeMax: 0,
    callback: function(data) {
      assert.deepEqual(data.params, ['101010', 5, 10, -1, 0]);
      assert.deepEqual(data.to, augur.tx.CompositeGetters.getMarketsInfo.to);
    },
    nodes: [],
    fire: function(tx, callback, parseMarketsInfo, branch) {
      callback(tx);
    },
    augurNodeGetMarketsInfo: function(branch, cb) {
      // in this case, this function shouldn't be hit.
    }
  });
});
