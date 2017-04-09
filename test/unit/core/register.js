"use strict";

var assert = require("chai").assert;
var augur = new (require("../../../src"))();

describe("register.parseLastBlockNumber", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(augur.parseLastBlockNumber(t.logs));
    });
  };
  test({
    description: "1 register log",
    logs: [{
      blockNumber: 1
    }],
    assertions: function (output) {
      assert.strictEqual(output, 1);
    }
  });
  test({
    description: "2 register logs",
    logs: [{
      blockNumber: 1
    }, {
      blockNumber: 2
    }],
    assertions: function (output) {
      assert.strictEqual(output, 2);
    }
  });
});
describe("register.getRegisterBlockNumber", function () {
  var getLogs = augur.getLogs;
  var finished;
  afterEach(function () {
    augur.getLogs = getLogs;
  });
  var test = function (t) {
    it(t.description + ' async', function (done) {
      augur.getLogs = t.getLogs;
      finished = done;
      augur.getRegisterBlockNumber(t.account, t.options, t.callback);
    });
    it(t.description + 'sync', function (done) {
      augur.getLogs = t.getLogs;
      finished = done;
      var assertions = t.callback;
      var options = t.options;
      if (t.options && t.options.constructor === Function) {
        assertions = t.options;
        options = null;
      }
      assertions(augur.getRegisterBlockNumber(t.account, options));
    });
  };
  test({
    description: "no registers",
    account: "0xbob",
    logs: [],
    getLogs: function (label, params, callback) {
      if (!callback) return [];
      callback(null, []);
    },
    callback: function (err, blockNumber) {
      // in this case callback for both sync and async we need to test different values. if blockNumber is undefined then we are assuming this is from the sync test, if it is not undefined then it's coming from the async test.
      if (blockNumber === undefined) {
        // sync
        assert.isNull(err);
        assert.isUndefined(blockNumber);
      } else {
        // async
        assert.isNull(err);
        assert.isNull(blockNumber);
      }
      finished();
    }
  });
  test({
    description: "1 register",
    account: "0xb0b",
    logs: [{
      blockNumber: 2
    }],
    getLogs: function (label, params, callback) {
      if (!callback) return [{
        blockNumber: 2
      }];
      callback(null, [{
        blockNumber: 2
      }]);
    },
    options: function (err, blockNumber) {
      if (blockNumber === undefined) {
        // sync
        assert.deepEqual(err, 2);
        assert.isUndefined(blockNumber);
      } else {
        // async
        assert.isNull(err);
        assert.deepEqual(blockNumber, 2);
      }
      finished();
    }
  });
  test({
    description: "2 registers",
    account: "0xb0b",
    logs: [{
      blockNumber: 1
    }, {
      blockNumber: 2
    }],
    options: {},
    getLogs: function (label, params, callback) {
      if (!callback) return [{
        blockNumber: 1
      }, {
        blockNumber: 2
      }];
      callback(null, [{
        blockNumber: 1
      }, {
        blockNumber: 2
      }]);
    },
    callback: function (err, blockNumber) {
      if (blockNumber === undefined) {
        // sync
        assert.deepEqual(err, 2);
        assert.isUndefined(blockNumber);
      } else {
        // async
        assert.isNull(err);
        assert.deepEqual(blockNumber, 2);
      }
      finished();
    }
  });
  test({
    description: "error from getLogs",
    account: "0xb0b",
    logs: 'in this case, there will be an error',
    options: {},
    getLogs: function (label, params, callback) {
      if (!callback) return { error: 999, message: 'Uh-Oh!' };
      callback({ error: 999, message: 'Uh-Oh!' });
    },
    callback: function (err, blockNumber) {
      if (err === null) {
        // sync
        assert.isNull(err);
      } else {
        // async
        assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
      }
      assert.isUndefined(blockNumber);
      finished();
    }
  });

});
