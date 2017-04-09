"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var Contracts = require('augur-contracts');
var augur = new (require("../../../src"))();
var constants = require("../../../src/constants");
var clearCallCounts = require("../../tools").clearCallCounts;
var noop = require("../../../src/utils/noop");
var proxyquire = require("proxyquire").noCallThru().noPreserveCache();
// 27 tests total

describe('connect.bindContractMethod', function () {
  // 11 tests total
  var fire = augur.fire;
  var transact = augur.transact;
  afterEach(function () {
    augur.fire = fire;
    augur.transact = transact;
  });
  var test = function (t) {
    it(t.description, function () {
        augur.fire = t.fire;
        augur.transact = t.transact;
        t.callMethod(augur.bindContractMethod(t.contract, t.method));
    });
  };
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method required inputs and has no callback. no parser, not fixed, send false',
    contract: 'Cash',
    method: 'balance',
    callMethod: function (method) {
      // (address, callback)
      method('0xa1', undefined);
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
      	inputs: ['address'],
      	label: 'Balance',
      	method: 'balance',
      	returns: 'unfix',
      	signature: ['int256'],
      	to: augur.api.functions.Cash.balance.to,
      	params: ['0xa1']
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method required inputs and has callback. no parser, not fixed, send false',
    contract: 'Cash',
    method: 'balance',
    callMethod: function (method) {
      // (address, callback)
      method('0xa1', noop);
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
      	inputs: ['address'],
      	label: 'Balance',
      	method: 'balance',
      	returns: 'unfix',
      	signature: ['int256'],
      	to: augur.api.functions.Cash.balance.to,
      	params: ['0xa1']
      });
      assert.isFunction(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method has inputs, without callback. method transaction has a parser, not fixed, send false',
    contract: 'Branches',
    method: 'getEventForkedOver',
    callMethod: function (method) {
      // (branch, cb)
      method('1010101', undefined);
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, { inputs: [ 'branch' ],
        label: 'Get Event Forked Over',
        method: 'getEventForkedOver',
        parser: 'parseMarket',
        returns: 'int256',
        signature: [ 'int256' ],
        to: augur.api.functions.Branches.getEventForkedOver.to,
        params: [ '1010101' ]
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method has inputs, with callback. method transaction has a parser, not fixed, send false',
    contract: 'Branches',
    method: 'getEventForkedOver',
    callMethod: function (method) {
      // (branch, cb)
      method('1010101', noop);
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, { inputs: [ 'branch' ],
        label: 'Get Event Forked Over',
        method: 'getEventForkedOver',
        parser: 'parseMarket',
        returns: 'int256',
        signature: [ 'int256' ],
        to: augur.api.functions.Branches.getEventForkedOver.to,
        params: [ '1010101' ]
      });
      assert.isFunction(onSent);
      assert.deepEqual(onSuccess, augur[tx.parser]);
      assert.isUndefined(onFailed);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method has inputs, without callback. method transaction without a parser, fixed, send false',
    contract: 'Topics',
    method: 'updateTopicPopularity',
    callMethod: function (method) {
      // (branch, topic, fxpAmount, cb)
      method('1010101', 'politics', '10000000000000000', undefined);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx,{
        fixed: [ 2 ],
        inputs: [ 'branch', 'topic', 'fxpAmount' ],
        label: 'Update Topic Popularity',
        method: 'updateTopicPopularity',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256', 'int256' ],
        to: augur.api.functions.Topics.updateTopicPopularity.to,
        params: [ '1010101', 'politics', '0x1ed09bead87c0378d8e6400000000' ]
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    fire: function (tx, callback) {
      // Shouldn't get hit in this case
      assert.isTrue(false);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method has inputs, with callback. method transaction without a parser, fixed, send false. arg as one object',
    contract: 'Topics',
    method: 'updateTopicPopularity',
    callMethod: function (method) {
      // (branch, topic, fxpAmount, cb)
      method({branch: '1010101', topic: 'politics', fxpAmount: '10000000000000000', callback: noop});
    },
    fire: function (tx, callback) {
      assert.isFalse(true);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx,{
        fixed: [ 2 ],
        inputs: [ 'branch', 'topic', 'fxpAmount' ],
        label: 'Update Topic Popularity',
        method: 'updateTopicPopularity',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256', 'int256' ],
        to: augur.api.functions.Topics.updateTopicPopularity.to,
        params: [ '1010101', 'politics', '0x1ed09bead87c0378d8e6400000000' ]
      });
    },
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method required inputs and has no callback. no parser, fixed tx, send true',
    contract: 'Cash',
    method: 'addCash',
    callMethod: function (method) {
      // (ID, amount, callback)
      method('0xa1', '10000000000000000', undefined);
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isTrue(false);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        fixed: [ 1 ],
        inputs: [ 'ID', 'amount' ],
        label: 'Add Cash',
        method: 'addCash',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256' ],
        to: augur.api.functions.Cash.addCash.to,
        params: [ '0xa1', '0x1ed09bead87c0378d8e6400000000' ]
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method required inputs and has all callbacks. no parser, fixed tx, send true',
    contract: 'Cash',
    method: 'addCash',
    callMethod: function (method) {
      // (ID, amount, onSent, onSuccess, onFailed)
      method('0xa1', '10000000000000000', noop, noop, noop);
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isTrue(false);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        fixed: [ 1 ],
        inputs: [ 'ID', 'amount' ],
        label: 'Add Cash',
        method: 'addCash',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256' ],
        to: augur.api.functions.Cash.addCash.to,
        params: [ '0xa1', '0x1ed09bead87c0378d8e6400000000' ]
      });
      assert.deepEqual(onSent, noop);
      assert.deepEqual(onSuccess, noop);
      assert.deepEqual(onFailed, noop);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method required inputs and has callback. no parser, fixed tx, send true, single object arg',
    contract: 'Cash',
    method: 'addCash',
    callMethod: function (method) {
      // (ID, amount, callback)
      method({ ID: '0xa1', amount: '10000000000000000', callback: noop});
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isTrue(false);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        fixed: [ 1 ],
        inputs: [ 'ID', 'amount' ],
        label: 'Add Cash',
        method: 'addCash',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256' ],
        to: augur.api.functions.Cash.addCash.to,
        params: [ '0xa1', '0x1ed09bead87c0378d8e6400000000' ]
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method passed no args and is a method where send is true',
    contract: 'Cash',
    method: 'addCash',
    callMethod: function (method) {
      // (ID, amount, callback)
      method();
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        fixed: [ 1 ],
        inputs: [ 'ID', 'amount' ],
        label: 'Add Cash',
        method: 'addCash',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256' ],
        to: augur.api.functions.Cash.addCash.to
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method passed no args and is a method where send is false',
    contract: 'Cash',
    method: 'balance',
    callMethod: function (method) {
      // (account, callback)
      method();
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        inputs: [ 'address' ],
        label: 'Balance',
        method: 'balance',
        returns: 'unfix',
        signature: [ 'int256' ],
        to: augur.api.functions.Cash.balance.to
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly send is false, args are present, not fixed, no parser',
    contract: 'MakeReports',
    method: 'makeHash',
    callMethod: function (method) {
      // (account, callback)
      method({ salt: '1337', report: '1', eventID: '0xe1', sender: '0xf1', callback: noop });
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        inputs: [ 'salt', 'report', 'eventID', 'sender' ],
        label: 'Make Hash',
        method: 'makeHash',
        params: [ '1337', '1', '0xe1', '0xf1' ],
        returns: 'hash',
        signature: [ 'int256', 'int256', 'int256', 'int256' ],
        to: augur.api.functions.MakeReports.makeHash.to
      });
      assert.isFunction(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly send is false, args are present, fixed, no parser',
    contract: 'MakeReports',
    method: 'validateReport',
    callMethod: function (method) {
      // (account, callback)
      method({ eventID: '0xe1', branch: '0xb1', votePeriod: '1000', report: '1', forkedOverEthicality: '0', forkedOverThisEvent: '0', roundTwo: '1001', balance: '1000', callback: noop });
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        fixed: [ 3, 7 ],
        inputs: [ 'eventID', 'branch', 'votePeriod', 'report', 'forkedOverEthicality', 'forkedOverThisEvent', 'roundTwo', 'balance' ],
        label: 'Validate Report',
        method: 'validateReport',
        params: [ '0xe1', '0xb1', '1000', '0xde0b6b3a7640000', '0', '0', '1001', '0x3635c9adc5dea00000' ],
        returns: 'number',
        signature: [ 'int256', 'int256', 'int256', 'int256', 'int256', 'int256', 'int256', 'int256' ],
        to: augur.api.functions.MakeReports.validateReport.to
      });
      assert.isFunction(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly send is true, parser',
    contract: 'FakeContract',
    method: 'fakeMethod',
    callMethod: function (method) {
      // because no functions currently exist where send is true and we require a parser, we are going to make a fake function to do this so we can unit test.
      augur.api.functions.FakeContract = {
        fakeMethod: {
          inputs: [ 'branch' ],
          label: 'Fake Method',
          method: 'fakeMethod',
          parser: 'parseFakeStuff',
          returns: 'number',
          send: true,
          signature: [ 'int256' ],
          to: '0xdeadbeef'
        }
      };
      method({ branch: '0xb1', callback: noop });
      augur.api.functions.fakeContract = undefined;
    },
    fire: function (tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    },
    transact: function (tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        inputs: [ 'branch' ],
        label: 'Fake Method',
        method: 'fakeMethod',
        params: [ '0xb1' ],
        parser: 'parseFakeStuff',
        returns: 'number',
        send: true,
        signature: [ 'int256' ],
        to: '0xdeadbeef'
      });
      assert.isUndefined(onSent);
      assert.isNull(onSuccess);
      assert.isUndefined(onFailed);
    }
  });
});

describe('connect.bindContractAPI', function () {
  // 2 tests total
  var callCounts = {
    bindContractMethod: 0
  };
  afterEach(function () {
    clearCallCounts(callCounts);
  });
  var test = function (t) {
    it(t.description, function (done) {
      // These tests will be slightly different then the usual format. This is designed to isolate only the bindContractAPI method so we don't start messing with augur.js object as a whole and then have to clean it up.
      var isolatedBindContractAPI = proxyquire('../../../src/modules/connect.js', {}).bindContractAPI.bind(t.testThis);
      t.assertions(isolatedBindContractAPI(t.methods), done);
    });
  };
  test({
    description: 'For each of the methods passed in, bindContractMethod should be called and we should return the methods bound.',
    testThis: {
      api: { functions: {} },
      bindContractMethod: function (contract, method) {
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
    assertions: function (methods, done) {
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
      done();
    }
  });
  test({
    description: 'If no args are passed then it should use this.api.functions instead. bindContractMethod should be called for each function and we should return the methods bound.',
    testThis: {
  		api: {
  			functions: {
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
  				}
  			}
  		},
      bindContractMethod: function (contract, method) {
        callCounts.bindContractMethod++;
        assert.oneOf(contract, ['testFunctionGroup1']);
        assert.oneOf(method, ['testFunction1', 'testFunction2']);
      }
    },
    methods: undefined,
    assertions: function (methods, done) {
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
      done();
    }
  });
});

describe('connect.sync', function () {
  // 3 tests total
  var callCounts = {
    bindContractAPI: 0,
  };
  afterEach(function () {
    clearCallCounts(callCounts);
  });
  var test = function (t) {
    it(t.description, function (done) {
      // bind connect to t.testThis instead of augur, replace ethereumjs-connect with a test mock.
      var isolatedSync = proxyquire('../../../src/modules/connect.js', {
        'ethereumjs-connect': t.connector,
      }).sync.bind(t.testThis);

      t.assertions(isolatedSync(), t.testThis, t.connector, done);
    });
  };
  test({
    description: 'Should be able to sync when connector state is missing contracts, and networkID prior to call to sync.',
    testThis: {
      bindContractAPI: function () {
        callCounts.bindContractAPI++;
      },
    },
    connector: {
      isTest: true,
      state: {
      	contracts: {},
      	networkID: null,
      	api: { functions: {} },
      	coinbase: '0x444',
      	from: '0x1'
      },
      configure: noop,
      setContracts: noop,
      setupFunctionsAPI: noop,
      setupEventsAPI: noop,
      rpc: { desc: 'this is the ethrpc object' }
    },
    assertions: function (out, testThis, connector, done) {
      assert.isTrue(out);
      assert.isNull(testThis.network_id);
      assert.deepEqual(testThis.from, connector.state.from);
      assert.deepEqual(testThis.coinbase, connector.state.coinbase);
      assert.deepEqual(testThis.rpc, connector.rpc);
      assert.deepEqual(testThis.contracts, connector.state.contracts);
      assert.deepEqual(testThis.api, connector.state.api);
      assert.deepEqual(testThis.tx, testThis.api.functions);
      assert.deepEqual(callCounts, {
        bindContractAPI: 1,
      });
      done();
    }
  });
  test({
    description: 'Should be able to sync if connector.state.api.functions is undefined forcing this.api to use Contracts.api',
    testThis: {
      bindContractAPI: function () {
        callCounts.bindContractAPI++;
      },
    },
    connector: {
      isTest: true,
      state: {
      	contracts: {},
      	networkID: constants.DEFAULT_NETWORK_ID,
      	api: {},
      	coinbase: '0x444',
      	from: '0x1'
      },
      configure: noop,
      setContracts: noop,
      rpc: { desc: 'this is the ethrpc object' },
      setupFunctionsAPI: noop,
      setupEventsAPI: noop
    },
    assertions: function (out, testThis, connector, done) {
      assert.isTrue(out);
      assert.deepEqual(testThis.network_id, connector.state.networkID);
      assert.deepEqual(testThis.from, connector.state.from);
      assert.deepEqual(testThis.coinbase, connector.state.coinbase);
      assert.deepEqual(testThis.rpc, connector.rpc);
      assert.deepEqual(testThis.contracts, connector.state.contracts);
      assert.deepEqual(testThis.api, Contracts.api);
      assert.deepEqual(testThis.tx, testThis.api.functions);
      assert.deepEqual(callCounts, {
        bindContractAPI: 1,
      });
      done();
    }
  });
  test({
    description: 'Should return false if connector isnt an Object',
    testThis: {
      bindContractAPI: function () {
        callCounts.bindContractAPI++;
      },
    },
    connector: [],
    assertions: function (out, testThis, connector, done) {
      assert.isFalse(out);
      assert.deepEqual(callCounts, {
        bindContractAPI: 0,
      });
      done();
    }
  });
});

describe('connect.useAccount', function () {
  // 1 test total
  var connector;
  var callCounts = {
  	setFrom: 0,
  	sync: 0
  };
  var test = function (t) {
  	it(t.description, function () {
      var connect = proxyquire('../../../src/modules/connect.js', {
        'ethereumjs-connect': t.connector
      });
      connector = t.connector;
  		connect.useAccount.call(t.testThis, t.account);
  	});
  };
  test({
  	description: 'Should set connector.from to the account passed, should call setFrom and sync.',
  	account: '0xabc123',
    testThis: {
      sync: function () {
    		callCounts.sync++;
    		assert.equal(connector.from, '0xabc123');
    		assert.deepEqual(callCounts, {
    			setFrom: 1,
    			sync: 1
    		});
    	}
    },
    connector: {
      from: '0x0',
      setFrom: function (account) {
    		callCounts.setFrom++;
    		assert.equal(account, '0xabc123');
        connector.from = account;
    	}
    }
  });
});

describe('connect.connect', function () {
  // 9 tests total (5 async, 4 sync)
  var test = function (t) {
    // for the one test where rpcinfo is passed as a function the sync test is not required...
    if (t.rpcinfo.constructor !== Function) {
      it(t.description + ' sync', function () {
        var connect = proxyquire('../../../src/modules/connect', {
          'ethereumjs-connect': t.connector
        });

        t.assertions(connect.connect.call(t.testThis, t.rpcinfo, undefined));
      });
    }
    it(t.description + ' async', function (done) {
      var connect = proxyquire('../../../src/modules/connect', {
        'ethereumjs-connect': t.connector
      });
      // this is in place to call this function different for one test
      if (t.rpcinfo.constructor === Function) {
        connect.connect.call(t.testThis, function (connection) {
          t.assertions(connection);
          done();
        }, undefined);
      } else {
        // all tests except for the test passing rpcinfo as a function will use this call
        connect.connect.call(t.testThis, t.rpcinfo, function (connection) {
          t.assertions(connection);
          done();
        });
      }

    });
  };
  test({
    description: 'Should handle a missing rpcinfo',
    rpcinfo: [],
    testThis: {
      sync: noop
    },
    connector: {
      connect: function (options, cb) {
        assert.deepEqual(options, {
          httpAddresses: [],
          wsAddresses: [],
          ipcAddresses: [],
          contracts: Contracts,
          api: Contracts.api
        });

        if (cb && cb.constructor === Function) {
          cb(true);
        } else {
          return true;
        }
      },
      rpc: { unsubscribe: function (_, callback) { setImmediate(function () { callback({ error: -32601, message: "Method not found"}) }); } }
    },
    assertions: function (connection) {
      assert.isTrue(connection);
    }
  });
  test({
    description: 'Should handle a rpcinfo string',
    rpcinfo: 'https://eth3.augur.net',
    testThis: {
      sync: noop
    },
    connector: {
      connect: function (options, cb) {
        assert.deepEqual(options, {
          httpAddresses: ['https://eth3.augur.net'],
          wsAddresses: [],
          ipcAddresses: [],
          contracts: Contracts,
          api: Contracts.api
        });

        if (cb && cb.constructor === Function) {
          cb(true);
        } else {
          return true;
        }
      },
      rpc: { unsubscribe: function (_, callback) { setImmediate(function () { callback({ error: -32601, message: "Method not found"}) }); } }
    },
    assertions: function (connection) {
      assert.isTrue(connection);
    }
  });
  test({
    description: 'Should handle a rpcinfo as an object',
    rpcinfo: {
      http: 'https://eth3.augur.net',
      ipc: '/path/to/geth.ipc',
      ws: 'wss://ws.augur.net'
    },
    testThis: {
      sync: noop,
    },
    connector: {
      connect: function (options, cb) {
        assert.deepEqual(options, {
          httpAddresses: ['https://eth3.augur.net'],
          ipcAddresses: ['/path/to/geth.ipc'],
          wsAddresses: ['wss://ws.augur.net'],
          contracts: Contracts,
          api: Contracts.api
        });

        if (cb && cb.constructor === Function) {
          cb(true);
        } else {
          return true;
        }
      },
      rpc: { unsubscribe: function (_, callback) { setImmediate(function () { callback({ error: -32601, message: "Method not found"}) }); } }
    },
    assertions: function (connection) {
      assert.isTrue(connection);
    }
  });
  // this final test is going to async only. It passes rpcinfo as a function which triggers conditionals in our test function. Please take note of this when reading this test.
  test({
    description: 'Should handle a rpcinfo as a function',
    rpcinfo: function () {
      // simple set this to a function, we are going to pass through to assertions anyway and skip the sync tests in this case.
    },
    testThis: {
      sync: noop
    },
    connector: {
      connect: function (options, cb) {
        assert.deepEqual(options, {
          httpAddresses: [],
          wsAddresses: [],
          ipcAddresses: [],
          contracts: Contracts,
          api: Contracts.api
        });

        if (cb && cb.constructor === Function) {
          cb(true);
        } else {
          return true;
        }
      },
      rpc: { unsubscribe: function (_, callback) { setImmediate(function () { callback({ error: -32601, message: "Method not found"}) }); } }
    },
    assertions: function (connection) {
      assert.isTrue(connection);
    }
  });
});
