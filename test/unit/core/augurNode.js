var assert = require("chai").assert;
var augurNode = require('../../../src/augurNode.js')();
var utils = require("../../../src/utilities");

// 12 tests total
describe("augurNode", function() {
  var test = function(t) {
    it(t.description, function() {
      var fetchHelper = augurNode.fetchHelper;
      augurNode.fetchHelper = t.fetchHelper;
			// clear the cache_nodes or set them to t.startState
      augurNode.nodes = t.startState || [];
      t.assertions(augurNode[t.method](t.arg1, t.arg2, t.arg3));
      augurNode.fetchHelper = fetchHelper;
    });
  };

  test({
    description: "bootsrap sets the nodes array correctly",
    assertions: function(out) { assert.deepEqual(out, ['hello', 'world']); },
    method: 'bootstrap',
    arg1: ['hello', 'world'],
    arg2: function() {
			// this is the callback, at this point augurNode.nodes should be set to the value of arg1. We are going to simply pass this value to assertions to be checked.
      return augurNode.nodes;
 		}
  });

  test({
    description: "bootsrap handles an empty array",
    assertions: function(out) { assert.deepEqual(out, []); },
    method: 'bootstrap',
    arg1: [],
    arg2: function() {
			// this is the callback, at this point augurNode.nodes should be set to the value of arg1. We are going to simply pass this value to assertions to be checked.
      return augurNode.nodes;
 		}
  });

  test({
    description: "bootsrap handles an null input",
    assertions: function(out) { assert.deepEqual(out, []); },
    method: 'bootstrap',
    arg1: null,
    arg2: function() {
			// this is the callback, at this point augurNode.nodes should be set to the value of arg1. We are going to simply pass this value to assertions to be checked.
      return augurNode.nodes;
 		}
  });

  test({
    description: "bootsrap handles an undefined input",
    assertions: function(out) { assert.deepEqual(out, []); },
    method: 'bootstrap',
    arg1: undefined,
    arg2: function() {
			// this is the callback, at this point augurNode.nodes should be set to the value of arg1. We are going to simply pass this value to assertions to be checked.
      return augurNode.nodes;
 		}
  });

  test({
    description: "buildRequest should create a valid URL given 1 cache_node.",
    assertions: function(out) {
      assert.deepEqual(out, 'https://OnlyOne.node/getSomeData?marketID=myMarketID1');
    },
    method: 'buildRequest',
    startState: ['https://OnlyOne.node'],
    fetchHelper: function(url, cb) {
			// just return the URL for assertions
      cb(url);
    },
    arg1: 'getSomeData',
    arg2: { marketID: 'myMarketID1'}
  });

  test({
    description: "buildRequest should create a valid URL given multiple cache_nodes.",
    assertions: function(out) {
			// make sure the domain matches one of the possible "cache_nodes" ... in this case "hello" or "world". This is done because the cache_nodes are chosen randomly every call so we need to test for either "hello" or "world" in this case.
      assert.match(out.substring(0, 5), /hello|world/);
			// check that the rest of the URL was created correctly as expected;
      assert.include(out, '/getSomeData?test=0,1,2,3&augur=numberOne&branch=010101');
    },
    method: 'buildRequest',
    startState: ['hello', 'world'],
    fetchHelper: function(url, cb) {
			// just return the URL for assertions
      cb(url);
    },
    arg1: 'getSomeData',
    arg2: { test: [0, 1, 2, 3], augur: 'numberOne', branch: '010101'}
  });

  test({
    description: "buildRequest should return null if there are no cache_nodes",
    assertions: function(out) {
      assert.deepEqual(out, null);
    },
    method: 'buildRequest',
    fetchHelper: function(url, cb) {
			// just return the URL for assertions
      cb(url);
    },
    arg1: 'getSomeData',
    arg2: { test: [0, 1, 2, 3], augur: 'numberOne'}
  });

  test({
    description: "getMarketInfo url created correctly",
    assertions: function(out) {
      assert.match(out.substring(0, 5), /hello|world/);
      assert.include(out, '/getMarketInfo?id=myMarketID123');
    },
    method: 'getMarketInfo',
    startState: ['hello', 'world'],
    fetchHelper: function(url, cb) {
			// just return the URL for assertions
      return url;
    },
    arg1: 'myMarketID123',
    arg2: utils.noop
  });

  test({
    description: "getMarketsInfo url created correctly",
    assertions: function(out) {
      assert.match(out.substring(0, 5), /hello|world/);
      assert.include(out, '/getMarketsInfo?branch=010101');
    },
    method: 'getMarketsInfo',
    startState: ['hello', 'world'],
    fetchHelper: function(url, cb) {
			// just return the URL for assertions
      return url;
    },
    arg1: '010101',
    arg2: utils.noop
  });

  test({
    description: "batchGetMarketInfo url created correctly",
    assertions: function(out) {
      assert.match(out.substring(0, 5), /hello|world/);
      assert.include(out, '/batchGetMarketInfo?ids=myMarketID1,myMarketID2,myMarketID3');
    },
    method: 'batchGetMarketInfo',
    fetchHelper: function(url, cb) {
			// just return the URL for assertions
      return url;
    },
    startState: ['hello', 'world'],
    arg1: ['myMarketID1', 'myMarketID2', 'myMarketID3'],
    arg2: utils.noop
  });

  test({
    description: "getMarketPriceHistory url created correctly",
    assertions: function(out) {
      assert.match(out.substring(0, 5), /hello|world/);
      assert.include(out, '/getMarketPriceHistory?someOption=test&branch=010101&id=someMarketID');
    },
    method: 'getMarketPriceHistory',
    fetchHelper: function(url, cb) {
			// just return the URL for assertions
      return url;
    },
    startState: ['hello', 'world'],
    arg1: { someOption: 'test', branch: '010101', id: 'someMarketID' },
    arg2: utils.noop
  });

  test({
    description: "getAccountTrades url created correctly",
    assertions: function(out) {
      assert.match(out.substring(0, 5), /hello|world/);
      assert.include(out, '/getAccountTrades?anotherOption=test&branch=010101&id=someMarketID1');
    },
    method: 'getAccountTrades',
    fetchHelper: function(url, cb) {
			// just return the URL for assertions
      return url;
    },
    startState: ['hello', 'world'],
    arg1: { anotherOption: 'test', branch: '010101', id: 'someMarketID1' },
    arg2: utils.noop
  });
});
