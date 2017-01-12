"use strict";

var assert = require("chai").assert;
var async = require("async");
var abi = require("augur-abi");
var clone = require("clone");
var contracts = require("augur-contracts");
var random = require("./random");
var tools = require("./tools");
var utils = require("../src/utilities");
var augur = require("../src");
augur.api = new contracts.Tx(process.env.ETHEREUM_NETWORK_ID || "2");
augur.tx = augur.api.functions;
augur.bindContractAPI();

var noop = function () {};

var test = {
  eth_call: function (t, next) {
    next = next || noop;
    var i, expected = clone(augur.tx[t.contract][t.method]);
    if (t.params && t.params.length === 1) {
      expected.params = t.params[0];
    } else {
      expected.params = clone(t.params);
    }
    var fire = augur.fire;
    augur.fire = function (tx, callback) {
      if (tx.timeout) delete tx.timeout;
      if (tx.params === null || tx.params === undefined) tx.params = [];
      if (tx.params && tx.params.constructor === Array &&
                tx.params.length === 1) {
        tx.params = tx.params[0];
      }
      it(JSON.stringify(t.params), function () {
        assert.deepEqual(tx, expected);
      });
      augur.fire = fire;
      next();
    };
    var params = (t.callback) ? t.params.concat(t.callback) : t.params;
    augur[t.contract][t.method].apply(augur, params);
  },
  eth_sendTransaction: {
    object: function (t, next) {
      next = next || noop;
      var i, expected = clone(augur.tx[t.contract][t.method]);
      if (t.params && t.params.length === 1) {
        expected.params = t.params[0];
      } else {
        expected.params = clone(t.params);
      }
      var transact = augur.transact;
      augur.transact = function (tx, onSent, onSuccess, onFailed) {
        if (tx.timeout) delete tx.timeout;
        if (!tx.params) tx.params = [];
        if (tx.params && tx.params.constructor === Array &&
                    tx.params.length === 1) {
          tx.params = tx.params[0];
        }
        it("[object] " + JSON.stringify(t.params), function () {
          assert.deepEqual(tx, expected);
        });
        augur.transact = transact;
        next();
      };
      var labels = augur.tx[t.contract][t.method].inputs || [];
      var params = {onSent: noop, onSuccess: noop, onFailed: noop};
      for (i = 0; i < labels.length; ++i) {
        if (params[labels[i]]) continue;
        params[labels[i]] = t.params[i];
      }
      augur[t.contract][t.method](params);
    },
    positional: function (t, next) {
      var i, expected = clone(augur.tx[t.contract][t.method]);
      if (t.params && t.params.length === 1) {
        expected.params = t.params[0];
      } else {
        expected.params = clone(t.params);
      }
      var transact = augur.transact;
      augur.transact = function (tx, onSent, onSuccess, onFailed) {
        if (tx.timeout) delete tx.timeout;
        if (!tx.params) tx.params = [];
        if (tx.params && tx.params.constructor === Array &&
                    tx.params.length === 1) {
          tx.params = tx.params[0];
        }
        it("[positional] " + JSON.stringify(t.params), function () {
          assert.deepEqual(tx, expected);
        });
        augur.transact = transact;
        next();
      };
      augur[t.contract][t.method].apply(augur, t.params.concat([noop, noop, noop]));
    }
  }
};

var run = {
  eth_call: function (testCase, nextCase) {
    var method = testCase.method;
    var contract = testCase.contract;
    var numParams = testCase.parameters.length;
    var unitTestSamples = (numParams) ? tools.UNIT_TEST_SAMPLES : 0;
    var count = 0;
    async.whilst(
      function () {
        return count < unitTestSamples;
      },
      function (callback) {
        ++count;
        var params = new Array(numParams);
        var fixed = [], ether = [];
        for (var j = 0; j < numParams; ++j) {
          if (!testCase.parameters[j] || !random[testCase.parameters[j]])
            callback();
          params[j] = random[testCase.parameters[j]]();
          if (testCase.parameters[j] === "fixed") fixed.push(j);
          if (testCase.parameters[j] === "ether") ether.push(j);
        }
        if (!testCase.asyncOnly) {
          test.eth_call({
            contract: contract,
            method: method,
            params: params,
            fixed: fixed,
            ether: ether
          }, function () {
            test.eth_call({
              contract: contract,
              method: method,
              params: params,
              fixed: fixed,
              ether: ether,
              callback: noop
            }, callback);
          });
        } else {
          test.eth_call({
            contract: contract,
            method: method,
            params: params,
            fixed: fixed,
            ether: ether,
            callback: noop
          }, callback);
        }
      },
      nextCase
    );
  },
  eth_sendTransaction: function (testCase, nextCase) {
    var method = testCase.method;
    var contract = testCase.contract;
    var numParams = testCase.parameters.length;
    var unitTestSamples = (numParams) ? tools.UNIT_TEST_SAMPLES : 0;
    var count = 0;
    async.whilst(
      function () {
        return count < unitTestSamples;
      },
      function (callback) {
        ++count;
        var params = new Array(numParams);
        var fixed = [], ether = [];
        for (var j = 0; j < numParams; ++j) {
          if (testCase.parameters[j] === null ||
                  testCase.parameters[j] === undefined ||
                  !random[testCase.parameters[j]]) continue;
          params[j] = random[testCase.parameters[j]]();
          if (testCase.parameters[j] === "fixed") fixed.push(j);
          if (testCase.parameters[j] === "ether") ether.push(j);
        }
        var tests = {positional: null, object: null, complete: null};
        test.eth_sendTransaction.positional({
          contract: contract,
          method: method,
          params: params,
          fixed: fixed,
          ether: ether
        }, function () {
          tests.positional = true;
          if (tests.object && tests.complete === null) {
            tests.complete = true;
            callback();
          }
        });
        test.eth_sendTransaction.object({
          contract: contract,
          method: method,
          params: params,
          fixed: fixed,
          ether: ether
        }, function () {
          tests.object = true;
          if (tests.positional && tests.complete === null) {
            tests.complete = true;
            callback();
          }
        });
      },
      nextCase
    );
  },
};

module.exports = function (invocation, contract, cases) {
  async.each(cases, function (thisCase, nextCase) {
    thisCase.contract = contract;
    describe(thisCase.method, function () {
      run[invocation](thisCase, nextCase);
    });
  }, function (err) {
    if (err) throw new Error(JSON.stringify(err));
  });
};
