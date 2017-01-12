/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var augur = require("../../../src");
var constants = require("../../../src/constants");
var utils = require("../../../src/utilities");

describe("register", function () {

  var tx, api, getLogs;

  before(function () {
    api = augur.api;
    tx = augur.tx;
    getLogs = augur.rpc.getLogs;
    augur.api = new require("augur-contracts").Tx("2");
    augur.tx = augur.api.functions;
  });

  after(function () {
    augur.api = api;
    augur.tx = tx;
    augur.rpc.getLogs = getLogs;
  });

  describe("parseLastTime: parse last time from session logs", function () {
    var test = function (t) {
      it(t.description, function () {
        t.assertions(augur.parseLastTime(t.logs));
      });
    };
    test({
      description: "1 session log",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }],
      assertions: function (output) {
        assert.strictEqual(output.getTime(), 1473976053000);
      }
    });
    test({
      description: "2 session logs",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }, {
        data: "0x0000000000000000000000000000000000000000000000000000000057db1716",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000002"
        ]
      }],
      assertions: function (output) {
        assert.strictEqual(output.getTime(), 1473976086000);
      }
    });
  });

  describe("getRegisterTime: look up user's most recent register timestamp", function () {
    var test = function (t) {
      it(t.description, function (done) {
        augur.rpc.getLogs = function (filter, callback) {
          if (!callback) return t.logs;
          callback(t.logs);
        };
        augur.getRegisterTime(t.account, t.options, function (err, timestamp) {
          assert.isNull(err);
          t.assertions({
            async: timestamp,
            sync: augur.getRegisterTime(t.account, t.options)
          });
          done();
        });
      });
    };
    test({
      description: "no registers",
      account: "0xbob",
      logs: [],
      assertions: function (output) {
        assert.isObject(output);
        assert.isNull(output.sync);
        assert.isNull(output.async);
      }
    });
    test({
      description: "1 register",
      account: "0xb0b",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }],
      assertions: function (output) {
        assert.isObject(output);
        assert.strictEqual(output.sync.constructor, Date);
        assert.strictEqual(output.async.constructor, Date);
        assert.strictEqual(output.sync.getTime(), output.async.getTime());
        assert.strictEqual(output.async.getTime(), 1473976053000);
      }
    });
    test({
      description: "2 registers",
      account: "0xb0b",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }, {
        data: "0x0000000000000000000000000000000000000000000000000000000057db1716",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }],
      assertions: function (output) {
        assert.isObject(output);
        assert.strictEqual(output.sync.constructor, Date);
        assert.strictEqual(output.async.constructor, Date);
        assert.strictEqual(output.sync.getTime(), output.async.getTime());
        assert.strictEqual(output.async.getTime(), 1473976086000);
      }
    });
  });

  describe("getRegisterLogs", function () {
    var test = function (t) {
      it(t.description, function (done) {
        augur.rpc.getLogs = function (filter, callback) {
          if (!callback) return t.logs;
          callback(t.logs);
        };
        augur.getRegisterLogs(t.account, t.options, function (err, timestamp) {
          assert.isNull(err);
          t.assertions({
            async: timestamp,
            sync: augur.getRegisterLogs(t.account, t.options)
          });
          done();
        });
      });
    };
    test({
      description: "1 session log",
      account: "0xbob",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }],
      assertions: function (output) {
        assert.isObject(output);
        assert.isArray(output.sync);
        assert.isArray(output.async);
        assert.deepEqual(output.sync, output.async);
        var expected = [{
          data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
          topics: [
            "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
            "0x0000000000000000000000000000000000000000000000000000000000000b0b",
            "0x0000000000000000000000000000000000000000000000000000000000000001"
          ]
        }];
        assert.strictEqual(output.sync.length, expected.length);
        assert.strictEqual(output.async.length, expected.length);
        assert.deepEqual(output.async, expected);
      }
    });
    test({
      description: "2 session logs",
      account: "0xbob",
      logs: [{
        data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }, {
        data: "0x0000000000000000000000000000000000000000000000000000000057db1716",
        topics: [
          "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
          "0x0000000000000000000000000000000000000000000000000000000000000b0b",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
        ]
      }],
      assertions: function (output) {
        assert.isObject(output);
        assert.isArray(output.sync);
        assert.isArray(output.async);
        assert.deepEqual(output.sync, output.async);
        var expected = [{
          data: "0x0000000000000000000000000000000000000000000000000000000057db16f5",
          topics: [
            "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
            "0x0000000000000000000000000000000000000000000000000000000000000b0b",
            "0x0000000000000000000000000000000000000000000000000000000000000001"
          ]
        }, {
          data: "0x0000000000000000000000000000000000000000000000000000000057db1716",
          topics: [
            "0x19a49d2acfeb2c56bc742081b752ef527725fe0253f511d34d5364668b4475fe",
            "0x0000000000000000000000000000000000000000000000000000000000000b0b",
            "0x0000000000000000000000000000000000000000000000000000000000000001"
          ]
        }];
        assert.strictEqual(output.sync.length, expected.length);
        assert.strictEqual(output.async.length, expected.length);
        assert.deepEqual(output.async, expected);
      }
    });
  });
});
