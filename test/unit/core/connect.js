"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var connector = require("ethereumjs-connect");
var Contracts = require('augur-contracts');
var constants = require("../../../src/constants");
var ClearCallCounts = require('../../tools').ClearCallCounts;
var noop = require('../../../src/utilities.js').noop;
var BigNumber = require("bignumber.js");
// 22 tests total

describe('connect.bindContractMethod', function() {
  // 9 tests total
  var fire = augur.fire;
  var transact = augur.transact;
  afterEach(function() {
    augur.fire = fire;
    augur.transact = transact;
  });
  var test = function(t) {
    it(t.description, function() {
        augur.fire = t.fire;
        augur.transact = t.transact;
        t.callMethod(augur.bindContractMethod(t.contract, t.method));
    });
  };
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method required inputs and has no callback. no parser, not fixed, send false',
    contract: 'Cash',
    method: 'balance',
    callMethod: function(method) {
      // ('account', callback)
      method('0xa1', undefined);
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
      	inputs: ['address'],
      	label: 'Balance',
      	method: 'balance',
      	returns: 'unfix',
      	signature: ['int256'],
      	to: augur.tx.Cash.balance.to,
      	params: ['0xa1']
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method required inputs and has callback. no parser, not fixed, send false',
    contract: 'Cash',
    method: 'balance',
    callMethod: function(method) {
      // ('account', callback)
      method('0xa1', noop);
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
      	inputs: ['address'],
      	label: 'Balance',
      	method: 'balance',
      	returns: 'unfix',
      	signature: ['int256'],
      	to: augur.tx.Cash.balance.to,
      	params: ['0xa1']
      });
      assert.isFunction(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method has inputs, without callback. method transaction has a parser, not fixed, send false',
    contract: 'Branches',
    method: 'getEventForkedOver',
    callMethod: function(method) {
      // (branch, cb)
      method('1010101', undefined);
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, { inputs: [ 'branch' ],
        label: 'Get Event Forked Over',
        method: 'getEventForkedOver',
        parser: 'parseMarket',
        returns: 'int256',
        signature: [ 'int256' ],
        to: augur.tx.Branches.getEventForkedOver.to,
        params: [ '1010101' ]
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method has inputs, without callback. method transaction has a parser, not fixed, send false',
    contract: 'Branches',
    method: 'getEventForkedOver',
    callMethod: function(method) {
      // (branch, cb)
      method('1010101', noop);
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, { inputs: [ 'branch' ],
        label: 'Get Event Forked Over',
        method: 'getEventForkedOver',
        parser: 'parseMarket',
        returns: 'int256',
        signature: [ 'int256' ],
        to: augur.tx.Branches.getEventForkedOver.to,
        params: [ '1010101' ]
      });
      assert.isFunction(onSent);
      assert.deepEqual(onSuccess, augur[tx.parser]);
      assert.isUndefined(onFailed);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method has inputs, without callback. method transaction has a parser, fixed, send false',
    contract: 'Tags',
    method: 'increaseTagPopularity',
    callMethod: function(method) {
      // (branch, tag, fxpAmount, cb)
      method('1010101', 'politics', '10000000000000000', undefined);
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx,{
        fixed: [ 2 ],
        inputs: [ 'branch', 'tag', 'fxpAmount' ],
        label: 'Increase Tag Popularity',
        method: 'increaseTagPopularity',
        returns: 'int256',
        signature: [ 'int256', 'int256', 'int256' ],
        to: augur.tx.Tags.increaseTagPopularity.to,
        params: [ '1010101', 'politics', '0x1ed09bead87c0378d8e6400000000' ]
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method has inputs, with callback. method transaction has a parser, fixed, send false. arg as one object',
    contract: 'Tags',
    method: 'increaseTagPopularity',
    callMethod: function(method) {
      // (branch, tag, fxpAmount, cb)
      method({branch: '1010101', tag: 'politics', fxpAmount: '10000000000000000', callback: noop});
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx,{
        fixed: [ 2 ],
        inputs: [ 'branch', 'tag', 'fxpAmount' ],
        label: 'Increase Tag Popularity',
        method: 'increaseTagPopularity',
        returns: 'int256',
        signature: [ 'int256', 'int256', 'int256' ],
        to: augur.tx.Tags.increaseTagPopularity.to,
        params: [ '1010101', 'politics', '0x1ed09bead87c0378d8e6400000000' ]
      });
      assert.deepEqual(onSent, noop);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should handle binding a method and then handling the method correctly when the method required inputs and has no callback. no parser, fixed tx, send true',
    contract: 'Cash',
    method: 'addCash',
    callMethod: function(method) {
      // (ID, amount, callback)
      method('0xa1', '10000000000000000', undefined);
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isTrue(false);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        fixed: [ 1 ],
        inputs: [ 'ID', 'amount' ],
        label: 'Add Cash',
        method: 'addCash',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256' ],
        to: augur.tx.Cash.addCash.to,
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
    callMethod: function(method) {
      // (ID, amount, onSent, onSuccess, onFailed)
      method('0xa1', '10000000000000000', noop, noop, noop);
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isTrue(false);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        fixed: [ 1 ],
        inputs: [ 'ID', 'amount' ],
        label: 'Add Cash',
        method: 'addCash',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256' ],
        to: augur.tx.Cash.addCash.to,
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
    callMethod: function(method) {
      // (ID, amount, callback)
      method({ ID: '0xa1', amount: '10000000000000000', callback: noop});
    },
    fire: function(tx, onSent, onSuccess, onFailed) {
      // Shouldn't get hit in this case
      assert.isTrue(false);
    },
    transact: function(tx, onSent, onSuccess, onFailed) {
      assert.deepEqual(tx, {
        fixed: [ 1 ],
        inputs: [ 'ID', 'amount' ],
        label: 'Add Cash',
        method: 'addCash',
        returns: 'number',
        send: true,
        signature: [ 'int256', 'int256' ],
        to: augur.tx.Cash.addCash.to,
        params: [ '0xa1', '0x1ed09bead87c0378d8e6400000000' ]
      });
      assert.isUndefined(onSent);
      assert.isUndefined(onSuccess);
      assert.isUndefined(onFailed);
    }
  });
});

describe('connect.bindContractAPI', function() {
  // 2 tests total
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

describe('connect.sync', function() {
  // 2 tests total
  var setupFunctionsAPI = connector.setupFunctionsAPI;
  var callCounts = {
    bindContractAPI: 0,
  };
  afterEach(function() {
    ClearCallCounts(callCounts);
    connector.setupFunctionsAPI = setupFunctionsAPI;
    connector.connect({contracts: Contracts, api: Contracts.api, http: null});
  });
  var test = function(t) {
    it(t.description, function() {
      var isolatedSync = require('../../../src/modules/connect.js').sync.bind(t.testThis);

      t.setupConnectorState();

      t.assertions(isolatedSync(), t.testThis);
    });
  };
  test({
    description: 'Should be able to sync when connector state is missing contracts, and networkID prior to call to sync.',
    testThis: {
      bindContractAPI: function() {
        callCounts.bindContractAPI++;
      },
    },
    setupConnectorState: function() {
      connector.state.contracts = undefined;
      connector.state.networkID = undefined;
    },
    assertions: function(out, testThis) {
      assert.isTrue(out);
      assert.isUndefined(testThis.network_id);
      assert.deepEqual(testThis.from, connector.state.from);
      assert.deepEqual(testThis.coinbase, connector.state.coinbase);
      assert.deepEqual(testThis.rpc, connector.rpc);
      assert.deepEqual(testThis.contracts, connector.state.contracts);
      assert.deepEqual(testThis.api, connector.state.api);
      assert.deepEqual(testThis.tx, testThis.api.functions);
      assert.deepEqual(callCounts, {
        bindContractAPI: 1,
      });
    }
  });
  test({
    description: 'Should be able to sync if connector.state.api.functions is undefined forcing this.api to use Contracts.api',
    testThis: {
      bindContractAPI: function() {
        callCounts.bindContractAPI++;
      },
    },
    setupConnectorState: function() {
      // in this case we want to trigger the else statement near the bottom of sync so we set this.api to Contracts.api
      connector.setupFunctionsAPI = function() {
        connector.state.api.functions = undefined;
      };
    },
    assertions: function(out, testThis) {
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
    }
  });
});

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

describe('connect.connect', function() {
  // 7 tests total (4 async, 3 sync)
  var sync = augur.sync;
  var bootstrap = augur.augurNode.bootstrap;
  var connect = connector.connect;
  afterEach(function() {
     augur.sync = sync;
     augur.augurNode.bootstrap = bootstrap;
     connector.connect = connect;
  });
  var test = function(t) {
    // for the one test where rpcinfo is passed as a function the sync test is not required...
    if (t.rpcinfo.constructor !== Function) {
      it(t.description + ' sync', function() {
        augur.sync = t.sync;
        augur.augurNode.bootstrap = t.bootstrap;
        connector.connect = t.connect;

        t.assertions(augur.connect(t.rpcinfo, undefined));
      });
    }
    it(t.description + ' async', function(done) {
      augur.sync = t.sync;
      augur.augurNode.bootstrap = t.bootstrap;
      connector.connect = t.connect;
      // this is in place to call this function different for one test
      if (t.rpcinfo.constructor === Function) {
        augur.connect(function(connection) {
          t.assertions(connection);
          done();
        }, undefined);
      } else {
        // all tests except for the test passing rpcinfo as a function will use this call
        augur.connect(t.rpcinfo, function(connection) {
          t.assertions(connection);
          done();
        });
      }

    });
  };
  test({
    description: 'Should handle a rpcinfo string',
    rpcinfo: 'https://eth3.augur.net',
    sync: function() {
      // don't do anything, just here to be called without using the real sync
    },
    bootstrap: function(options, cb) {
      // because options.augurNodes will never be set with the current way the function is setup this is never called.
    },
    connect: function(options, cb) {
      assert.deepEqual(options, {
        http: 'https://eth3.augur.net',
        contracts: Contracts,
        api: Contracts.api
      });

      if (cb && cb.constructor === Function) {
        cb({
          http: options.http,
          ws: options.ws,
          ipc: options.ipc
        });
      } else {
        return {
          http: options.http,
          ws: options.ws,
          ipc: options.ipc
        };
      }
    },
    assertions: function(connection) {
      assert.deepEqual(connection, {
        http: 'https://eth3.augur.net',
        ws: undefined,
        ipc: undefined
      });
    }
  });
  test({
    description: 'Should handle a rpcinfo as an object',
    rpcinfo: {
      http: 'https://eth3.augur.net',
      ipc: '/path/to/geth.ipc',
      ws: 'wss://ws.augur.net'
    },
    sync: function() {
      // don't do anything, just here to be called without using the real sync
    },
    bootstrap: function(options, cb) {
      // because options.augurNodes will never be set with the current way the function is setup this is never called.
    },
    connect: function(options, cb) {
      assert.deepEqual(options, {
        http: 'https://eth3.augur.net',
        ipc: '/path/to/geth.ipc',
        ws: 'wss://ws.augur.net',
        contracts: Contracts,
        api: Contracts.api
      });

      if (cb && cb.constructor === Function) {
        cb({
          http: options.http,
          ws: options.ws,
          ipc: options.ipc
        });
      } else {
        return {
          http: options.http,
          ws: options.ws,
          ipc: options.ipc
        };
      }
    },
    assertions: function(connection) {
      assert.deepEqual(connection, {
        http: 'https://eth3.augur.net',
        ipc: '/path/to/geth.ipc',
        ws: 'wss://ws.augur.net'
      });
    }
  });
  test({
    description: 'Should handle a rpcinfo as an object with an augurNodes property',
    rpcinfo: {
      http: 'https://eth3.augur.net',
      ipc: '/path/to/geth.ipc',
      ws: 'wss://ws.augur.net',
      augurNodes: ['https://1.augurNode.com', 'https://2.augurNode.com']
    },
    sync: function() {
      // don't do anything, just here to be called without using the real sync
    },
    bootstrap: function(options, cb) {
      assert.deepEqual(options, ['https://1.augurNode.com', 'https://2.augurNode.com']);
      if (cb && cb.constructor === Function) {
        cb();
      }
    },
    connect: function(options, cb) {
      assert.deepEqual(options, {
        http: 'https://eth3.augur.net',
        ipc: '/path/to/geth.ipc',
        ws: 'wss://ws.augur.net',
        augurNodes: ['https://1.augurNode.com', 'https://2.augurNode.com'],
        contracts: Contracts,
        api: Contracts.api
      });

      if (cb && cb.constructor === Function) {
        cb({
          http: options.http,
          ws: options.ws,
          ipc: options.ipc
        });
      } else {
        return {
          http: options.http,
          ws: options.ws,
          ipc: options.ipc
        };
      }
    },
    assertions: function(connection) {
      assert.deepEqual(connection, {
        http: 'https://eth3.augur.net',
        ipc: '/path/to/geth.ipc',
        ws: 'wss://ws.augur.net'
      });
    }
  });
  // this final test is going to async only. It passes rpcinfo as a function which triggers conditionals in our test function. Please take note of this when reading this test.
  test({
    description: 'Should handle a rpcinfo as a function',
    rpcinfo: function() {
      // simple set this to a function, we are going to pass through to assertions anyway and skip the sync tests in this case.
    },
    sync: function() {
      // don't do anything, just here to be called without using the real sync
    },
    bootstrap: function(options, cb) {
      // because options.augurNodes will never be set with the current way the function is setup this is never called.
    },
    connect: function(options, cb) {
      assert.deepEqual(options, {
        http: null,
        contracts: Contracts,
        api: Contracts.api
      });

      if (cb && cb.constructor === Function) {
        cb({
          http: options.http,
          ws: options.ws,
          ipc: options.ipc
        });
      } else {
        return {
          http: options.http,
          ws: options.ws,
          ipc: options.ipc
        };
      }
    },
    assertions: function(connection) {
      assert.deepEqual(connection, {
        http: null,
        ipc: undefined,
        ws: undefined
      });
    }
  });
});
