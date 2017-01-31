"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var connector = require("ethereumjs-connect");
var contracts = require('augur-contracts');
var ClearCallCounts = require('../../tools').ClearCallCounts;

describe('connect.bindContractMethod', function() {});

describe('connect.bindContractAPI', function() {
  // ? tests total
  var callCounts = {
    bindContractMethod: 0
  };
  afterEach(function() {
    ClearCallCounts(callCounts);
  });
  var test = function(t) {
    it(t.description, function() {
      // These tests will be slightly different then the usual format. This is designed to isolate only the bindContractAPI method so we don't start messing with augur.js object as a whole and then have to clean it up.
      var isolatedBindContractAPI = require('../../../src/modules/connect.js').bindContractAPI.bind(t.testThis);
      t.assertions(isolatedBindContractAPI(t.methods));
    });
  };
  test({
    description: 'For each of the methods passed in, bindContractMethod should be called and we should return the methods bound.',
    testThis: {
      api: { functions: {} },
      bindContractMethod: function(contract, method) {
        callCounts.bindContractMethod++;
        assert.oneOf(contract, ['testFunctionGroup1', 'testFunctionGroup2']);
        assert.oneOf(method, ['testFunction1', 'testFunction2', 'testFunction3', 'testFunction4']);
      }
    },
    methods: {
    	testFunctionGroup1: {
        testFunction1: {
          inputs: [
            'event',
            'amount'
          ],
          label: 'test function one',
          method: "testFunction1",
          returns: 'int256',
          signature: [
            'int256',
            'int256'
          ]
        },
        testFunction2: {
          inputs: [
            'market',
            'event'
          ],
          label: 'test function two',
          method: "testFunction2",
          returns: 'int256',
          signature: [
            'int256',
            'int256'
          ]
        },
    	},
      testFunctionGroup2: {
        testFunction3: {
          inputs: [
            'event',
            'amount'
          ],
          label: 'test function three',
          method: "testFunction3",
          returns: 'int256',
          signature: [
            'int256',
            'int256'
          ]
        },
        testFunction4: {
          inputs: [
            'market',
            'event'
          ],
          label: 'test function four',
          method: "testFunction4",
          returns: 'int256',
          signature: [
            'int256',
            'int256'
          ]
        },
    	}
    },
    assertions: function(methods) {
      assert.deepEqual(methods, {
      	testFunctionGroup1: {
      		testFunction1: {
      			inputs: ['event', 'amount'],
      			label: 'test function one',
      			method: 'testFunction1',
      			returns: 'int256',
      			signature: ['int256', 'int256']
      		},
      		testFunction2: {
      			inputs: ['market', 'event'],
      			label: 'test function two',
      			method: 'testFunction2',
      			returns: 'int256',
      			signature: ['int256', 'int256']
      		}
      	},
      	testFunctionGroup2: {
      		testFunction3: {
      			inputs: ['event', 'amount'],
      			label: 'test function three',
      			method: 'testFunction3',
      			returns: 'int256',
      			signature: ['int256', 'int256']
      		},
      		testFunction4: {
      			inputs: ['market', 'event'],
      			label: 'test function four',
      			method: 'testFunction4',
      			returns: 'int256',
      			signature: ['int256', 'int256']
      		}
      	}
      });
      assert.deepEqual(callCounts, {
        bindContractMethod: 4
      });
    }
  });
  test({
    description: 'If no args are passed then it should use this.api.functions instead. bindContractMethod should be called for each function and we should return the methods bound.',
    testThis: {
      api: { functions: {testFunctionGroup1: {
        testFunction1: {
          inputs: [
            'event',
            'amount'
          ],
          label: 'test function one',
          method: "testFunction1",
          returns: 'int256',
          signature: [
            'int256',
            'int256'
          ]
        },
        testFunction2: {
          inputs: [
            'market',
            'event'
          ],
          label: 'test function two',
          method: "testFunction2",
          returns: 'int256',
          signature: [
            'int256',
            'int256'
          ]
        },
    	}} },
      bindContractMethod: function(contract, method) {
        callCounts.bindContractMethod++;
        assert.oneOf(contract, ['testFunctionGroup1']);
        assert.oneOf(method, ['testFunction1', 'testFunction2']);
      }
    },
    methods: undefined,
    assertions: function(methods) {
      assert.deepEqual(methods, {
      	testFunctionGroup1: {
      		testFunction1: {
      			inputs: ['event', 'amount'],
      			label: 'test function one',
      			method: 'testFunction1',
      			returns: 'int256',
      			signature: ['int256', 'int256']
      		},
      		testFunction2: {
      			inputs: ['market', 'event'],
      			label: 'test function two',
      			method: 'testFunction2',
      			returns: 'int256',
      			signature: ['int256', 'int256']
      		}
      	}
      });
      assert.deepEqual(callCounts, {
        bindContractMethod: 2
      });
    }
  });
});

describe('connect.sync', function() {});

describe('connect.useAccount', function() {
  // 1 test total
  var sync = augur.sync;
  var setFrom = connector.setFrom;
  var callCounts = {
  	setFrom: 0,
  	sync: 0
  };
  afterEach(function() {
  	ClearCallCounts(callCounts);
  	augur.sync = sync;
  	connector.setFrom = setFrom;
  });
  var test = function(t) {
  	it(t.description, function() {
  		augur.sync = t.assertions;
  		connector.setFrom = t.setFrom;

  		augur.useAccount(t.account);
  	});
  };
  test({
  	description: 'Should set connector.from to the account passed, should call setFrom and sync.',
  	account: '0xabc123',
  	setFrom: function(account) {
  		callCounts.setFrom++;
  		assert.equal(account, '0xabc123');
  	},
  	assertions: function() {
  		callCounts.sync++;
  		assert.equal(connector.from, '0xabc123');
  		assert.deepEqual(callCounts, {
  			setFrom: 1,
  			sync: 1
  		});
  	}
  });
});

describe('connect.connect', function() {});
