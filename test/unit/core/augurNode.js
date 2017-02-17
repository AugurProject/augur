var assert = require("chai").assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var mockRequest = {
  defaults: function() {
  // when request is required into a file it calls it's default function
  return function(url, cb) {
    // this function is returned as 'request' this is a generic mock and we do nothing as this will be used for tests that don't need fetchHelper.
  };
}};
var utils = require("../../../src/utilities");

// 13 tests total
describe("augurNode", function() {
  var augurNode;
  var test = function(t) {
    it(t.description, function() {
      var request = t.mockRequest || mockRequest;
      augurNode = proxyquire('../../../src/augurNode.js', {
        'request': request
      })();
      var fetchHelper = augurNode.fetchHelper;
      augurNode.fetchHelper = t.fetchHelper || fetchHelper;
      // clear the cache_nodes or set them to t.startState
      augurNode.nodes = t.startState || [];

      t.assertions(augurNode[t.method](t.arg1, t.arg2, t.arg3));
    });
  };
  /*            *
  *   bootstrap *
  *             */
  test({
    description: "bootstrap sets the nodes array correctly",
    assertions: function(out) { assert.deepEqual(out, ['hello', 'world']); },
    method: 'bootstrap',
    arg1: ['hello', 'world'],
    arg2: function() {
			// this is the callback, at this point augurNode.nodes should be set to the value of arg1. We are going to simply pass this value to assertions to be checked.
      return augurNode.nodes;
 		}
  });
  test({
    description: "bootstrap handles an empty array",
    assertions: function(out) { assert.deepEqual(out, []); },
    method: 'bootstrap',
    arg1: [],
    arg2: function() {
			// this is the callback, at this point augurNode.nodes should be set to the value of arg1. We are going to simply pass this value to assertions to be checked.
      return augurNode.nodes;
 		}
  });
  test({
    description: "bootstrap handles an null input",
    assertions: function(out) { assert.deepEqual(out, []); },
    method: 'bootstrap',
    arg1: null,
    arg2: function() {
			// this is the callback, at this point augurNode.nodes should be set to the value of arg1. We are going to simply pass this value to assertions to be checked.
      return augurNode.nodes;
 		}
  });
  test({
    description: "bootstrap handles an undefined input",
    assertions: function(out) { assert.deepEqual(out, []); },
    method: 'bootstrap',
    arg1: undefined,
    arg2: function() {
			// this is the callback, at this point augurNode.nodes should be set to the value of arg1. We are going to simply pass this value to assertions to be checked.
      return augurNode.nodes;
 		}
  });
  test({
    description: "bootstrap handles an undefined callback, this should make the callback noop which means our assertion should get called with no argument.",
    assertions: function(out) {
      // confirm that cb was noop so there is no output from the cb function being called...
      assert.isUndefined(out);
    },
    method: 'bootstrap',
    arg1: ['hello', 'world'],
    arg2: undefined
  });
  /*                *
  *   buildRequest  *
  *                 */
  test({
    description: "buildRequest should create a valid URL given 1 cache_node, 1 param.",
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
    description: "buildRequest should create a valid URL given multiple cache_nodes, and multiple params",
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
  /*                *
  *   fetchHelper   *
  *                 */
  test({
    description: 'fetchHelper should return an error if url passed is undefined',
    method: 'fetchHelper',
    arg1: undefined,
    arg2: function(err, body) {
      return { err: err, body: body };
    },
    assertions: function(out) {
      assert.deepEqual(out.err, 'no nodes to fetch from');
      assert.isUndefined(out.body);
    }
  });
  test({
    description: 'fetchHelper should handle a successful request and return the body to cb',
    method: 'fetchHelper',
    arg1: 'www.augur.net',
    arg2: function(err, body) {
      assert.isNull(err);
      assert.deepEqual(body, 'testBody');
    },
    mockRequest: {
    	defaults: function() {
    		return function(url, cb) {
    			assert.deepEqual(url, 'www.augur.net');
    			cb(null, {
    				statusCode: 200
    			}, 'testBody');
    		}
    	}
    },
    assertions: function(out) {
      // these assertions are handled in the arg2 function
      assert.isUndefined(out);
    }
  });
  test({
    description: 'fetchHelper should handle a error from request',
    method: 'fetchHelper',
    arg1: 'www.augur.net',
    arg2: function(err, body) {
      assert.deepEqual(err, 'www.augur.net could not be found.');
      assert.isUndefined(body);
    },
    mockRequest: {
    	defaults: function() {
    		return function(url, cb) {
    			assert.deepEqual(url, 'www.augur.net');
    			cb('could not be found.', {
    				statusCode: 404
    			});
    		}
    	}
    },
    assertions: function(out) {
      // these assertions are handled in the arg2 function
      assert.isUndefined(out);
    }
  });
  /*                *
  *   getMarketInfo *
  *                 */
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
  /*                  *
  *   getMarketInfos  *
  *                   */
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
  /*                      *
  *   batchGetMarketInfo  *
  *                       */
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
  /*                        *
  *   getMarketPriceHistory *
  *                         */
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
  /*                    *
  *   getAccountTrades  *
  *                     */
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
